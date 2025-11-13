#!/usr/bin/env python3
"""
간단한 기능 테스트
"""

def test_basic_imports():
    """기본 import 테스트"""
    try:
        print("🔍 기본 import 테스트...")
        
        # 기본 라이브러리
        import os
        import sys
        print("✅ 기본 라이브러리 import 성공")
        
        # SQLAlchemy
        from sqlalchemy import create_engine
        from sqlalchemy.orm import declarative_base
        print("✅ SQLAlchemy import 성공")
        
        # Pydantic
        from pydantic import BaseModel, Field
        print("✅ Pydantic import 성공")
        
        return True
        
    except Exception as e:
        print(f"❌ Import 실패: {e}")
        return False


def test_simple_pydantic():
    """간단한 Pydantic 테스트"""
    try:
        print("\n🔍 Pydantic 기본 테스트...")
        from pydantic import BaseModel, Field
        
        class TestModel(BaseModel):
            name: str = Field(..., description="이름")
            age: int = Field(..., description="나이")
        
        test_data = TestModel(name="테스트", age=25)
        print(f"✅ Pydantic 모델 생성: {test_data.name}, {test_data.age}")
        
        return True
        
    except Exception as e:
        print(f"❌ Pydantic 테스트 실패: {e}")
        return False


def test_simple_auth():
    """간단한 인증 테스트"""
    try:
        print("\n🔍 인증 기본 테스트...")
        from passlib.context import CryptContext
        
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        password = "test123"
        hashed = pwd_context.hash(password)
        is_valid = pwd_context.verify(password, hashed)
        
        print(f"✅ 비밀번호 해싱 테스트: {is_valid}")
        
        return True
        
    except Exception as e:
        print(f"❌ 인증 테스트 실패: {e}")
        return False


def test_database_basic():
    """기본 데이터베이스 테스트"""
    try:
        print("\n🔍 데이터베이스 기본 테스트...")
        from sqlalchemy import create_engine, Column, Integer, String
        from sqlalchemy.orm import declarative_base, sessionmaker
        
        Base = declarative_base()
        
        class TestUser(Base):
            __tablename__ = "test_users"
            id = Column(Integer, primary_key=True)
            name = Column(String(50))
        
        # 메모리 SQLite 엔진 생성
        engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(engine)
        
        print("✅ 테이블 생성 성공")
        
        return True
        
    except Exception as e:
        print(f"❌ 데이터베이스 테스트 실패: {e}")
        return False


def main():
    print("🚀 간단 기능 테스트 시작\n")
    
    tests = [
        ("기본 Import", test_basic_imports),
        ("Pydantic 기본", test_simple_pydantic), 
        ("인증 기본", test_simple_auth),
        ("데이터베이스 기본", test_database_basic)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        if test_func():
            passed += 1
    
    print(f"\n🎯 총 {total}개 테스트 중 {passed}개 통과 ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 모든 기본 기능이 정상 작동합니다!")
        print("다음 단계: API 엔드포인트 구현 준비 완료")
    else:
        print("⚠️ 일부 기본 기능에 문제가 있습니다.")


if __name__ == "__main__":
    main()