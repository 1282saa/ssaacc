import os
from typing import Optional, Dict, Any
import httpx
from loguru import logger

class ChatService:
    """간단한 AI 채팅 서비스"""
    
    def __init__(self):
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        if not self.anthropic_api_key:
            logger.warning("ANTHROPIC_API_KEY가 설정되지 않았습니다. AI 기능이 제한됩니다.")
    
    async def generate_response(self, user_message: str, context: Optional[Dict[str, Any]] = None) -> str:
        """사용자 메시지에 대한 AI 응답 생성"""
        
        if not self.anthropic_api_key:
            return "죄송합니다. 현재 AI 서비스가 준비되지 않았습니다. 관리자에게 문의해주세요."
        
        try:
            # 시스템 프롬프트 구성
            system_prompt = self._build_system_prompt(context)
            
            # Anthropic API 호출
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "Authorization": f"Bearer {self.anthropic_api_key}",
                        "Content-Type": "application/json",
                        "anthropic-version": "2023-06-01"
                    },
                    json={
                        "model": "claude-3-sonnet-20240229",
                        "max_tokens": 1000,
                        "system": system_prompt,
                        "messages": [
                            {
                                "role": "user",
                                "content": user_message
                            }
                        ]
                    }
                )
                
                if response.status_code != 200:
                    logger.error(f"Anthropic API 오류: {response.status_code} - {response.text}")
                    return "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                
                result = response.json()
                ai_response = result["content"][0]["text"]
                
                logger.info(f"AI 응답 생성 완료: {len(ai_response)} characters")
                return ai_response
                
        except Exception as e:
            logger.error(f"AI 응답 생성 오류: {str(e)}")
            return "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다."
    
    def _build_system_prompt(self, context: Optional[Dict[str, Any]] = None) -> str:
        """사용자 컨텍스트를 기반으로 시스템 프롬프트 구성"""
        
        base_prompt = """당신은 FinKuRN의 AI 금융 어드바이저입니다.

# 역할
- 청년을 위한 금융 정책과 상품을 추천하는 친근한 상담사
- 복잡한 금융 정보를 쉽고 이해하기 쉽게 설명
- 개인의 상황에 맞는 맞춤형 조언 제공

# 응답 스타일
- 친근하고 따뜻한 말투 사용 (존댓말)
- 실용적이고 구체적인 조언 제공
- 복잡한 용어는 쉬운 말로 풀어서 설명
- 적절한 이모지 사용으로 친근감 표현

# 주요 영역
- 청년 금융 정책 (청년도약계좌, 청년우대형 청약통장 등)
- 적금, 예금, 투자 상품 추천
- 신용 관리 및 대출 상담
- 보험, 연금 등 금융 계획"""

        # 사용자 컨텍스트가 있으면 추가
        if context:
            user_info = []
            if context.get("user_name"):
                user_info.append(f"사용자 이름: {context['user_name']}")
            
            # TODO: 온보딩 정보가 있으면 추가
            # if context.get("age"):
            #     user_info.append(f"연령: {context['age']}세")
            
            if user_info:
                base_prompt += f"\n\n# 현재 상담 중인 사용자 정보\n" + "\n".join(user_info)
        
        return base_prompt

# 싱글톤 인스턴스
chat_service = ChatService()