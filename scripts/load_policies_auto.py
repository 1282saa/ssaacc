#!/usr/bin/env python3
"""
Automated policy loading script (non-interactive version).
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Import the loader
from load_policies_to_postgres import PolicyLoader
from pathlib import Path

def main():
    # Database configuration (localhost Docker)
    db_config = {
        'host': 'localhost',
        'port': '5432',
        'database': 'finkurn',
        'user': 'postgres',
        'password': os.getenv('DB_PASSWORD', 'your-password')
    }

    # AWS and S3 config
    aws_profile = None
    s3_bucket = 'policy-news-virginia'
    s3_prefix = 'youth-policies/'

    # Local directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    policies_dir = project_root / 'docs' / '청년'

    print("=" * 60)
    print("Automated Policy Data Loader")
    print("=" * 60)
    print(f"📂 Local directory: {policies_dir}")
    print(f"🗄️  Database: postgres@localhost:5432/finkurn")
    print(f"☁️  S3 bucket: {s3_bucket}")
    print(f"🤖 AWS Bedrock: Titan Embeddings V2 (1024d)")
    print("=" * 60)
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
        print("\n📋 Next steps:")
        print("   1. Test chatbot: python3 bedrock_chatbot_auto.py")
        print("   2. Query database: docker exec -it finkurn-postgres psql -U postgres -d finkurn")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
