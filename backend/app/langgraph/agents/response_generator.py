"""
Response Generator Agent - 사용자 응답 생성 전문 에이전트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 역할:
검색된 정책 정보를 바탕으로 사용자에게 친절하고 이해하기 쉬운 응답을 생성합니다.

## 메이크리 AI 워크플로우에서의 위치:
Supervisor → Policy Search → **Response Generator** → Synthesizer → 사용자

## 주요 기능:
1. 검색된 정책을 사용자 친화적 언어로 설명
2. 사용자 컨텍스트에 맞춘 개인화된 추천
3. 정책 간 비교 및 장단점 설명
4. 신청 방법 안내

## 응답 전략:
1. **간결성**: 핵심 정보만 전달 (3-5문장)
2. **개인화**: 사용자 나이, 지역 반영
3. **실용성**: 신청 방법, 조건 명확히 안내
4. **친근함**: 존댓말 사용, 이모지 활용

## 예시:
검색 결과: [{"title": "청년 적금", "age_range": "19-34세", ...}]
→ 응답: "25세시라면 '청년 적금'을 추천드립니다. 최대 연 5%의 우대금리를 받을 수 있으며..."
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
# - 자연스러운 대화체 응답 생성
# - 정책 정보를 쉬운 언어로 설명
# - 환경 변수 USE_AWS_BEDROCK에 따라 자동 선택
llm = get_chat_llm(temperature=0.7)  # 창의적이고 자연스러운 응답을 위해 높은 temperature


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Response Generation System Prompt
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESPONSE_GENERATION_PROMPT = """당신은 FinKuRN 금융 상담 챗봇의 Response Generator입니다.

## 역할:
검색된 금융 정책 정보를 사용자에게 친절하고 이해하기 쉽게 설명합니다.

## 응답 작성 원칙:

### 1. 개인화 (Personalization)
- 사용자의 나이, 지역, 직업 상태를 응답에 반영
- "25세시라면~", "서울에 거주하시니~" 같은 표현 사용
- 사용자에게 가장 적합한 정책을 우선 추천

### 2. 간결성 (Conciseness)
- 3-5문장으로 핵심만 전달
- 불필요한 설명 최소화
- 한 문장에 하나의 핵심 정보

### 3. 실용성 (Practicality)
- 신청 자격 조건 명확히 안내
- 신청 방법 간단히 설명
- 필요 서류나 절차 언급

### 4. 친근함 (Friendliness)
- 존댓말 사용 (~입니다, ~습니다)
- 적절한 이모지 사용 (💰, 📋, ✅ 등)
- 격려하는 톤 유지

### 5. 구조화 (Structure)
- 추천 정책 → 핵심 혜택 → 자격 조건 → 신청 방법 순서
- 여러 정책이 있을 경우 번호 매기기

## 응답 템플릿:

### Case 1: 검색 결과가 있을 때
```
[사용자 맞춤 인사]

📋 추천 정책:
1. **[정책명]**
   - 혜택: [핵심 혜택]
   - 조건: [주요 자격 조건]
   - 신청: [신청 방법 간략히]

[추가 안내나 격려의 말]
```

### Case 2: 검색 결과가 없을 때
```
죄송합니다, 현재 조건에 맞는 정책을 찾지 못했습니다.

다른 방법으로 도와드릴 수 있어요:
- 나이나 지역 조건을 다르게 입력해보세요
- "전체 청년 정책"처럼 넓은 범위로 검색해보세요

무엇을 도와드릴까요?
```

## 예시:

### 입력:
- 사용자 메시지: "25살인데 적금 추천해줘"
- 사용자 컨텍스트: {"age": 25, "region": "서울"}
- 검색 결과: [{"title": "청년 우대 적금", "description": "...", ...}]

### 출력:
```
25세시라면 청년 우대 적금이 딱이에요! 💰

📋 추천 정책:
1. **청년 우대 적금**
   - 혜택: 연 최대 5% 우대금리 (일반 적금보다 2%p 높음)
   - 조건: 만 19-34세, 월 최대 50만원 납입
   - 신청: 주요 시중은행 모바일앱에서 비대면 신청 가능

서울 지역은 추가 우대금리 0.5%도 받을 수 있어요! ✅
```

