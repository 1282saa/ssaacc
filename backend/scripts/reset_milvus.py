#!/usr/bin/env python3
"""
Milvus Collection Reset Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Milvus 컬렉션을 삭제하고 재생성하는 스크립트

## 사용법:
```bash
python scripts/reset_milvus.py
```
"""

import sys
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from pymilvus import connections, utility
from loguru import logger
import os


def main():
    """Milvus 컬렉션 삭제"""
    logger.info("=" * 60)
    logger.info("🔄 Milvus Collection Reset")
    logger.info("=" * 60)

    try:
        # Milvus 연결
        host = os.getenv("MILVUS_HOST", "milvus")
        port = int(os.getenv("MILVUS_PORT", "19530"))

        connections.connect(
            alias="default",
            host=host,
            port=port,
        )
        logger.info(f"✅ Connected to Milvus at {host}:{port}")

        # 컬렉션 삭제
        collection_name = "policy_embeddings"

        if utility.has_collection(collection_name):
            utility.drop_collection(collection_name)
            logger.info(f"✅ Dropped collection '{collection_name}'")
        else:
            logger.info(f"⚠️  Collection '{collection_name}' does not exist")

        # 연결 종료
        connections.disconnect("default")
        logger.info("👋 Disconnected from Milvus")

        logger.info("\n" + "=" * 60)
        logger.info("✅ Milvus Collection Reset Completed!")
        logger.info("=" * 60)

    except Exception as e:
        logger.error(f"\n❌ Error: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)


if __name__ == "__main__":
    main()
