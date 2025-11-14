"""
Database Configuration

SQLAlchemy 엔진 및 세션 설정
- PostgreSQL (프로덕션): pgvector 지원  
- SQLite (개발): 호환성 유지
"""

import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./finkurn_users.db")

# SQLite와 PostgreSQL 모두 지원
if DATABASE_URL.startswith("sqlite"):
    # SQLite 설정
    engine = create_engine(
        DATABASE_URL,
        connect_args={
            "check_same_thread": False,  # SQLite 전용
            "timeout": 30
        },
        poolclass=StaticPool,
        echo=os.getenv("SQLALCHEMY_ECHO", "false").lower() == "true"
    )
    
elif DATABASE_URL.startswith("postgresql"):
    # PostgreSQL 설정
    engine = create_engine(
        DATABASE_URL,
        pool_size=int(os.getenv("DB_POOL_SIZE", "10")),
        max_overflow=int(os.getenv("DB_MAX_OVERFLOW", "20")),
        pool_timeout=int(os.getenv("DB_POOL_TIMEOUT", "30")),
        echo=os.getenv("SQLALCHEMY_ECHO", "false").lower() == "true"
    )

else:
    raise ValueError(f"지원하지 않는 데이터베이스 URL: {DATABASE_URL}")

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db() -> Generator:
    """
    Database 의존성 주입
    
    FastAPI의 Depends()에서 사용
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """
    모든 테이블 생성
    
    개발 환경에서 초기 설정시 사용
    """
    from app.models.user import Base
    
    print(f"Creating tables with engine: {engine.url}")
    Base.metadata.create_all(bind=engine)
    print("✅ 사용자 관리 테이블이 생성되었습니다")


def get_database_info():
    """현재 데이터베이스 설정 정보 반환"""
    return {
        "database_url": DATABASE_URL,
        "database_type": "sqlite" if DATABASE_URL.startswith("sqlite") else "postgresql",
        "pool_size": os.getenv("DB_POOL_SIZE", "10") if not DATABASE_URL.startswith("sqlite") else "N/A",
        "echo_sql": os.getenv("SQLALCHEMY_ECHO", "false").lower() == "true"
    }