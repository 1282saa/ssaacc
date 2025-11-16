"""
youth_policies 테이블 생성 스크립트
"""
import psycopg2
from psycopg2 import sql

# 데이터베이스 연결 설정
conn = psycopg2.connect(
    host="localhost",
    database="finkurn",
    user="postgres",
    password="postgres123"
)
conn.autocommit = True
cursor = conn.cursor()

try:
    # 먼저 기존 테이블이 있는지 확인
    cursor.execute("SELECT to_regclass('public.youth_policies');")
    result = cursor.fetchone()

    if result[0] is not None:
        print("✓ youth_policies 테이블이 이미 존재합니다.")
    else:
        # youth_policies 테이블 생성
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS youth_policies (
            id SERIAL PRIMARY KEY,
            policy_name VARCHAR(500) NOT NULL,
            policy_number VARCHAR(100),
            filename VARCHAR(255) NOT NULL UNIQUE,
            region VARCHAR(100),
            category VARCHAR(100),
            deadline VARCHAR(100),
            summary TEXT,
            full_text TEXT NOT NULL,
            last_modified VARCHAR(50),
            scraps INTEGER DEFAULT 0,
            views INTEGER DEFAULT 0,
            tags TEXT[],
            support_content TEXT,
            operation_period VARCHAR(200),
            application_period VARCHAR(200),
            support_scale VARCHAR(100),
            eligibility JSONB,
            application_info JSONB,
            additional_info JSONB,
            s3_bucket VARCHAR(255),
            s3_key VARCHAR(500),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 인덱스 생성
        CREATE INDEX IF NOT EXISTS idx_youth_policies_category ON youth_policies(category);
        CREATE INDEX IF NOT EXISTS idx_youth_policies_region ON youth_policies(region);
        CREATE INDEX IF NOT EXISTS idx_youth_policies_policy_name ON youth_policies(policy_name);
        """

        cursor.execute(create_table_sql)
        print("✓ youth_policies 테이블이 생성되었습니다.")

    # 테이블 구조 확인
    cursor.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'youth_policies'
        ORDER BY ordinal_position;
    """)

    print("\n📋 youth_policies 테이블 구조:")
    print("-" * 80)
    for row in cursor.fetchall():
        print(f"  {row[0]:25} {row[1]:30} NULL:{row[2]}")
    print("-" * 80)

    # 테이블 개수 확인
    cursor.execute("SELECT COUNT(*) FROM youth_policies;")
    count = cursor.fetchone()[0]
    print(f"\n✓ 현재 {count}개의 정책이 등록되어 있습니다.")

    if count == 0:
        print("\n⚠️  정책 데이터가 없습니다.")
        print("   실제 정책 데이터는 별도의 데이터 import 스크립트를 통해 추가하세요.")

    print("\n✅ youth_policies 테이블 설정이 완료되었습니다!")

except Exception as e:
    print(f"\n❌ 오류 발생: {e}")
    import traceback
    traceback.print_exc()

finally:
    cursor.close()
    conn.close()
