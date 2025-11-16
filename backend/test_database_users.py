"""
Database User Verification Script
- PostgreSQL 연결 테스트
- 사용자 테이블 확인
- 사용자 목록 조회
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres123@localhost:5432/finkurn")

def test_database_connection():
    """데이터베이스 연결 테스트"""
    print("━" * 60)
    print("🔍 PostgreSQL 연결 테스트")
    print("━" * 60)

    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        print("✅ PostgreSQL 연결 성공!")
        print(f"📍 URL: {DATABASE_URL}")

        # 테이블 목록 조회
        result = connection.execute(text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        """))

        tables = [row[0] for row in result]
        print(f"\n📊 사용 가능한 테이블 ({len(tables)}개):")
        for table in tables:
            print(f"   - {table}")

        connection.close()
        return True

    except Exception as e:
        print(f"❌ PostgreSQL 연결 실패: {str(e)}")
        return False


def check_users_table():
    """사용자 테이블 확인"""
    print("\n" + "━" * 60)
    print("👥 사용자 테이블 조회")
    print("━" * 60)

    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()

        # 사용자 수 조회
        result = connection.execute(text("SELECT COUNT(*) FROM users"))
        count = result.scalar()
        print(f"✅ 총 사용자 수: {count}명")

        # 사용자 목록 조회 (최근 10명)
        result = connection.execute(text("""
            SELECT id, email, name, is_active, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 10
        """))

        users = result.fetchall()

        if users:
            print(f"\n📋 최근 등록된 사용자 (최대 10명):")
            print("─" * 60)
            for user in users:
                user_id, email, name, is_active, created_at = user
                status = "✅" if is_active else "❌"
                print(f"{status} ID: {user_id}")
                print(f"   Email: {email}")
                print(f"   Name: {name}")
                print(f"   Created: {created_at}")
                print("─" * 60)
        else:
            print("⚠️  등록된 사용자가 없습니다.")

        connection.close()
        return True

    except Exception as e:
        print(f"❌ 사용자 테이블 조회 실패: {str(e)}")
        return False


def main():
    """메인 함수"""
    print("\n" + "=" * 60)
    print("🔍 FinKuRN Database User Verification")
    print("=" * 60 + "\n")

    # 1. 데이터베이스 연결 테스트
    if not test_database_connection():
        print("\n❌ 데이터베이스 연결에 실패했습니다.")
        return

    # 2. 사용자 테이블 확인
    check_users_table()

    print("\n" + "=" * 60)
    print("✅ 검증 완료")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
