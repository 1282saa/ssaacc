#!/usr/bin/env python3
"""
청년월세 데이터를 S3에 업로드하고 PostgreSQL + pgvector에 임베딩하는 스크립트
"""

import os
import json
import boto3
import psycopg2
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

# 설정
DATA_DIR = "/Users/yeong-gwang/Documents/배움 오전 1.38.42/외부/공모전/새싹ai/데이터/청년월세"
S3_BUCKET = "finkurn-policy-data"
S3_PREFIX = "policies/monthly-rent/"

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': '5432',
    'database': 'finkurn',
    'user': 'postgres',
    'password': 'finkurn2024'
}

# AWS Bedrock client for embeddings
bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')


def generate_embedding(text: str) -> List[float]:
    """Generate embedding using Amazon Titan Embeddings V2"""
    response = bedrock.invoke_model(
        modelId='amazon.titan-embed-text-v2:0',
        body=json.dumps({
            'inputText': text,
            'dimensions': 1024,
            'normalize': True
        })
    )

    response_body = json.loads(response['body'].read())
    return response_body['embedding']


def parse_policy_file(file_path: str) -> Dict[str, Any]:
    """Parse policy text file and extract structured information"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = [line.strip() for line in content.split('\n') if line.strip()]

    # Extract policy name (first non-empty line)
    policy_name = lines[0] if lines else os.path.basename(file_path).replace('.txt', '')

    # Parse content
    policy_data = {
        'policy_name': policy_name,
        'category': '주거',
        'region': '서울',  # Most of these are Seoul-specific
        'deadline': '상시',
        'summary': '',
        'support_content': '',
        'eligibility': {},
        'application_info': {},
        'additional_info': {},
        'tags': ['청년', '월세', '주거지원', '서울'],
        'full_text': content
    }

    # Extract specific sections
    current_section = None
    for line in lines:
        if '지원대상' in line or '대상자' in line:
            current_section = 'eligibility'
        elif '지원내용' in line or '지원규모' in line:
            current_section = 'support'
        elif '신청방법' in line or '신청' in line:
            current_section = 'application'
        elif line.startswith('※'):
            if current_section == 'support':
                policy_data['support_content'] += line + '\n'
        elif current_section == 'eligibility':
            if '연령' in line or '만' in line:
                policy_data['eligibility']['age'] = line
            elif '소득' in line:
                policy_data['eligibility']['income'] = line
            elif '주거' in line or '거주' in line:
                policy_data['eligibility']['residence'] = line
        elif current_section == 'support':
            policy_data['support_content'] += line + '\n'
        elif current_section == 'application':
            if 'http' in line or 'www' in line:
                policy_data['application_info']['website'] = line
            elif '전화' in line or '☎' in line or '콜' in line:
                policy_data['application_info']['contact'] = line

    # Generate summary
    summary_parts = []
    if policy_data['support_content']:
        summary_parts.append(policy_data['support_content'].split('\n')[0][:100])
    if policy_data['eligibility']:
        age_info = policy_data['eligibility'].get('age', '')
        if age_info:
            summary_parts.append(age_info)

    policy_data['summary'] = ' '.join(summary_parts) if summary_parts else policy_name

    return policy_data


def upload_to_s3(file_path: str, policy_name: str) -> tuple:
    """Upload file to S3 and return bucket/key"""
    file_name = os.path.basename(file_path)
    s3_key = f"{S3_PREFIX}{file_name}"

    try:
        s3.upload_file(file_path, S3_BUCKET, s3_key)
        print(f"✅ Uploaded {file_name} to S3: s3://{S3_BUCKET}/{s3_key}")
        return S3_BUCKET, s3_key
    except Exception as e:
        print(f"❌ Failed to upload {file_name} to S3: {e}")
        return None, None


def insert_to_database(policy_data: Dict[str, Any], s3_bucket: str, s3_key: str):
    """Insert policy data with embedding into PostgreSQL"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    try:
        # Generate embedding
        embedding_text = f"{policy_data['policy_name']} {policy_data['summary']} {policy_data['support_content']}"
        print(f"🔄 Generating embedding for: {policy_data['policy_name'][:50]}...")
        embedding = generate_embedding(embedding_text)
        embedding_str = '[' + ','.join(map(str, embedding)) + ']'

        # Check if policy already exists
        cursor.execute("SELECT id FROM youth_policies WHERE policy_name = %s", (policy_data['policy_name'],))
        existing = cursor.fetchone()

        if existing:
            print(f"   ⚠️  Policy already exists, skipping: {policy_data['policy_name']}")
            return

        # Generate filename from policy name
        filename = policy_data['policy_name'].replace(' ', '_')[:100] + '.txt'

        # Insert data
        cursor.execute("""
            INSERT INTO youth_policies (
                policy_name,
                filename,
                full_text,
                category,
                region,
                deadline,
                summary,
                support_content,
                eligibility,
                application_info,
                additional_info,
                tags,
                s3_bucket,
                s3_key,
                embedding
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s::vector
            )
        """, (
            policy_data['policy_name'],
            filename,
            policy_data['full_text'],
            policy_data['category'],
            policy_data['region'],
            policy_data['deadline'],
            policy_data['summary'],
            policy_data['support_content'],
            json.dumps(policy_data['eligibility'], ensure_ascii=False),
            json.dumps(policy_data['application_info'], ensure_ascii=False),
            json.dumps(policy_data['additional_info'], ensure_ascii=False),
            policy_data['tags'],
            s3_bucket,
            s3_key,
            embedding_str
        ))

        conn.commit()
        print(f"✅ Inserted to database: {policy_data['policy_name']}")

    except Exception as e:
        print(f"❌ Failed to insert {policy_data['policy_name']}: {e}")
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


def main():
    print("=" * 80)
    print("청년월세 데이터 업로드 & 임베딩 스크립트")
    print("=" * 80)
    print()

    # Get all .txt files
    data_path = Path(DATA_DIR)
    txt_files = list(data_path.glob("*.txt"))

    print(f"📁 Found {len(txt_files)} policy files")
    print()

    for txt_file in txt_files:
        print(f"\n{'=' * 80}")
        print(f"Processing: {txt_file.name}")
        print(f"{'=' * 80}")

        try:
            # Parse policy file
            print("1️⃣  Parsing policy data...")
            policy_data = parse_policy_file(str(txt_file))
            print(f"   Policy: {policy_data['policy_name']}")
            print(f"   Category: {policy_data['category']}")
            print(f"   Summary: {policy_data['summary'][:100]}...")

            # Upload to S3 (optional - skip if bucket doesn't exist)
            print("\n2️⃣  Uploading to S3...")
            try:
                s3_bucket, s3_key = upload_to_s3(str(txt_file), policy_data['policy_name'])
            except Exception as e:
                print(f"   ⚠️  S3 upload skipped: {e}")
                s3_bucket, s3_key = None, str(txt_file)

            # Insert to database with embedding
            print("\n3️⃣  Inserting to PostgreSQL + pgvector...")
            insert_to_database(policy_data, s3_bucket, s3_key)

            print(f"\n✅ Successfully processed: {txt_file.name}")

        except Exception as e:
            print(f"\n❌ Error processing {txt_file.name}: {e}")
            import traceback
            traceback.print_exc()
            continue

    print("\n" + "=" * 80)
    print("✅ All files processed!")
    print("=" * 80)

    # Verify insertions
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT COUNT(*)
        FROM youth_policies
        WHERE category = '주거' AND embedding IS NOT NULL
    """)
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()

    print(f"\n📊 Total housing policies with embeddings: {count}")
    print()


if __name__ == '__main__':
    main()
