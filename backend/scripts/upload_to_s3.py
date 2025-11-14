#!/usr/bin/env python3
"""
S3 Upload Script for Youth Policy Documents

This script uploads txt files from the youth policy directory to AWS S3.
"""

import os
import boto3
from pathlib import Path
from typing import List, Dict
import json
from datetime import datetime

# AWS Configuration from environment
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# S3 Configuration
BUCKET_NAME = "financial-policy-news"  # 버킷 이름 (생성 필요)
S3_PREFIX = "policies/youth/"  # S3 내 폴더 경로

# Local file path
LOCAL_DATA_PATH = "/Users/yeong-gwang/Documents/배움 오전 1.38.42/외부/공모전/새싹ai/데이터/청년"


def create_s3_client():
    """Create and return S3 client"""
    return boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )


def create_bucket_if_not_exists(s3_client, bucket_name: str):
    """Create S3 bucket if it doesn't exist"""
    try:
        s3_client.head_bucket(Bucket=bucket_name)
        print(f"✓ Bucket '{bucket_name}' already exists")
    except:
        try:
            if AWS_REGION == 'us-east-1':
                s3_client.create_bucket(Bucket=bucket_name)
            else:
                s3_client.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': AWS_REGION}
                )
            print(f"✓ Created bucket '{bucket_name}'")
        except Exception as e:
            print(f"✗ Error creating bucket: {e}")
            raise


def upload_file_to_s3(s3_client, local_path: str, bucket: str, s3_key: str) -> Dict:
    """Upload a single file to S3"""
    try:
        # Upload file
        s3_client.upload_file(
            local_path,
            bucket,
            s3_key,
            ExtraArgs={
                'ContentType': 'text/plain; charset=utf-8',
                'ContentEncoding': 'utf-8'
            }
        )

        # Get file size
        file_size = os.path.getsize(local_path)

        # Generate S3 URL
        s3_url = f"https://{bucket}.s3.{AWS_REGION}.amazonaws.com/{s3_key}"

        return {
            "status": "success",
            "local_path": local_path,
            "s3_key": s3_key,
            "s3_url": s3_url,
            "file_size": file_size
        }
    except Exception as e:
        return {
            "status": "error",
            "local_path": local_path,
            "error": str(e)
        }


def upload_all_files(local_dir: str, bucket: str, s3_prefix: str) -> List[Dict]:
    """Upload all txt files from local directory to S3"""
    s3_client = create_s3_client()

    # Create bucket if needed
    create_bucket_if_not_exists(s3_client, bucket)

    # Find all txt files
    txt_files = list(Path(local_dir).glob("*.txt"))
    print(f"\nFound {len(txt_files)} txt files to upload\n")

    results = []

    for i, file_path in enumerate(txt_files, 1):
        filename = file_path.name
        s3_key = f"{s3_prefix}{filename}"

        print(f"[{i}/{len(txt_files)}] Uploading: {filename}")

        result = upload_file_to_s3(
            s3_client,
            str(file_path),
            bucket,
            s3_key
        )

        results.append(result)

        if result["status"] == "success":
            print(f"  ✓ Uploaded: {result['s3_url']}")
            print(f"  Size: {result['file_size']:,} bytes")
        else:
            print(f"  ✗ Error: {result['error']}")

        print()

    return results


def save_upload_report(results: List[Dict], output_path: str):
    """Save upload results to JSON file"""
    report = {
        "timestamp": datetime.now().isoformat(),
        "total_files": len(results),
        "successful_uploads": len([r for r in results if r["status"] == "success"]),
        "failed_uploads": len([r for r in results if r["status"] == "error"]),
        "files": results
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Upload report saved to: {output_path}")
    return report


def main():
    """Main execution function"""
    print("=" * 60)
    print("S3 Upload Script for Youth Policy Documents")
    print("=" * 60)
    print(f"Local directory: {LOCAL_DATA_PATH}")
    print(f"S3 bucket: {BUCKET_NAME}")
    print(f"S3 prefix: {S3_PREFIX}")
    print("=" * 60)

    # Upload files
    results = upload_all_files(LOCAL_DATA_PATH, BUCKET_NAME, S3_PREFIX)

    # Save report
    report_path = os.path.join(
        os.path.dirname(__file__),
        f"s3_upload_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    )
    report = save_upload_report(results, report_path)

    # Print summary
    print("\n" + "=" * 60)
    print("UPLOAD SUMMARY")
    print("=" * 60)
    print(f"Total files: {report['total_files']}")
    print(f"✓ Successful: {report['successful_uploads']}")
    print(f"✗ Failed: {report['failed_uploads']}")
    print("=" * 60)

    if report['successful_uploads'] > 0:
        print("\nS3 URLs:")
        for result in results:
            if result["status"] == "success":
                print(f"  - {result['s3_url']}")


if __name__ == "__main__":
    main()
