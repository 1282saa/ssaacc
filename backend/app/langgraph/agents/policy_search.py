"""
Policy Search Agent - 정책 검색 전문 에이전트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 역할:
사용자의 요구사항에 맞는 금융 정책을 벡터 유사도 기반으로 검색합니다.

## 메이크리 AI 워크플로우에서의 위치:
Supervisor → **Policy Search Agent** → Response Generator → Synthesizer

## 주요 기능:
1. 사용자 쿼리 분석 및 최적화
2. Milvus 벡터 검색 실행
3. 검색 결과 필터링 및 정렬
4. 사용자 컨텍스트 반영

## 데이터 흐름:
1. State에서 사용자 메시지 추출
2. 검색 쿼리 생성 (사용자 컨텍스트 반영)
3. FastMCP search_policies 도구 호출
4. 결과를 State에 저장
5. next_action을 "generate_response"로 설정

## 예시:
입력: "25살인데 적금 추천해줘"
→ 쿼리 최적화: "25세 청년 적금 저축 상품 우대 금리"
→ Milvus 검색
→ 상위 5개 정책 반환
"""

from typing import Dict, Any, List
from app.langgraph.state import AgentState, add_intermediate_step
from app.mcp.tools import search_policies
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage
import os
from loguru import logger


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LLM 초기화
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Claude 3.5 Sonnet 사용
# - 쿼리 최적화 및 결과 해석에 사용
# - 사용자 의도를 검색 쿼리로 변환
llm = ChatAnthropic(
    model="claude-3-5-sonnet-20241022",
    anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
    temperature=0.2,  # 검색 쿼리 생성 시 일관성 중요
)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Query Optimization System Prompt
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUERY_OPTIMIZATION_PROMPT = """당신은 금융 정책 검색을 위한 쿼리 최적화 전문가입니다.

## 역할:
사용자의 자연어 메시지를 벡터 검색에 최적화된 검색 쿼리로 변환합니다.

## 최적화 원칙:
1. **핵심 키워드 추출**: 사용자 의도의 핵심 개념만 포함
2. **컨텍스트 반영**: 사용자 나이, 지역, 직업 등을 쿼리에 포함
3. **동의어 확장**: 검색 효율을 높이기 위한 관련 용어 추가
4. **불필요한 단어 제거**: "알려줘", "추천해줘" 같은 요청 표현 제거

## 예시:
사용자 메시지: "25살인데 적금 추천해줘"
사용자 컨텍스트: {"age": 25, "region": "서울"}
최적화된 쿼리: "25세 청년 적금 저축 상품 우대 금리 서울"

사용자 메시지: "대학생 장학금 있어?"
사용자 컨텍스트: {"age": 20, "education": "대학 재학"}
최적화된 쿼리: "대학생 장학금 학자금 지원 20세"

## 출력 형식:
**오직 최적화된 검색 쿼리만** 출력하세요. 설명이나 추가 텍스트는 포함하지 마세요.
"""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Policy Search Agent Function
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