## 주의사항:
- 검색 결과가 없어도 긍정적인 톤 유지
- 정확하지 않은 정보는 절대 추가하지 않음
- 검색 결과에 있는 정보만 사용
- 과도한 이모지 사용 자제 (문장당 1개 이하)
"""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Response Generator Agent Function
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


async def response_generator_agent(state: AgentState) -> AgentState:
    """
    Response Generator Agent - 사용자 응답 생성

    ## 입력:
        state (AgentState): 현재 워크플로우 상태
            - messages: 대화 히스토리
            - user_context: 사용자 프로필
            - search_results: 검색된 정책 리스트
            - next_action: "generate_response" (이전 Agent가 설정)

    ## 출력:
        state (AgentState): 업데이트된 상태
            - final_response: 생성된 응답 텍스트
            - current_agent: "response_generator"로 업데이트
            - next_action: "end"로 설정
            - intermediate_steps: 응답 생성 과정 기록

    ## 처리 흐름:
    1. 사용자 메시지 및 컨텍스트 추출
    2. 검색 결과 포맷팅
    3. Claude에게 응답 생성 요청
    4. 생성된 응답을 State에 저장
    5. next_action을 "end"로 설정 (워크플로우 종료)

    ## 예시:
    ```python
    # Input State
    {
        "messages": [{"role": "user", "content": "25살인데 적금 추천해줘"}],
        "user_context": {"age": 25, "region": "서울"},
        "search_results": [
            {"title": "청년 적금", "description": "...", "similarity_score": 0.92}
        ],
        "next_action": "generate_response"
    }

    # Output State
    {
        "final_response": "25세시라면 청년 우대 적금이 딱이에요! ...",
        "current_agent": "response_generator",
        "next_action": "end"
    }
    ```

    ## 에러 처리:
    - 검색 결과 없음: "결과를 찾지 못했습니다" 친절한 응답 생성
    - Claude 응답 실패: 기본 템플릿 응답 반환
    """
    logger.info("💬 Response Generator Agent 실행")

    try:
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 1: 사용자 메시지 및 컨텍스트 추출
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        messages = state.get("messages", [])
        if not messages:
            logger.warning("⚠️  메시지가 없습니다")
            state["next_action"] = "end"
            return state

        # LangChain Message 객체에서 content 추출
        latest_msg = messages[-1]
        if hasattr(latest_msg, 'content'):
            user_message = latest_msg.content
        elif isinstance(latest_msg, dict):
            user_message = latest_msg["content"]
        else:
            user_message = str(latest_msg)

        user_context = state.get("user_context", {})
        search_results = state.get("search_results", [])

        logger.debug(f"사용자 메시지: {user_message}")
        logger.debug(f"검색 결과 수: {len(search_results)}개")

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 2: 검색 결과 포맷팅
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        # 검색 결과를 Claude가 이해하기 쉬운 형태로 변환
        if search_results:
            results_text = "검색된 정책:\n"
            for idx, policy in enumerate(search_results[:3], 1):  # 상위 3개만 사용
                results_text += f"""
{idx}. {policy.get('title', '제목없음')}
   - 설명: {policy.get('description', '설명없음')[:200]}...
   - 카테고리: {policy.get('category', '미분류')}
   - 대상 연령: {policy.get('age_range', '제한없음')}
   - 지역: {policy.get('region', '전국')}
   - 유사도: {policy.get('similarity_score', 0):.2f}
"""
        else:
            results_text = "검색 결과 없음"

        # 사용자 컨텍스트 포맷팅
        context_text = f"""
사용자 정보:
- 나이: {user_context.get('age', '미상')}세
- 지역: {user_context.get('region', '미상')}
- 재직 상태: {user_context.get('employment_status', '미상')}
- 학력: {user_context.get('education', '미상')}
"""

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 3: Claude에게 응답 생성 요청
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        prompt = f"""
사용자 메시지: "{user_message}"

