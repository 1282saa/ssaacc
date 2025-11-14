#!/usr/bin/env python3
"""
Load youth policy text files into PostgreSQL with pgvector embeddings.
Uses AWS Bedrock Titan Embeddings V2 to generate 1024-dimensional vectors.
"""

import os
import re
import json
import boto3
import psycopg2
from psycopg2.extras import execute_values
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime


class PolicyLoader:
    """Load policy text files into PostgreSQL with vector embeddings."""

    def __init__(
        self,
        db_config: Dict[str, str],
        aws_profile: Optional[str] = None,
        s3_bucket: Optional[str] = None,
        s3_prefix: str = 'youth-policies/'
    ):
        """
        Initialize loader.

        Args:
            db_config: PostgreSQL connection config
            aws_profile: AWS profile name
            s3_bucket: S3 bucket name (optional)
            s3_prefix: S3 prefix/folder path
        """
        self.db_config = db_config
        self.s3_bucket = s3_bucket
        self.s3_prefix = s3_prefix

        # Initialize AWS Bedrock client
        session = boto3.Session(profile_name=aws_profile) if aws_profile else boto3.Session()
        self.bedrock = session.client('bedrock-runtime')

        # Connect to PostgreSQL
        self.conn = None
        self.connect_db()

    def connect_db(self):
        """Connect to PostgreSQL database."""
        try:
            self.conn = psycopg2.connect(**self.db_config)
            print("✅ Connected to PostgreSQL")
        except Exception as e:
            print(f"❌ Failed to connect to PostgreSQL: {e}")
            raise

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding using AWS Bedrock Titan Embeddings V2.

        Args:
            text: Text to embed

        Returns:
            List of 1024 floats
        """
        try:
            # Truncate text if too long (Titan V2 max: 8000 tokens ~= 32000 chars)
            if len(text) > 30000:
                text = text[:30000]

            response = self.bedrock.invoke_model(
                modelId='amazon.titan-embed-text-v2:0',
                body=json.dumps({
                    'inputText': text,
                    'dimensions': 1024,
                    'normalize': True
                })
            )

            response_body = json.loads(response['body'].read())
            embedding = response_body['embedding']

            return embedding

        except Exception as e:
            print(f"❌ Error generating embedding: {e}")
            raise

    def parse_policy_file(self, file_path: str) -> Dict[str, Any]:
        """
        Parse policy text file.

        Args:
            file_path: Path to text file

        Returns:
            Dictionary with parsed policy data
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        lines = [line.strip() for line in content.split('\n')]
        filename = os.path.basename(file_path)
        policy_name = filename.replace('.txt', '')

        # Initialize data structure
        data = {
            'policy_name': policy_name,
            'filename': filename,
            'full_text': content,
            'region': '',
            'category': '',
            'deadline': '',
            'summary': '',
            'last_modified': '',
            'scraps': 0,
            'views': 0,
            'tags': [],
            'policy_number': '',
            'support_content': '',
            'operation_period': '',
            'application_period': '',
            'support_scale': '',
            'eligibility': {},
            'application_info': {},
            'additional_info': {},
            's3_bucket': self.s3_bucket,
            's3_key': f"{self.s3_prefix}{filename}" if self.s3_bucket else None
        }

        # Extract basic fields
        for i, line in enumerate(lines[:15]):
            if '전국' in line or '서울' in line:
                data['region'] = line
            elif '일자리' in line or '복지문화' in line or '주거' in line:
                data['category'] = line
            elif 'D-' in line or '상시' in line or '신청마감' in line:
                data['deadline'] = line
            elif line.startswith('최종 수정일'):
                data['last_modified'] = line.replace('최종 수정일', '').strip()
            elif line.startswith('스크랩 수'):
                nums = re.findall(r'\d+', line)
                if nums:
                    data['scraps'] = int(nums[0])
            elif line.startswith('조회수'):
                nums = re.findall(r'\d+', line)
                if nums:
                    data['views'] = int(nums[0])
            elif line.startswith('#'):
                data['tags'] = [t.strip() for t in line.split('#') if t.strip()]

        # Extract policy name and summary
        for i, line in enumerate(lines):
            if i >= 5 and i < 15 and len(line) > 10 and any(kw in line for kw in ['청년', '지원', '사업', '계좌', '급여']):
                if not line.startswith('최종') and not line.startswith('#'):
                    data['policy_name'] = line
                    break

        # Extract summary (after tags)
        for i, line in enumerate(lines):
            if line.startswith('#') and i + 1 < len(lines):
                potential_summary = lines[i + 1]
                if len(potential_summary) > 20:
                    data['summary'] = potential_summary
                    break

        # Extract policy number
        for i, line in enumerate(lines):
            if '정책번호' in line and i + 1 < len(lines):
                if lines[i + 1].isdigit():
                    data['policy_number'] = lines[i + 1]
                    break

        # Extract eligibility
        eligibility_fields = {
            '연령': 'age',
            '거주지역': 'region',
            '소득': 'income',
            '학력': 'education',
            '전공': 'major',
            '취업상태': 'employment_status'
        }

        for kr, en in eligibility_fields.items():
            for i, line in enumerate(lines):
                if line == kr and i + 1 < len(lines):
                    data['eligibility'][en] = lines[i + 1]
                    break

        # Extract application website
        for i, line in enumerate(lines):
            if '신청 사이트' in line and i + 1 < len(lines):
                if lines[i + 1].startswith('http'):
                    data['application_info']['website'] = lines[i + 1]
                    break

        # Extract agencies
        for i, line in enumerate(lines):
            if '주관 기관' in line and i + 1 < len(lines):
                data['additional_info']['supervising_agency'] = lines[i + 1]
            elif '운영 기관' in line and i + 1 < len(lines):
                data['additional_info']['operating_agency'] = lines[i + 1]

        return data

    def insert_policy(self, policy_data: Dict[str, Any]):
        """
        Insert policy into PostgreSQL with embedding.

        Args:
            policy_data: Parsed policy data
        """
        cursor = self.conn.cursor()

        try:
            # Generate embedding from full text
            print(f"  🔄 Generating embedding for: {policy_data['policy_name']}")
            embedding = self.generate_embedding(policy_data['full_text'])

            # Convert embedding to PostgreSQL vector format
            embedding_str = '[' + ','.join(map(str, embedding)) + ']'

            # Insert into database
            cursor.execute("""
                INSERT INTO youth_policies (
                    policy_name, policy_number, filename, region, category, deadline,
                    summary, full_text, last_modified, scraps, views, tags,
                    support_content, operation_period, application_period, support_scale,
                    eligibility, application_info, additional_info,
                    embedding, s3_bucket, s3_key
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s::jsonb, %s::jsonb, %s::jsonb, %s::vector, %s, %s
                )
                ON CONFLICT (filename) DO UPDATE SET
                    policy_name = EXCLUDED.policy_name,
                    full_text = EXCLUDED.full_text,
                    embedding = EXCLUDED.embedding,
                    updated_at = CURRENT_TIMESTAMP
            """, (
                policy_data['policy_name'],
                policy_data['policy_number'],
                policy_data['filename'],
                policy_data['region'],
                policy_data['category'],
                policy_data['deadline'],
                policy_data['summary'],
                policy_data['full_text'],
                policy_data['last_modified'],
                policy_data['scraps'],
                policy_data['views'],
                policy_data['tags'],
                policy_data['support_content'],
                policy_data['operation_period'],
                policy_data['application_period'],
                policy_data['support_scale'],
                json.dumps(policy_data['eligibility'], ensure_ascii=False),
                json.dumps(policy_data['application_info'], ensure_ascii=False),
                json.dumps(policy_data['additional_info'], ensure_ascii=False),
                embedding_str,
                policy_data['s3_bucket'],
                policy_data['s3_key']
            ))

            self.conn.commit()
            print(f"  ✅ Inserted: {policy_data['policy_name']}")

        except Exception as e:
            self.conn.rollback()
            print(f"  ❌ Error inserting {policy_data['filename']}: {e}")
            raise

        finally:
            cursor.close()

    def load_directory(self, dir_path: str):
        """
        Load all txt files from directory.

        Args:
            dir_path: Path to directory containing txt files
        """
        policy_dir = Path(dir_path)
        txt_files = list(policy_dir.glob('*.txt'))

        print(f"\n📂 Found {len(txt_files)} txt files in {dir_path}")
        print(f"🔄 Starting data loading...\n")

        success = 0
        failed = 0

        for file_path in txt_files:
            try:
                print(f"📄 Processing: {file_path.name}")
                policy_data = self.parse_policy_file(str(file_path))
                self.insert_policy(policy_data)
                success += 1
                print()

            except Exception as e:
                print(f"  ❌ Failed: {e}\n")
                failed += 1

        print("=" * 60)
        print("📊 Summary:")
        print(f"  ✅ Successfully loaded: {success}")
        print(f"  ❌ Failed: {failed}")
        print(f"  📦 Total: {len(txt_files)}")
        print("=" * 60)

    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()
            print("\n✅ Database connection closed")


