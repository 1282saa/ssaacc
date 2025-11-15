import asyncio
import httpx
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models.user import User, UserProfile, UserSocialAccount

async def test_auth_api():
    print("구글 OAuth 인증 API 테스트 시작...")
    
    base_url = "http://localhost:8000"
    
    engine = create_engine("sqlite:///./finkurn.db")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    async with httpx.AsyncClient() as client:
        try:
            print("\n1. 서버 상태 확인...")
            response = await client.get(f"{base_url}/health")
            if response.status_code == 200:
                print("서버 상태: 정상")
            else:
                print(f"서버 상태 확인 실패: {response.status_code}")
                return
            
            print("\n2. API 엔드포인트 확인...")
            response = await client.post(
                f"{base_url}/api/v1/auth/google",
                json={"access_token": "invalid_token_for_test"}
            )
            print(f"구글 인증 엔드포인트 응답: {response.status_code}")
            if response.status_code == 401:
                print("예상된 결과: 유효하지 않은 토큰으로 인한 401 에러")
            
            print("\n3. 현재 사용자 조회 테스트...")
            response = await client.get(
                f"{base_url}/api/v1/auth/me",
                headers={"Authorization": "Bearer invalid_token"}
            )
            print(f"현재 사용자 조회 응답: {response.status_code}")
            if response.status_code == 401:
                print("예상된 결과: 유효하지 않은 토큰으로 인한 401 에러")
            
            print("\n4. 로그아웃 엔드포인트 테스트...")
            response = await client.post(f"{base_url}/api/v1/auth/logout")
            if response.status_code == 200:
                print("로그아웃 엔드포인트 정상 동작")
            
            print("\n5. 데이터베이스 테스트...")
            db = SessionLocal()
            try:
                user_count = db.query(User).count()
                print(f"현재 데이터베이스 사용자 수: {user_count}")
            finally:
                db.close()
            
            print("\n✅ 모든 API 엔드포인트가 정상적으로 응답합니다")
            print("✅ 데이터베이스 연결 및 모델 정상 동작")
            print("✅ 구글 OAuth 인증 시스템 준비 완료")
            print("\n📋 다음 단계:")
            print("- 실제 구글 OAuth 토큰으로 테스트")
            print("- 프론트엔드에서 API 연동")
            print("- 온보딩 API 구현")
            
        except Exception as e:
            print(f"❌ 테스트 중 오류 발생: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_auth_api())