{context_text}

{results_text}

위 정보를 바탕으로 사용자에게 친절하고 도움이 되는 응답을 생성하세요.
"""

        logger.info("🤖 Claude에게 응답 생성 요청")

        response = await llm.ainvoke([
            SystemMessage(content=RESPONSE_GENERATION_PROMPT),
            HumanMessage(content=prompt)
        ])

        final_response = response.content.strip()
        logger.info(f"✅ 응답 생성 완료 (길이: {len(final_response)}자)")
        logger.debug(f"응답 내용:\n{final_response}")

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 4: State 업데이트
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        state["final_response"] = final_response
        state["current_agent"] = "response_generator"
        state["next_action"] = "end"  # 워크플로우 종료

        # 응답을 messages에도 추가 (대화 히스토리 유지)
        state["messages"].append({
            "role": "assistant",
            "content": final_response
        })

        # 중간 과정 기록
        state = add_intermediate_step(
            state,
            agent="response_generator",
            action="response_generated",
            response_length=len(final_response),
            used_policies=len(search_results)
        )

        return state

    except Exception as e:
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 에러 처리: 기본 템플릿 응답 반환
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        logger.error(f"❌ Response Generator Agent 에러: {str(e)}")

        # 검색 결과 여부에 따라 다른 기본 응답
        search_results = state.get("search_results", [])

        if search_results:
            # 검색 결과는 있지만 Claude 응답 실패
            fallback_response = f"""
죄송합니다, 응답을 생성하는 중 문제가 발생했습니다.

하지만 관련 정책 {len(search_results)}개를 찾았습니다:
1. {search_results[0].get('title', '정책')}

자세한 내용은 다시 질문해주시겠어요?
"""
        else:
            # 검색 결과도 없음
            fallback_response = """
죄송합니다, 요청하신 정책을 찾지 못했습니다.

다른 방법으로 도와드릴 수 있어요:
- 검색 조건을 다르게 입력해보세요
- "청년 정책"처럼 넓은 범위로 검색해보세요

무엇을 도와드릴까요?
"""

        state["final_response"] = fallback_response.strip()
        state["error"] = f"Response generation error: {str(e)}"
        state["current_agent"] = "response_generator"
        state["next_action"] = "end"

        # 에러 응답도 messages에 추가
        state["messages"].append({
            "role": "assistant",
            "content": fallback_response.strip()
        })

        return state


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 테스트 코드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if __name__ == "__main__":
    import asyncio
    from app.langgraph.state import create_initial_state

    async def test_response_generator():
        """Response Generator Agent 테스트"""
        print("=" * 60)
        print("Response Generator Agent 테스트")
        print("=" * 60)

        # Test Case 1: 검색 결과 있음
        print("\n[Test 1] 검색 결과가 있을 때")
        state1 = create_initial_state(
            user_message="25살인데 적금 추천해줘",
            user_context={"age": 25, "region": "서울"}
        )
        state1["search_results"] = [
            {
                "policy_id": "POLICY_001",
                "title": "청년 우대 적금",
                "description": "만 19-34세 청년을 위한 우대 금리 적금 상품",
                "category": "금융",
                "age_range": "19-34세",
                "region": "전국",
                "similarity_score": 0.92
            }
        ]
        state1["next_action"] = "generate_response"

        result1 = await response_generator_agent(state1)
        print(f"\n응답:\n{result1['final_response']}")
        print(f"\nnext_action: {result1['next_action']}")

        # Test Case 2: 검색 결과 없음
        print("\n[Test 2] 검색 결과가 없을 때")
        state2 = create_initial_state(
            user_message="100살 적금",
            user_context={"age": 100}
        )
        state2["search_results"] = []
        state2["next_action"] = "generate_response"

        result2 = await response_generator_agent(state2)
        print(f"\n응답:\n{result2['final_response']}")

    # asyncio.run(test_response_generator())