def main():
    """Main function."""

    print("=" * 60)
    print("Youth Policy Data Loader - PostgreSQL + pgvector")
    print("=" * 60)
    print()

    # Database configuration
    print("📝 Database Configuration:")
    db_config = {
        'host': input("  PostgreSQL host (default: localhost): ").strip() or 'localhost',
        'port': input("  PostgreSQL port (default: 5432): ").strip() or '5432',
        'database': input("  Database name (default: finkurn): ").strip() or 'finkurn',
        'user': input("  Username (default: postgres): ").strip() or 'postgres',
        'password': input("  Password: ").strip()
    }

    print()
    print("☁️  AWS Configuration:")
    aws_profile = input("  AWS profile (press Enter for default): ").strip() or None
    s3_bucket = input("  S3 bucket name (optional): ").strip() or None
    s3_prefix = input("  S3 prefix (default: youth-policies/): ").strip() or 'youth-policies/'

    # Local directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    policies_dir = project_root / 'docs' / '청년'

    print()
    print("=" * 60)
    print("Configuration Summary:")
    print("=" * 60)
    print(f"📂 Local directory: {policies_dir}")
    print(f"🗄️  Database: {db_config['user']}@{db_config['host']}:{db_config['port']}/{db_config['database']}")
    print(f"☁️  S3 bucket: {s3_bucket or 'Not configured'}")
    print(f"🤖 AWS Bedrock: Titan Embeddings V2 (1024d)")
    print("=" * 60)
    print()

    confirm = input("Proceed with data loading? (y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ Operation cancelled")
        return

    print()

    # Initialize loader and load data
    try:
        loader = PolicyLoader(
            db_config=db_config,
            aws_profile=aws_profile,
            s3_bucket=s3_bucket,
            s3_prefix=s3_prefix
        )

        loader.load_directory(str(policies_dir))
        loader.close()

        print("\n✅ Data loading completed successfully!")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        return


if __name__ == '__main__':
    main()
