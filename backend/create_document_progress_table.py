"""
Create user_document_progress Table
사용자별 문서 완료 현황 테이블 생성
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from app.database import Base
from app.models.user import User  # Import all related models
from app.models.youth_policy import YouthPolicy
from app.models.document_progress import DocumentProgress

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres123@localhost:5432/finkurn")

def create_table():
    """user_document_progress 테이블 생성"""
    print("=" * 60)
    print("🔨 Creating user_document_progress Table")
    print("=" * 60)

    try:
        engine = create_engine(DATABASE_URL)

        # DocumentProgress 모델만 테이블로 생성
        Base.metadata.create_all(
            bind=engine,
            tables=[DocumentProgress.__table__],
            checkfirst=True
        )

        print("✅ user_document_progress 테이블 생성 완료!")
        print(f"📍 Database: {DATABASE_URL}")

        # 테이블 구조 확인
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'user_document_progress'
                ORDER BY ordinal_position
            """))

            columns = result.fetchall()
            print(f"\n📊 테이블 구조 ({len(columns)}개 컬럼):")
            print("-" * 60)
            for col in columns:
                nullable = "NULL" if col[2] == "YES" else "NOT NULL"
                print(f"  {col[0]:<25} {col[1]:<20} {nullable}")
            print("-" * 60)

        return True

    except Exception as e:
        print(f"❌ 테이블 생성 실패: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    create_table()
