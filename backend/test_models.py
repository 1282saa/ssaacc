#!/usr/bin/env python3
"""
모델 및 기본 기능 테스트

SQLAlchemy 모델들이 올바르게 정의되었는지 테스트
"""

import os
import sys
from datetime import datetime

# 현재 디렉토리를 Python path에 추가
sys.path.insert(0, os.path.abspath('.'))

def test_imports():
    """모든 모듈 import 테스트"""
    print("🔍 모듈 import 테스트...")
    
    try:
        # Core imports
        from app.core.database import get_database_info, create_tables
        print("✅ Database 모듈 import 성공")
        
        # Model imports
        from app.models import User, UserProfile, UserConsent, UserSocialAccount, YouthPolicy
        print("✅ Model 모듈 import 성공")
        
        # Schema imports
        from app.schemas import (
            LoginRequest, RegisterRequest, TokenResponse,
            UserResponse, UserProfileResponse, OnboardingStatusResponse
        )
        print("✅ Schema 모듈 import 성공")
        
        # Auth utils
        from app.utils.auth import create_user_token, verify_password, get_password_hash
        print("✅ Auth 유틸리티 import 성공")
        
        return True
        
    except Exception as e:
        print(f"❌ Import 실패: {e}")
        return False


def test_database_connection():
    """데이터베이스 연결 테스트"""
    print("\n🔍 데이터베이스 연결 테스트...")
    
    try:
        from app.core.database import get_database_info
        
        db_info = get_database_info()
        print(f"✅ 데이터베이스 정보:")
        for key, value in db_info.items():
            print(f"   {key}: {value}")
        
        return True
        
    except Exception as e:
        print(f"❌ 데이터베이스 연결 실패: {e}")
        return False


def test_models():
    """모델 생성 테스트"""
    print("\n🔍 모델 생성 테스트...")
    
    try:
        from app.models import User, UserProfile, UserConsent
        import uuid
        
        # User 모델 테스트
        user = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            name="테스트 사용자",
            is_active=True
        )
        print(f"✅ User 모델 생성: {user}")
        
        # UserProfile 모델 테스트
        profile = UserProfile(
            user_id=user.id,
            age=25,
            region="서울",
            job_category="직장인",
            goals=["적금", "투자"]
        )
        print(f"✅ UserProfile 모델 생성: {profile}")
        
        # 프로필 완성도 계산 테스트
        completion_rate = profile.calculate_completion_rate()
        print(f"✅ 프로필 완성도: {completion_rate}%")
        
        return True
        
    except Exception as e:
        print(f"❌ 모델 생성 실패: {e}")
        return False


def test_schemas():
    """Pydantic 스키마 테스트"""
    print("\n🔍 Pydantic 스키마 테스트...")
    
    try:
        from app.schemas import LoginRequest, RegisterRequest, UserProfileCreate
        
        # LoginRequest 테스트
        login_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        login_request = LoginRequest(**login_data)
        print(f"✅ LoginRequest 생성: {login_request.email}")
        
        # RegisterRequest 테스트
        register_data = {
            "email": "newuser@example.com",
            "password": "securepass123",
            "name": "신규 사용자"
        }
        register_request = RegisterRequest(**register_data)
        print(f"✅ RegisterRequest 생성: {register_request.name}")
        
        # UserProfileCreate 테스트
        profile_data = {
            "age": 28,
            "region": "경기",
            "job_category": "직장인",
            "goals": ["주택", "적금"]
        }
        profile_request = UserProfileCreate(**profile_data)
        print(f"✅ UserProfileCreate 생성: {profile_request.goals}")
        
        return True
        
    except Exception as e:
        print(f"❌ 스키마 생성 실패: {e}")
        return False


def test_auth_utils():
    """인증 유틸리티 테스트"""
    print("\n🔍 인증 유틸리티 테스트...")
    
    try:
        from app.utils.auth import (
            get_password_hash, verify_password, 
            create_user_token, get_user_from_token
        )
        
        # 비밀번호 해싱 테스트
        password = "testpassword123"
        hashed = get_password_hash(password)
        print(f"✅ 비밀번호 해싱 성공: {hashed[:20]}...")
        
        # 비밀번호 검증 테스트
        is_valid = verify_password(password, hashed)
        print(f"✅ 비밀번호 검증: {is_valid}")
        
        # JWT 토큰 생성 테스트
        user_id = "test-user-id"
        email = "test@example.com"
        token = create_user_token(user_id, email)
        print(f"✅ JWT 토큰 생성: {token[:50]}...")
        
        # JWT 토큰 검증 테스트
        user_info = get_user_from_token(token)
        print(f"✅ JWT 토큰 검증: {user_info}")
        
        return True
        
    except Exception as e:
        print(f"❌ 인증 유틸리티 테스트 실패: {e}")
        return False


def test_table_creation():
    """테이블 생성 테스트"""
    print("\n🔍 테이블 생성 테스트...")
    
    try:
        from app.core.database import create_tables
        
        # 백업을 위해 기존 DB 확인
        if os.path.exists("finkurn_users.db"):
            import shutil
            shutil.copy("finkurn_users.db", "finkurn_users.db.backup")
            print("📁 기존 데이터베이스 백업 완료")
        
        # 테이블 생성 시도
        create_tables()
        print("✅ 테이블 생성 성공")
        
        return True
        
    except Exception as e:
        print(f"❌ 테이블 생성 실패: {e}")
        return False


def main():
    """전체 테스트 실행"""
    print("🚀 FinKuRN 백엔드 모델 및 기능 테스트 시작\n")
    
    tests = [
        ("모듈 Import", test_imports),
        ("데이터베이스 연결", test_database_connection),
        ("모델 생성", test_models),
        ("Pydantic 스키마", test_schemas),
        ("인증 유틸리티", test_auth_utils),
        ("테이블 생성", test_table_creation)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ {test_name} 테스트 중 예외 발생: {e}")
            results.append((test_name, False))
    
    # 결과 요약
    print("\n" + "="*50)
    print("📊 테스트 결과 요약")
    print("="*50)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if success:
            passed += 1
    
    print(f"\n🎯 총 {total}개 테스트 중 {passed}개 통과 ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 모든 테스트 통과! 시스템이 정상 작동합니다.")
    else:
        print("⚠️  일부 테스트 실패. 문제를 확인해주세요.")
    
    return passed == total


if __name__ == "__main__":
    main()