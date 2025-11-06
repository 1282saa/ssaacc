"""
LangGraph Workflow - 메이크리 AI 워크플로우 오케스트레이션
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 역할:
모든 Agent를 연결하여 완전한 대화 워크플로우를 구성합니다.

## 워크플로우 구조:
```
사용자 입력
    ↓
[Supervisor Agent] ← 의도 파악 및 라우팅
    ↓
    ├─→ [Policy Search Agent] ← 정책 검색
    ├─→ [Eligibility Check Agent] ← 자격 확인 (Phase 2)
    └─→ [Response Generator Agent] ← 응답 생성
    ↓
최종 응답
```

## LangGraph 주요 개념:

### StateGraph:
- 상태 기반 그래프 워크플로우
- 각 노드(Agent)는 State를 입력받아 업데이트된 State 반환
- 노드 간 전환은 조건부 엣지(conditional edges)로 제어

### Node (노드):
- 실제 작업을 수행하는 Agent 함수
- 예: supervisor_agent, policy_search_agent, response_generator_agent

### Edge (엣지):
- 노드 간 연결
- 조건부 엣지: 특정 조건에 따라 다음 노드 결정
- 일반 엣지: 항상 특정 노드로 이동

### Conditional Routing (조건부 라우팅):
- next_action 값에 따라 다음 Agent 선택
- "search_policies" → Policy Search Agent
- "generate_response" → Response Generator Agent
- "end" → 종료

## 사용 예시:
```python
from app.langgraph.graph import create_workflow
from app.langgraph.state import create_initial_state

# 1. 워크플로우 생성
workflow = create_workflow()

# 2. 초기 상태 생성
initial_state = create_initial_state(
    user_message="25살인데 적금 추천해줘",
    user_context={"age": 25, "region": "서울"}
)

# 3. 워크플로우 실행
final_state = await workflow.ainvoke(initial_state)

# 4. 결과 확인
print(final_state["final_response"])
```
"""

from typing import Literal
from langgraph.graph import StateGraph, END
from app.langgraph.state import AgentState
from app.langgraph.agents.supervisor import supervisor_agent
from app.langgraph.agents.policy_search import policy_search_agent
from app.langgraph.agents.response_generator import response_generator_agent
from loguru import logger


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Routing Functions (라우팅 조건 함수들)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def route_from_supervisor(
    state: AgentState,
) -> Literal["policy_search", "response_generator", "end"]:
    """
    Supervisor Agent 다음 노드 결정

    ## 역할:
    Supervisor가 설정한 next_action에 따라 다음 Agent를 선택합니다.

    ## 라우팅 규칙:
    - next_action == "search_policies" → "policy_search" (정책 검색)
    - next_action == "generate_response" → "response_generator" (바로 응답 생성)
    - next_action == "end" → END (종료)
    - 기타 → "response_generator" (기본값)

    ## Args:
        state: 현재 워크플로우 상태

    ## Returns:
        다음 노드 이름 ("policy_search", "response_generator", "end")

    ## 사용:
    ```python
    graph.add_conditional_edges(
        "supervisor",
        route_from_supervisor
    )
    ```
    """
    next_action = state.get("next_action", "end")
    logger.debug(f"🔀 Supervisor 라우팅: next_action={next_action}")

    if next_action == "search_policies":
        logger.info("  → Policy Search Agent로 이동")
        return "policy_search"

    elif next_action == "generate_response":
        logger.info("  → Response Generator Agent로 이동")
        return "response_generator"

    elif next_action == "end":
        logger.info("  → 워크플로우 종료")
        return "end"

    else:
        # 예상치 못한 액션은 응답 생성으로 처리
        logger.warning(f"  ⚠️  알 수 없는 액션: {next_action}, 응답 생성으로 이동")
        return "response_generator"


