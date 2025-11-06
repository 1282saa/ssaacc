"""
Supervisor Agent - 메이크리 AI 워크플로우의 중앙 라우터
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 역할:
사용자 메시지를 분석하여 적절한 전문 Agent로 라우팅하는 의사결정자

## 메이크리 AI 워크플로우에서의 위치:
사용자 → **Supervisor Agent** → 전문 Agent들 → Synthesizer → 응답

## 주요 기능:
1. 사용자 의도 파악 (Intent Detection)
2. 필요한 Agent 결정
3. 다음 액션 설정 (next_action)
4. 워크플로우 종료 조건 판단

## 의사결정 예시:
- "적금 추천해줘" → search_policies (정책 검색)
- "나 자격 있어?" → check_eligibility (자격 확인)
- "설명해줘" → generate_response (응답 생성)
"""

from typing import Dict, Any
from app.langgraph.state import AgentState, add_intermediate_step
from app.llm_config import get_chat_llm  # ⭐ AWS Bedrock 또는 Direct API 자동 선택
from langchain_core.messages import HumanMessage, SystemMessage
import os
from loguru import logger


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LLM 초기화
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Claude 3.5 Sonnet 사용 (AWS Bedrock 또는 Direct API)
# - 가장 똑똑한 모델 (의도 파악에 적합)
# - 빠른 응답 속도
# - 환경 변수 USE_AWS_BEDROCK에 따라 자동 선택
llm = get_chat_llm(temperature=0.3)  # 일관된 라우팅을 위해 낮은 temperature


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Supervisor System Prompt
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUPERVISOR_SYSTEM_PROMPT = """당신은 FinKuRN 금융 상담 챗봇의 Supervisor Agent입니다.

## 역할:
사용자의 메시지를 분석하여 어떤 작업이 필요한지 판단하고, 적절한 다음 단계를 결정합니다.

## 가능한 액션 (next_action):
1. **search_policies**: 정책을 검색해야 할 때
   - 예: "적금 추천해줘", "청년 정책 알려줘", "대출 상품 찾아줘"

2. **check_eligibility**: 자격 조건을 확인해야 할 때
   - 예: "나 자격 있어?", "신청 가능해?", "조건 맞아?"

3. **generate_response**: 이미 정보가 충분하여 응답만 생성하면 될 때
   - 예: "설명해줘", "자세히 알려줘" (이미 검색 결과가 있을 때)

4. **end**: 대화를 종료해야 할 때
   - 예: "고마워", "됐어", "종료"

## 출력 형식:
**반드시 JSON 형식으로만** 응답하세요:
{
    "next_action": "액션명",
    "reasoning": "판단 근거"
}

## 예시:
사용자: "25살인데 적금 추천해줘"
응답:
{
    "next_action": "search_policies",
    "reasoning": "사용자가 적금 상품을 찾고 있으므로 정책 검색이 필요합니다."
}

사용자: "나 이 정책 신청할 수 있어?"
응답:
{
    "next_action": "check_eligibility",
    "reasoning": "사용자가 자격 조건 확인을 요청하고 있습니다."
}
"""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Supervisor Agent Function
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


