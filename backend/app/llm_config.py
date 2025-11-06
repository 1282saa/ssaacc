"""
LLM 설정 및 초기화
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 역할:
- AWS Bedrock 또는 직접 API를 사용하여 LLM 초기화
- 환경 변수에 따라 자동으로 적절한 LLM 선택
- 모든 에이전트에서 공통으로 사용

## 지원하는 LLM:
1. **AWS Bedrock (추천)**:
   - Claude 3.5 Sonnet (추론용)
   - Titan Embeddings (임베딩용)
   - AWS 자격 증명만 필요 (별도 API 키 불필요)

2. **Direct API**:
   - Anthropic Claude API (추론용)
   - OpenAI API (임베딩용)
   - 각각 API 키 필요

## 사용 방법:
```python
from app.llm_config import get_chat_llm, get_embeddings

# 채팅용 LLM 가져오기
llm = get_chat_llm()

# 임베딩 모델 가져오기
embeddings = get_embeddings()
```

## 환경 변수:
- USE_AWS_BEDROCK=true → AWS Bedrock 사용
- USE_AWS_BEDROCK=false → 직접 API 사용
"""

import os
from typing import Optional
from loguru import logger


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 환경 변수 확인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USE_AWS_BEDROCK = os.getenv("USE_AWS_BEDROCK", "false").lower() == "true"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LLM 초기화 함수
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def get_chat_llm(temperature: float = 0.7, max_tokens: int = 4000):
    """
    채팅용 LLM 가져오기

    ## 설명:
    환경 변수에 따라 AWS Bedrock 또는 직접 Anthropic API를 사용합니다.

    ## Args:
        temperature (float): 응답의 무작위성 (0.0~1.0)
            - 0.0: 매우 결정적
            - 1.0: 매우 창의적
        max_tokens (int): 최대 토큰 수

    ## Returns:
        ChatModel: LangChain 호환 채팅 모델

    ## 사용 예시:
    ```python
    llm = get_chat_llm(temperature=0.3)  # 일관된 응답
    response = await llm.ainvoke([
        SystemMessage(content="You are a helpful assistant"),
        HumanMessage(content="Hello!")
    ])
    ```
    """
    if USE_AWS_BEDROCK:
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 옵션 1: AWS Bedrock 사용
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        try:
            from langchain_aws import ChatBedrock
            import boto3

            logger.info("🔧 AWS Bedrock으로 LLM 초기화")

            # AWS 자격 증명 (환경 변수 또는 ~/.aws/credentials)
            session = boto3.Session(
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION", "us-east-1"),
            )

            bedrock_runtime = session.client("bedrock-runtime")

            # Claude 3.5 Sonnet on AWS Bedrock
            llm = ChatBedrock(
                client=bedrock_runtime,
                model_id="anthropic.claude-3-5-sonnet-20241022-v2:0",  # Bedrock 모델 ID
                model_kwargs={
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )

            logger.info("✅ AWS Bedrock Claude 3.5 Sonnet 초기화 완료")
            return llm

        except Exception as e:
            logger.error(f"❌ AWS Bedrock 초기화 실패: {str(e)}")
            logger.warning("⚠️  Direct API로 폴백합니다")
            # 폴백: 직접 API 사용
            pass

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 옵션 2: Direct Anthropic API 사용
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    from langchain_anthropic import ChatAnthropic

    logger.info("🔧 Direct Anthropic API로 LLM 초기화")

    llm = ChatAnthropic(
        model="claude-3-5-sonnet-20241022",
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
        temperature=temperature,
        max_tokens=max_tokens,
    )

    logger.info("✅ Anthropic Claude 3.5 Sonnet 초기화 완료")
    return llm


def get_embeddings():
    """
    임베딩 모델 가져오기

    ## 설명:
    환경 변수에 따라 AWS Bedrock Titan 또는 OpenAI 임베딩을 사용합니다.

    ## Returns:
        Embeddings: LangChain 호환 임베딩 모델

    ## 사용 예시:
    ```python
    embeddings = get_embeddings()
    vectors = embeddings.embed_documents([
        "텍스트 1",
        "텍스트 2"
    ])
    ```
    """
    if USE_AWS_BEDROCK:
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 옵션 1: AWS Bedrock Titan Embeddings
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        try:
            from langchain_aws import BedrockEmbeddings
            import boto3

            logger.info("🔧 AWS Bedrock으로 Embeddings 초기화")

            # AWS 자격 증명
            session = boto3.Session(
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION", "us-east-1"),
            )

            bedrock_runtime = session.client("bedrock-runtime")

            # Titan Embeddings V2
            embeddings = BedrockEmbeddings(
                client=bedrock_runtime,
                model_id="amazon.titan-embed-text-v2:0",  # 1024 차원
            )

            logger.info("✅ AWS Bedrock Titan Embeddings 초기화 완료")
            return embeddings

        except Exception as e:
            logger.error(f"❌ AWS Bedrock Embeddings 초기화 실패: {str(e)}")
            logger.warning("⚠️  OpenAI로 폴백합니다")
            pass

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 옵션 2: OpenAI Embeddings
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    from langchain_openai import OpenAIEmbeddings

    logger.info("🔧 OpenAI API로 Embeddings 초기화")

    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-large",  # 3072 차원
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )

    logger.info("✅ OpenAI Embeddings 초기화 완료")
    return embeddings


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 헬퍼 함수
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def get_embedding_dimensions() -> int:
    """
    현재 사용 중인 임베딩 모델의 차원 반환

    ## Returns:
        int: 임베딩 차원 수
            - AWS Bedrock Titan: 1024
            - OpenAI text-embedding-3-large: 3072
    """
    if USE_AWS_BEDROCK:
        return 1024  # Titan Embeddings V2
    else:
        return 3072  # OpenAI text-embedding-3-large


def print_llm_config():
    """
    현재 LLM 설정 출력 (디버깅용)

    ## 출력 예시:
    ```
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    LLM Configuration
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    USE_AWS_BEDROCK: true
    Chat LLM: AWS Bedrock Claude 3.5 Sonnet
    Embeddings: AWS Bedrock Titan V2 (1024d)
    AWS Region: us-east-1
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ```
    """
    print("━" * 60)
    print("LLM Configuration")
    print("━" * 60)
    print(f"USE_AWS_BEDROCK: {USE_AWS_BEDROCK}")

    if USE_AWS_BEDROCK:
        print(f"Chat LLM: AWS Bedrock Claude 3.5 Sonnet")
        print(f"Embeddings: AWS Bedrock Titan V2 (1024d)")
        print(f"AWS Region: {os.getenv('AWS_REGION', 'us-east-1')}")
    else:
        print(f"Chat LLM: Direct Anthropic API")
        print(f"Embeddings: OpenAI text-embedding-3-large (3072d)")

    print("━" * 60)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 테스트 코드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if __name__ == "__main__":
    import asyncio
    from langchain_core.messages import HumanMessage

    async def test_llm():
        """LLM 설정 테스트"""
        print_llm_config()

        # Chat LLM 테스트
        print("\n[Test 1] Chat LLM")
        llm = get_chat_llm(temperature=0.7)
        response = await llm.ainvoke([HumanMessage(content="안녕하세요!")])
        print(f"응답: {response.content[:100]}...")

        # Embeddings 테스트
        print("\n[Test 2] Embeddings")
        embeddings = get_embeddings()
        vector = embeddings.embed_query("테스트 텍스트")
        print(f"임베딩 차원: {len(vector)}")

    # asyncio.run(test_llm())
