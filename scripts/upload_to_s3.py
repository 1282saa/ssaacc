#!/usr/bin/env python3
"""
Upload youth policy text files to AWS S3.
"""

import os
import boto3
from pathlib import Path
from botocore.exceptions import ClientError


def upload_files_to_s3(
    local_dir: str,
    bucket_name: str,
    s3_prefix: str = 'youth-policies/',
    aws_profile: str = None
):
    """
    Upload all txt files from local directory to S3.

    Args:
        local_dir: Local directory containing txt files
        bucket_name: S3 bucket name
        s3_prefix: Prefix (folder path) in S3 bucket
        aws_profile: AWS profile name (optional)
    """

    # Initialize S3 client
    session = boto3.Session(profile_name=aws_profile) if aws_profile else boto3.Session()
    s3_client = session.client('s3')

    # Get list of txt files
    local_path = Path(local_dir)
    txt_files = list(local_path.glob('*.txt'))

    print(f"📂 Found {len(txt_files)} txt files in {local_dir}")
    print(f"☁️  Uploading to s3://{bucket_name}/{s3_prefix}")
    print()

    uploaded = 0
    failed = 0

    for file_path in txt_files:
        filename = file_path.name
        s3_key = f"{s3_prefix}{filename}"

        try:
            # Upload file
            s3_client.upload_file(
                str(file_path),
                bucket_name,
                s3_key,
                ExtraArgs={'ContentType': 'text/plain; charset=utf-8'}
            )
            print(f"✅ Uploaded: {filename} -> {s3_key}")
            uploaded += 1

        except ClientError as e:
            print(f"❌ Failed: {filename} - {e}")
            failed += 1

    print()
    print(f"📊 Summary:")
    print(f"  ✅ Uploaded: {uploaded}")
    print(f"  ❌ Failed: {failed}")
    print(f"  📦 Total: {len(txt_files)}")


def main():
    """Main function."""

    # Configuration
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    local_dir = project_root / 'docs' / '청년'

    # S3 configuration - EDIT THESE VALUES
    BUCKET_NAME = input("Enter S3 bucket name: ").strip()
    S3_PREFIX = input("Enter S3 prefix (folder path, default='youth-policies/'): ").strip() or 'youth-policies/'
    AWS_PROFILE = input("Enter AWS profile name (press Enter for default): ").strip() or None

    if not BUCKET_NAME:
        print("❌ Error: Bucket name is required")
        return

    # Ensure prefix ends with /
    if S3_PREFIX and not S3_PREFIX.endswith('/'):
        S3_PREFIX += '/'

    print()
    print("=" * 60)
    print("AWS S3 Upload Configuration")
    print("=" * 60)
    print(f"Local directory: {local_dir}")
    print(f"S3 bucket: {BUCKET_NAME}")
    print(f"S3 prefix: {S3_PREFIX}")
    print(f"AWS profile: {AWS_PROFILE or 'default'}")
    print("=" * 60)
    print()

    confirm = input("Proceed with upload? (y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ Upload cancelled")
        return

    # Upload files
    upload_files_to_s3(
        local_dir=str(local_dir),
        bucket_name=BUCKET_NAME,
        s3_prefix=S3_PREFIX,
        aws_profile=AWS_PROFILE
    )


if __name__ == '__main__':
    main()