def route_from_policy_search(
    state: AgentState,
) -> Literal["response_generator", "end"]:
    """
    Policy Search Agent 다음 노드 결정

    ## 역할:
    정책 검색 후 항상 응답 생성으로 이동합니다.

    ## 라우팅 규칙:
    - 검색 성공 → "response_generator" (응답 생성)
    - 검색 실패 (에러) → "response_generator" (에러 메시지 생성)

    ## Args:
        state: 현재 워크플로우 상태

    ## Returns:
        다음 노드 이름 ("response_generator")

    ## 참고:
    검색 실패해도 응답 생성으로 이동하여 친절한 메시지를 전달합니다.
    """
    logger.debug("🔀 Policy Search 라우팅")

    # 검색 결과 유무와 관계없이 응답 생성으로 이동
    # (응답 생성 단계에서 검색 결과 없음을 처리)
    logger.info("  → Response Generator Agent로 이동")
    return "response_generator"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Workflow Creation (워크플로우 생성)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def create_workflow():
    """
    LangGraph 워크플로우 생성

    ## 구조:
    ```
    START
      ↓
    supervisor (Supervisor Agent)
      ↓
      ├─→ policy_search (Policy Search Agent)
      │     ↓
      │   response_generator (Response Generator Agent)
      │     ↓
      │   END
      │
      ├─→ response_generator (직접 응답 생성)
      │     ↓
      │   END
      │
      └─→ END (종료)
    ```

    ## 노드 설명:
    1. **supervisor**: 사용자 의도 파악 및 라우팅
    2. **policy_search**: 벡터 유사도 기반 정책 검색
    3. **response_generator**: 최종 사용자 응답 생성

    ## 엣지 설명:
    - supervisor → [조건부] → policy_search / response_generator / END
    - policy_search → response_generator
    - response_generator → END

    ## Returns:
        compiled_workflow: 컴파일된 StateGraph 워크플로우

    ## 사용 예시:
    ```python
    workflow = create_workflow()
    result = await workflow.ainvoke(initial_state)
    ```
    """
    logger.info("🔧 LangGraph 워크플로우 생성 중...")

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 1: StateGraph 초기화
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    # AgentState를 상태로 사용하는 그래프 생성
    workflow = StateGraph(AgentState)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 2: 노드 추가 (각 Agent를 노드로 등록)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    logger.debug("  → 노드 추가: supervisor")
    workflow.add_node("supervisor", supervisor_agent)

    logger.debug("  → 노드 추가: policy_search")
    workflow.add_node("policy_search", policy_search_agent)

    logger.debug("  → 노드 추가: response_generator")
    workflow.add_node("response_generator", response_generator_agent)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 3: 엣지 추가 (노드 간 연결 정의)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    # 3-1. 시작 노드 설정
    # 워크플로우는 항상 supervisor에서 시작
    logger.debug("  → 시작 엣지 설정: START → supervisor")
    workflow.set_entry_point("supervisor")

    # 3-2. Supervisor 조건부 라우팅
    # Supervisor가 결정한 next_action에 따라 다음 노드 선택
    logger.debug("  → 조건부 엣지 추가: supervisor → [policy_search/response_generator/END]")
    workflow.add_conditional_edges(
        "supervisor",  # 출발 노드
        route_from_supervisor,  # 라우팅 함수
        {
            "policy_search": "policy_search",
            "response_generator": "response_generator",
            "end": END,
        },
    )

    # 3-3. Policy Search → Response Generator
    # 정책 검색 후 항상 응답 생성으로 이동
    logger.debug("  → 조건부 엣지 추가: policy_search → response_generator")
    workflow.add_conditional_edges(
        "policy_search",  # 출발 노드
        route_from_policy_search,  # 라우팅 함수
        {
            "response_generator": "response_generator",
            "end": END,
        },
    )

    # 3-4. Response Generator → END
    # 응답 생성 후 워크플로우 종료
    logger.debug("  → 일반 엣지 추가: response_generator → END")
    workflow.add_edge("response_generator", END)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 4: 워크플로우 컴파일
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    compiled_workflow = workflow.compile()
    logger.info("✅ 워크플로우 생성 완료")

    return compiled_workflow


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Convenience Function (편의 함수)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


