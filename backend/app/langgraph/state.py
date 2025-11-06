"""
LangGraph State Definition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

메이크리 AI 워크플로우에서 사용하는 공유 상태(State)를 정의합니다.

## 역할:
- 모든 Agent가 공유하는 데이터 구조
- 대화 컨텍스트, 검색 결과, 중간 처리 결과 저장
- LangGraph의 StateGraph에서 노드 간 데이터 전달

## 데이터 흐름:
사용자 입력 → State 초기화 → Supervisor → 전문 Agent → State 업데이트 → Synthesizer → 최종 응답

## State 구조:
```
AgentState {
    messages: 대화 히스토리
    current_agent: 현재 활성 Agent
    search_results: 정책 검색 결과
    user_context: 사용자 프로필
    next_action: 다음 수행 작업
    ...
}
```
"""

from typing import TypedDict, List, Dict, Any, Optional, Annotated
from langgraph.graph import add_messages


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# AgentState 정의
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class AgentState(TypedDict):
    """
    LangGraph Multi-Agent Workflow 공유 상태

    ## 설명:
    모든 Agent가 읽고 쓸 수 있는 공유 메모리입니다.
    각 Agent는 State를 입력받아 처리 후 업데이트된 State를 반환합니다.

    ## TypedDict란?
    Python의 타입 힌팅용 딕셔너리 클래스
    - 각 필드의 타입을 명시적으로 정의
    - IDE 자동완성 지원
    - 타입 체커(mypy)로 오류 방지

    ## Attributes:
        모든 필드에 대한 상세 설명은 아래 참조
    """

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 대화 관련 필드
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    messages: Annotated[List[Dict[str, str]], add_messages]
    """
    대화 메시지 히스토리

    ## 구조:
    [
        {"role": "user", "content": "25살인데 적금 추천해줘"},
        {"role": "assistant", "content": "청년 우대 적금을 추천드립니다..."},
        ...
    ]

    ## Annotated[List, add_messages]:
    - LangGraph의 특수 타입
    - 새 메시지가 자동으로 리스트에 추가됨
    - Agent가 메시지를 append하면 자동 병합

    ## 사용 예시:
    ```python
    state["messages"].append({
        "role": "assistant",
        "content": "검색 결과를 찾았습니다."
    })
    ```
    """

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Agent 라우팅 필드
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    current_agent: Optional[str]
    """
    현재 활성화된 Agent 이름

    ## 값:
    - "supervisor": Supervisor Agent (라우팅 담당)
    - "policy_search": Policy Search Agent (정책 검색)
    - "eligibility_check": Eligibility Check Agent (자격 확인)
    - "response_generator": Response Generator Agent (응답 생성)
    - "synthesizer": Synthesizer Agent (최종 합성)

    ## 용도:
    - 워크플로우 추적
    - 디버깅
    - 로깅

    ## 예시:
    ```python
    if state["current_agent"] == "policy_search":
        # 정책 검색 중...
    ```
    """

    next_action: Optional[str]
    """
    다음에 수행할 액션

    ## 값:
    - "search_policies": 정책 검색 필요
    - "check_eligibility": 자격 확인 필요
    - "generate_response": 응답 생성 필요
    - "end": 워크플로우 종료

    ## Supervisor Agent가 결정:
    사용자 의도를 파악하여 next_action 설정

    ## 예시:
    ```python
    # Supervisor가 판단
    state["next_action"] = "search_policies"

    # 다음 노드로 라우팅
    if state["next_action"] == "search_policies":
        return "policy_search_agent"
    ```
    """

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 사용자 컨텍스트 필드
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    user_context: Dict[str, Any]
    """
    사용자 프로필 및 컨텍스트 정보

    ## 구조:
    {
        "age": 25,
        "region": "서울",
        "employment_status": "재직",
        "income": 3000,  # 만원 단위
        "education": "대학 재학",
        "interests": ["적금", "대출"],
        "session_id": "abc123"
    }

    ## 사용처:
    - 자격 조건 확인
    - 개인화된 추천
    - 대화 컨텍스트 유지

    ## 업데이트:
    대화 중 추출된 정보를 지속적으로 추가

    ## 예시:
    ```python
    # 나이 추출
    if "25살" in user_message:
        state["user_context"]["age"] = 25
    ```
    """

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 검색 결과 필드
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    search_results: List[Dict[str, Any]]
    """
    정책 검색 결과 (Milvus 벡터 검색)

    ## 구조:
    [
        {
            "policy_id": "POLICY_001",
            "title": "청년 적금 우대 이자",
            "description": "...",
            "similarity_score": 0.92,
            "metadata": {...}
        },
        ...
    ]

    ## 업데이트:
    Policy Search Agent가 검색 후 저장

    ## 사용:
    Response Generator Agent가 응답 생성 시 참조

    ## 예시:
    ```python
    # Policy Search Agent
    results = await search_policies(query)
    state["search_results"] = results

    # Response Generator Agent
    for policy in state["search_results"]:
        # 응답에 포함...
    ```
    """

    related_policies: List[Dict[str, Any]]
    """
    관련 정책 (Neo4j 그래프 검색) - Phase 2

    ## 구조:
    [
        {
            "policy_id": "POLICY_002",
            "title": "청년 전세 자금",
            "relationship": "COMBINES_WITH",
            "confidence": 0.85
        },
        ...
    ]

    ## Phase 2에서 구현:
    Neo4j 그래프 DB 연동 후 활성화
    """

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 중간 처리 결과 필드
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    eligibility_results: Optional[Dict[str, Any]]
    """
    자격 조건 확인 결과

    ## 구조:
    {
        "eligible": True,
        "policy_id": "POLICY_001",
        "matched_criteria": ["나이", "지역"],
        "failed_criteria": [],
        "confidence": 0.95,
        "explanation": "모든 조건을 충족합니다."
    }

    ## 업데이트:
    Eligibility Check Agent가 확인 후 저장
    """

    intermediate_steps: List[Dict[str, Any]]
    """
    중간 처리 과정 기록

    ## 용도:
    - 디버깅
    - 로깅
    - 워크플로우 추적

    ## 구조:
    [
        {
            "agent": "supervisor",
            "action": "route_to_policy_search",
            "timestamp": "2024-01-01T12:00:00"
        },
        {
            "agent": "policy_search",
            "action": "search_completed",
            "results_count": 5,
            "timestamp": "2024-01-01T12:00:05"
        },
        ...
    ]
    """

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 최종 응답 필드
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    final_response: Optional[str]
    """
    최종 사용자 응답

    ## 생성:
    Synthesizer Agent가 모든 결과를 종합하여 생성

    ## 구조:
    자연스러운 대화체 응답 텍스트

    ## 예시:
    "25세 청년을 위한 적금 상품을 찾았습니다.
     '청년 우대 적금'은 최대 연 5%의 우대 이자를 제공하며..."
    """

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 에러 처리 필드
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    error: Optional[str]
    """
    에러 메시지 (발생 시)

    ## 예시:
    "Milvus 연결 실패: Connection timeout"

    ## 용도:
    - 에러 핸들링
    - 사용자에게 친절한 에러 메시지 전달
    """


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Helper Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def create_initial_state(user_message: str, user_context: Dict[str, Any] = None) -> AgentState:
    """
    초기 State 생성

    ## Args:
        user_message: 사용자 메시지
        user_context: 사용자 프로필 (옵션)

    ## Returns:
        초기화된 AgentState

    ## 예시:
    ```python
    state = create_initial_state(
        user_message="25살인데 적금 추천해줘",
        user_context={"age": 25, "region": "서울"}
    )
    ```
    """
    return AgentState(
        messages=[{"role": "user", "content": user_message}],
        current_agent="supervisor",
        next_action=None,
        user_context=user_context or {},
        search_results=[],
        related_policies=[],
        eligibility_results=None,
        intermediate_steps=[],
        final_response=None,
        error=None
    )


def add_intermediate_step(state: AgentState, agent: str, action: str, **kwargs) -> AgentState:
    """
    중간 처리 과정 기록

    ## Args:
        state: 현재 State
        agent: Agent 이름
        action: 수행한 액션
        **kwargs: 추가 정보

    ## 예시:
    ```python
    state = add_intermediate_step(
        state,
        agent="policy_search",
        action="search_completed",
        results_count=5
    )
    ```
    """
    from datetime import datetime

    step = {
        "agent": agent,
        "action": action,
        "timestamp": datetime.utcnow().isoformat(),
        **kwargs
    }

    state["intermediate_steps"].append(step)
    return state