async def supervisor_agent(state: AgentState) -> AgentState:
    """
    Supervisor Agent - 사용자 의도 파악 및 라우팅

    ## 입력:
        state (AgentState): 현재 워크플로우 상태
            - messages: 대화 히스토리
            - user_context: 사용자 프로필
            - search_results: 이전 검색 결과 (있을 경우)

    ## 출력:
        state (AgentState): 업데이트된 상태
            - next_action: 다음 수행할 액션 설정
            - current_agent: "supervisor"로 업데이트
            - intermediate_steps: 의사결정 과정 기록

    ## 처리 흐름:
    1. 최신 사용자 메시지 추출
    2. Claude에게 의도 분석 요청
    3. next_action 결정
    4. State 업데이트

    ## 예시:
    ```python
    # Input State
    {
        "messages": [{"role": "user", "content": "적금 추천해줘"}],
        "next_action": None
    }

    # Output State
    {
        "messages": [...],
        "next_action": "search_policies",
        "current_agent": "supervisor"
    }
    ```
    """
    logger.info("🎯 Supervisor Agent 실행")

    try:
        # Step 1: 최신 사용자 메시지 가져오기
        messages = state.get("messages", [])
        if not messages:
            logger.warning("⚠️  메시지가 없습니다")
            state["next_action"] = "end"
            return state

        latest_message = messages[-1]["content"]
        logger.debug(f"사용자 메시지: {latest_message}")

        # Step 2: 컨텍스트 정보 수집
        user_context = state.get("user_context", {})
        search_results = state.get("search_results", [])

        # 컨텍스트 요약
        context_summary = f"""
현재 상태:
- 사용자 나이: {user_context.get('age', '미상')}
- 이전 검색 결과: {len(search_results)}개
- 대화 턴: {len(messages)}번째
"""

        # Step 3: Claude에게 의도 분석 요청
        prompt = f"""{context_summary}

최신 사용자 메시지: "{latest_message}"

위 메시지를 분석하여 다음 액션을 결정하세요."""

        response = await llm.ainvoke([
            SystemMessage(content=SUPERVISOR_SYSTEM_PROMPT),
            HumanMessage(content=prompt)
        ])

        # Step 4: 응답 파싱
        import json
        try:
            decision = json.loads(response.content)
            next_action = decision.get("next_action", "generate_response")
            reasoning = decision.get("reasoning", "")

            logger.info(f"✅ 결정: {next_action}")
            logger.debug(f"근거: {reasoning}")

        except json.JSONDecodeError:
            # JSON 파싱 실패 시 기본값
            logger.warning("⚠️  JSON 파싱 실패, 기본 액션 사용")
            next_action = "generate_response"
            reasoning = "JSON 파싱 실패"

        # Step 5: State 업데이트
        state["next_action"] = next_action
        state["current_agent"] = "supervisor"

        # 중간 과정 기록
        state = add_intermediate_step(
            state,
            agent="supervisor",
            action="route_decision",
            next_action=next_action,
            reasoning=reasoning
        )

        return state

    except Exception as e:
        logger.error(f"❌ Supervisor Agent 에러: {str(e)}")
        state["error"] = f"Supervisor error: {str(e)}"
        state["next_action"] = "end"
        return state


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 라우팅 조건 함수들
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def should_search_policies(state: AgentState) -> bool:
    """
    정책 검색이 필요한지 판단

    ## 조건:
    - next_action == "search_policies"

    ## 사용:
    LangGraph의 conditional_edges에서 사용
    ```python
    graph.add_conditional_edges(
        "supervisor",
        should_search_policies,
        {True: "policy_search", False: "..."}
    )
    ```
    """
    return state.get("next_action") == "search_policies"


def should_check_eligibility(state: AgentState) -> bool:
    """
    자격 확인이 필요한지 판단

    ## 조건:
    - next_action == "check_eligibility"
    """
    return state.get("next_action") == "check_eligibility"


def should_generate_response(state: AgentState) -> bool:
    """
    응답 생성이 필요한지 판단

    ## 조건:
    - next_action == "generate_response"
    """
    return state.get("next_action") == "generate_response"


def should_end(state: AgentState) -> bool:
    """
    워크플로우를 종료해야 하는지 판단

    ## 조건:
    - next_action == "end"
    - error가 발생한 경우
    """
    return state.get("next_action") == "end" or state.get("error") is not None


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 테스트 코드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if __name__ == "__main__":
    import asyncio
    from app.langgraph.state import create_initial_state

    async def test_supervisor():
        """Supervisor Agent 테스트"""
        print("=" * 60)
        print("Supervisor Agent 테스트")
        print("=" * 60)

        # Test Case 1: 정책 검색
        print("\n[Test 1] 정책 검색 의도")
        state1 = create_initial_state("25살인데 적금 추천해줘")
        result1 = await supervisor_agent(state1)
        print(f"next_action: {result1['next_action']}")

        # Test Case 2: 자격 확인
        print("\n[Test 2] 자격 확인 의도")
        state2 = create_initial_state("나 이 정책 신청 가능해?")
        result2 = await supervisor_agent(state2)
        print(f"next_action: {result2['next_action']}")

    # asyncio.run(test_supervisor())
