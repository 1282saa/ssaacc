"""
Create user_document_progress Table using Raw SQL
SQL을 직접 사용해서 테이블 생성
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres123@localhost:5432/finkurn")

def create_table():
    """user_document_progress 테이블 생성"""
    print("=" * 60)
    print("🔨 Creating user_document_progress Table (SQL)")
    print("=" * 60)

    CREATE_TABLE_SQL = """
    CREATE TABLE IF NOT EXISTS user_document_progress (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        policy_id INTEGER NOT NULL REFERENCES youth_policies(id) ON DELETE CASCADE,
        document_index INTEGER NOT NULL,
        document_name VARCHAR(200) NOT NULL,
        is_completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE,
        CONSTRAINT uq_user_policy_document UNIQUE (user_id, policy_id, document_index)
    );

    -- 인덱스 생성
    CREATE INDEX IF NOT EXISTS idx_user_document_progress_user_id ON user_document_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_document_progress_policy_id ON user_document_progress(policy_id);

    -- 코멘트 추가
    COMMENT ON TABLE user_document_progress IS '사용자별 정책 문서 완료 현황';
    COMMENT ON COLUMN user_document_progress.id IS '진행 상황 고유 ID';
    COMMENT ON COLUMN user_document_progress.user_id IS '사용자 ID';
    COMMENT ON COLUMN user_document_progress.policy_id IS '정책 ID';
    COMMENT ON COLUMN user_document_progress.document_index IS '문서 인덱스 (required_documents 배열의 인덱스)';
    COMMENT ON COLUMN user_document_progress.document_name IS '문서명 (신분증, 통장 사본 등)';
    COMMENT ON COLUMN user_document_progress.is_completed IS '완료 여부';
    COMMENT ON COLUMN user_document_progress.created_at IS '생성 시간';
    COMMENT ON COLUMN user_document_progress.updated_at IS '업데이트 시간';
    COMMENT ON COLUMN user_document_progress.completed_at IS '완료 시간';
    """

    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            conn.execute(text(CREATE_TABLE_SQL))
            conn.commit()

        print("✅ user_document_progress 테이블 생성 완료!")
        print(f"📍 Database: {DATABASE_URL}")

        # 테이블 구조 확인
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
