"""
Milvus Vector Database Client
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Milvus 벡터 DB 연결 및 검색 기능:
- AWS Bedrock Titan Embeddings V2 (1024차원)
- 정책 데이터 유사도 검색
- 컬렉션 관리
"""

from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType, utility
from loguru import logger
import os
from typing import List, Dict, Any, Optional


class MilvusClient:
    """Milvus 벡터 데이터베이스 클라이언트"""

    def __init__(self):
        self.host = os.getenv("MILVUS_HOST", "localhost")
        self.port = int(os.getenv("MILVUS_PORT", "19530"))
        self.collection_name = "policy_embeddings"
        self.dimension = 1024  # AWS Bedrock Titan Embeddings V2
        self.collection: Optional[Collection] = None

    def connect(self):
        """Milvus 서버에 연결"""
        try:
            connections.connect(
                alias="default",
                host=self.host,
                port=self.port,
            )
            logger.info(f"✅ Connected to Milvus at {self.host}:{self.port}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to connect to Milvus: {str(e)}")
            return False

    def check_connection(self) -> bool:
        """연결 상태 확인"""
        try:
            return connections.has_connection("default")
        except:
            return False

    def create_collection(self):
        """
        정책 데이터용 컬렉션 생성

        Schema:
        - id: 정책 고유 ID
        - policy_id: 정책 번호 (검색 결과 매핑용)
        - embedding: 벡터 임베딩 (1024차원)
        - metadata: JSON 메타데이터 (정책명, 대상 등)
        """
        try:
            # 이미 존재하면 로드
            if utility.has_collection(self.collection_name):
                logger.info(f"Collection '{self.collection_name}' already exists")
                self.collection = Collection(self.collection_name)
                return True

            # 스키마 정의
            fields = [
                FieldSchema(
                    name="id",
                    dtype=DataType.INT64,
                    is_primary=True,
                    auto_id=True,
                ),
                FieldSchema(
                    name="policy_id",
                    dtype=DataType.VARCHAR,
                    max_length=100,
                ),
                FieldSchema(
                    name="embedding",
                    dtype=DataType.FLOAT_VECTOR,
                    dim=self.dimension,
                ),
                FieldSchema(
                    name="metadata",
                    dtype=DataType.VARCHAR,
                    max_length=10000,  # JSON string
                ),
            ]

            schema = CollectionSchema(
                fields=fields,
                description="Policy embeddings for semantic search",
            )

            # 컬렉션 생성
            self.collection = Collection(
                name=self.collection_name,
                schema=schema,
            )

            # 인덱스 생성 (IVF_FLAT: 중간 성능, 정확도 균형)
            index_params = {
                "metric_type": "COSINE",  # 코사인 유사도
                "index_type": "IVF_FLAT",
                "params": {"nlist": 128},
            }
            self.collection.create_index(
                field_name="embedding",
                index_params=index_params,
            )

            logger.info(f"✅ Created collection '{self.collection_name}'")
            return True

        except Exception as e:
            logger.error(f"❌ Failed to create collection: {str(e)}")
            return False

    def load_collection(self):
        """컬렉션을 메모리에 로드 (검색 전 필수)"""
        try:
            if self.collection is None:
                self.collection = Collection(self.collection_name)

            self.collection.load()
            logger.info(f"✅ Loaded collection '{self.collection_name}'")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to load collection: {str(e)}")
            return False

    def insert_embeddings(
        self, policy_ids: List[str], embeddings: List[List[float]], metadata: List[str]
    ):
        """
        정책 임베딩 삽입

        Args:
            policy_ids: 정책 ID 리스트
            embeddings: 벡터 임베딩 리스트 (각 1024차원)
            metadata: JSON 문자열 메타데이터 리스트
        """
        try:
            entities = [
                policy_ids,
                embeddings,
                metadata,
            ]

            insert_result = self.collection.insert(entities)
            self.collection.flush()

            logger.info(
                f"✅ Inserted {len(policy_ids)} embeddings into Milvus"
            )
            return insert_result

        except Exception as e:
            logger.error(f"❌ Failed to insert embeddings: {str(e)}")
            raise

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        output_fields: List[str] = ["policy_id", "metadata"],
    ) -> List[Dict[str, Any]]:
        """
        벡터 유사도 검색

        Args:
            query_embedding: 쿼리 벡터 (1024차원)
            top_k: 반환할 결과 개수
            output_fields: 반환할 필드 리스트

        Returns:
            [
                {
                    "id": 1,
                    "distance": 0.95,  # 코사인 유사도
                    "policy_id": "POLICY_001",
                    "metadata": "{...}"
                },
                ...
            ]
        """
        try:
            search_params = {
                "metric_type": "COSINE",
                "params": {"nprobe": 10},
            }

            results = self.collection.search(
                data=[query_embedding],
                anns_field="embedding",
                param=search_params,
                limit=top_k,
                output_fields=output_fields,
            )

            # 결과 포맷팅
            formatted_results = []
            for hits in results:
                for hit in hits:
                    result = {
                        "id": hit.id,
                        "distance": hit.distance,
                    }
                    # output_fields 추가
                    for field in output_fields:
                        result[field] = hit.entity.get(field)

                    formatted_results.append(result)

            logger.info(f"🔍 Found {len(formatted_results)} results from Milvus")
            return formatted_results

        except Exception as e:
            logger.error(f"❌ Search failed: {str(e)}")
            return []

    def count(self) -> int:
        """컬렉션의 총 엔티티 수"""
        try:
            if self.collection is None:
                self.collection = Collection(self.collection_name)
            return self.collection.num_entities
        except Exception as e:
            logger.error(f"❌ Failed to count entities: {str(e)}")
            return 0

    def disconnect(self):
        """Milvus 연결 종료"""
        try:
            connections.disconnect("default")
            logger.info("👋 Disconnected from Milvus")
        except Exception as e:
            logger.error(f"❌ Failed to disconnect: {str(e)}")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Singleton Instance
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_milvus_client: Optional[MilvusClient] = None


def get_milvus_client() -> MilvusClient:
    """Milvus 클라이언트 싱글톤 인스턴스"""
    global _milvus_client
    if _milvus_client is None:
        _milvus_client = MilvusClient()
    return _milvus_client


async def init_milvus():
    """
    서버 시작 시 Milvus 초기화
    - 연결
    - 컬렉션 생성/로드
    """
    client = get_milvus_client()
    client.connect()
    client.create_collection()
    client.load_collection()

    count = client.count()
    logger.info(f"📊 Milvus has {count} policy embeddings")


def check_connection() -> bool:
    """헬스체크용 연결 상태 확인"""
    try:
        client = get_milvus_client()
        return client.check_connection()
    except:
        return False