async def run_workflow(user_message: str, user_context: dict = None) -> str:
    """
    워크플로우 실행 편의 함수

    ## 역할:
    사용자 메시지를 받아 전체 워크플로우를 실행하고 최종 응답을 반환합니다.

    ## Args:
        user_message (str): 사용자 입력 메시지
            예: "25살인데 적금 추천해줘"

        user_context (dict, optional): 사용자 프로필 정보
            예: {"age": 25, "region": "서울"}

    ## Returns:
        str: 최종 응답 텍스트

    ## 처리 흐름:
    1. 초기 State 생성
    2. 워크플로우 실행
    3. 최종 응답 추출

    ## 사용 예시:
    ```python
    response = await run_workflow(
        user_message="25살인데 적금 추천해줘",
        user_context={"age": 25, "region": "서울"}
    )
    print(response)
    ```

    ## 에러 처리:
    - 워크플로우 실행 실패 시 에러 메시지 반환
    - State의 error 필드에 에러 정보 저장
    """
    from app.langgraph.state import create_initial_state

    try:
        logger.info(f"🚀 워크플로우 실행: '{user_message}'")

        # Step 1: 초기 상태 생성
        initial_state = create_initial_state(
            user_message=user_message, user_context=user_context or {}
        )

        # Step 2: 워크플로우 생성 및 실행
        workflow = create_workflow()
        final_state = await workflow.ainvoke(initial_state)

        # Step 3: 최종 응답 추출
        final_response = final_state.get("final_response", "응답을 생성할 수 없습니다.")

        # 에러가 있다면 로깅
        if final_state.get("error"):
            logger.warning(f"⚠️  워크플로우 에러: {final_state['error']}")

        logger.info("✅ 워크플로우 완료")
        return final_response

    except Exception as e:
        logger.error(f"❌ 워크플로우 실행 실패: {str(e)}")
        return f"죄송합니다, 오류가 발생했습니다: {str(e)}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 워크플로우 전역 인스턴스 (API에서 사용)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# FastAPI에서 사용할 수 있도록 전역 워크플로우 인스턴스 생성
# 서버 시작 시 한 번만 컴파일되어 재사용
_global_workflow = None


def get_workflow():
    """
    전역 워크플로우 인스턴스 반환

    ## 역할:
    워크플로우를 매번 컴파일하지 않고 재사용하기 위한 싱글톤 패턴

    ## 사용:
    ```python
    # FastAPI 엔드포인트에서
    from app.langgraph.graph import get_workflow

    workflow = get_workflow()
    result = await workflow.ainvoke(state)
    ```

    ## 참고:
    첫 호출 시 워크플로우 컴파일, 이후 캐싱된 인스턴스 반환
    """
    global _global_workflow

    if _global_workflow is None:
        logger.info("🔧 전역 워크플로우 초기화")
        _global_workflow = create_workflow()

    return _global_workflow


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 테스트 코드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if __name__ == "__main__":
    import asyncio

    async def test_workflow():
        """워크플로우 테스트"""
        print("=" * 60)
        print("LangGraph 워크플로우 테스트")
        print("=" * 60)

        # Test Case 1: 정책 검색 플로우
        print("\n[Test 1] 정책 검색 플로우")
        response1 = await run_workflow(
            user_message="25살인데 적금 추천해줘",
            user_context={"age": 25, "region": "서울"},
        )
        print(f"\n응답:\n{response1}")

        # Test Case 2: 다른 쿼리
        print("\n\n[Test 2] 대학생 장학금 검색")
        response2 = await run_workflow(
            user_message="대학생 장학금 있어?",
            user_context={"age": 20, "education": "대학 재학"},
        )
        print(f"\n응답:\n{response2}")

    # asyncio.run(test_workflow())