async def policy_search_agent(state: AgentState) -> AgentState:
    """
    Policy Search Agent - 정책 검색 실행

    ## 입력:
        state (AgentState): 현재 워크플로우 상태
            - messages: 대화 히스토리
            - user_context: 사용자 프로필
            - next_action: "search_policies" (Supervisor가 설정)

    ## 출력:
        state (AgentState): 업데이트된 상태
            - search_results: 검색된 정책 리스트
            - current_agent: "policy_search"로 업데이트
            - next_action: "generate_response"로 설정
            - intermediate_steps: 검색 과정 기록

    ## 처리 흐름:
    1. 최신 사용자 메시지 추출
    2. 사용자 컨텍스트 수집 (나이, 지역 등)
    3. Claude로 검색 쿼리 최적화
    4. FastMCP search_policies 도구 호출
    5. 검색 결과를 State에 저장
    6. next_action을 "generate_response"로 설정

    ## 예시:
    ```python
    # Input State
    {
        "messages": [{"role": "user", "content": "25살인데 적금 추천해줘"}],
        "user_context": {"age": 25, "region": "서울"},
        "next_action": "search_policies"
    }

    # Output State
    {
        "messages": [...],
        "search_results": [
            {"policy_id": "POLICY_001", "title": "청년 적금", "similarity_score": 0.92},
            {"policy_id": "POLICY_002", "title": "청년 우대 저축", "similarity_score": 0.88},
        ],
        "next_action": "generate_response",
        "current_agent": "policy_search"
    }
    ```

    ## 에러 처리:
    - 검색 실패 시: 빈 결과 반환 + 에러 메시지 기록
    - 쿼리 최적화 실패 시: 원본 메시지 그대로 검색
    """
    logger.info("🔍 Policy Search Agent 실행")

    try:
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 1: 최신 사용자 메시지 추출
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        messages = state.get("messages", [])
        if not messages:
            logger.warning("⚠️  메시지가 없습니다")
            state["next_action"] = "end"
            return state

        latest_message = messages[-1]["content"]
        logger.debug(f"사용자 메시지: {latest_message}")

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 2: 사용자 컨텍스트 수집
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        user_context = state.get("user_context", {})

        # 컨텍스트 요약 생성
        context_parts = []
        if "age" in user_context:
            context_parts.append(f"나이: {user_context['age']}세")
        if "region" in user_context:
            context_parts.append(f"지역: {user_context['region']}")
        if "employment_status" in user_context:
            context_parts.append(f"재직 상태: {user_context['employment_status']}")
        if "education" in user_context:
            context_parts.append(f"학력: {user_context['education']}")

        context_summary = ", ".join(context_parts) if context_parts else "컨텍스트 없음"
        logger.debug(f"사용자 컨텍스트: {context_summary}")

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 3: 검색 쿼리 최적화 (Claude 활용)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        try:
            optimization_prompt = f"""
사용자 메시지: "{latest_message}"
사용자 컨텍스트: {context_summary}

위 정보를 바탕으로 벡터 검색에 최적화된 쿼리를 생성하세요.
"""

            response = await llm.ainvoke([
                SystemMessage(content=QUERY_OPTIMIZATION_PROMPT),
                HumanMessage(content=optimization_prompt)
            ])

            optimized_query = response.content.strip()
            logger.info(f"✅ 쿼리 최적화: '{latest_message}' → '{optimized_query}'")

        except Exception as e:
            # 쿼리 최적화 실패 시 원본 메시지 사용
            logger.warning(f"⚠️  쿼리 최적화 실패, 원본 사용: {str(e)}")
            optimized_query = latest_message

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 4: FastMCP search_policies 도구 호출
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        logger.info(f"🔎 Milvus 검색 실행: '{optimized_query}'")

        # 검색 실행 (상위 5개 결과 요청)
        search_results = await search_policies(
            query=optimized_query,
            top_k=5,
            filters=None  # TODO Phase 2: 나이, 지역 필터 적용
        )

        logger.info(f"✅ 검색 완료: {len(search_results)}개 정책 발견")

        # 검색 결과 로깅 (디버깅용)
        for idx, policy in enumerate(search_results, 1):
            logger.debug(
                f"  [{idx}] {policy.get('title', '제목없음')} "
                f"(유사도: {policy.get('similarity_score', 0):.2f})"
            )

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 5: State 업데이트
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        state["search_results"] = search_results
        state["current_agent"] = "policy_search"
        state["next_action"] = "generate_response"  # 다음 단계: 응답 생성

        # 중간 과정 기록
        state = add_intermediate_step(
            state,
            agent="policy_search",
            action="search_completed",
            query=optimized_query,
            results_count=len(search_results),
            top_similarity=search_results[0].get("similarity_score", 0) if search_results else 0
        )

        return state

    except Exception as e:
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 에러 처리
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        logger.error(f"❌ Policy Search Agent 에러: {str(e)}")

        # 에러 발생 시에도 워크플로우 계속 진행
        # (빈 결과로 응답 생성 시도)
        state["search_results"] = []
        state["error"] = f"Policy search error: {str(e)}"
        state["current_agent"] = "policy_search"
        state["next_action"] = "generate_response"

        return state


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Helper Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def should_continue_to_response(state: AgentState) -> bool:
    """
    응답 생성 단계로 이동해야 하는지 판단

    ## 조건:
    - Policy Search Agent 완료
    - search_results가 존재 (빈 리스트도 허용)

    ## 사용:
    LangGraph의 conditional_edges에서 사용
    ```python
    graph.add_conditional_edges(
        "policy_search",
        should_continue_to_response,
        {True: "response_generator", False: "end"}
    )
    ```
    """
    return state.get("current_agent") == "policy_search"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 테스트 코드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if __name__ == "__main__":
    import asyncio
    from app.langgraph.state import create_initial_state

    async def test_policy_search():
        """Policy Search Agent 테스트"""
        print("=" * 60)
        print("Policy Search Agent 테스트")
        print("=" * 60)

        # Test Case 1: 기본 검색
        print("\n[Test 1] 기본 정책 검색")
        state1 = create_initial_state(
            user_message="25살인데 적금 추천해줘",
            user_context={"age": 25, "region": "서울"}
        )
        state1["next_action"] = "search_policies"

        result1 = await policy_search_agent(state1)
        print(f"검색 결과: {len(result1['search_results'])}개")
        print(f"next_action: {result1['next_action']}")

        # Test Case 2: 컨텍스트 풍부한 검색
        print("\n[Test 2] 컨텍스트 반영 검색")
        state2 = create_initial_state(
            user_message="대학생 장학금 있어?",
            user_context={
                "age": 20,
                "education": "대학 재학",
                "region": "부산"
            }
        )
        state2["next_action"] = "search_policies"

        result2 = await policy_search_agent(state2)
        print(f"검색 결과: {len(result2['search_results'])}개")

    # asyncio.run(test_policy_search())
