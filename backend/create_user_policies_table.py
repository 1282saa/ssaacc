"""
user_policies 테이블 생성 스크립트
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
    cursor.execute("SELECT to_regclass('public.user_policies');")
    result = cursor.fetchone()

    if result[0] is not None:
        print("✓ user_policies 테이블이 이미 존재합니다.")
    else:
        # user_policies 테이블 생성
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS user_policies (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            policy_id INTEGER NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'interested',
            personal_deadline DATE,
            documents_total INTEGER NOT NULL DEFAULT 0,
            documents_submitted INTEGER NOT NULL DEFAULT 0,
            notes TEXT,
            reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
            reminder_days_before INTEGER NOT NULL DEFAULT 3,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            CONSTRAINT check_documents CHECK (documents_submitted <= documents_total),
            CONSTRAINT check_priority CHECK (reminder_days_before >= 0)
        );

        -- 인덱스 생성
        CREATE INDEX IF NOT EXISTS idx_user_policies_user_id ON user_policies(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_policies_policy_id ON user_policies(policy_id);
        CREATE INDEX IF NOT EXISTS idx_user_policies_status ON user_policies(status);
        CREATE INDEX IF NOT EXISTS idx_user_policies_updated_at ON user_policies(updated_at);
        """

        cursor.execute(create_table_sql)
        print("✓ user_policies 테이블이 생성되었습니다.")

    # 테이블 구조 확인
    cursor.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'user_policies'
        ORDER BY ordinal_position;
    """)

    print("\n📋 user_policies 테이블 구조:")
    print("-" * 80)
    for row in cursor.fetchall():
        print(f"  {row[0]:25} {row[1]:20} NULL:{row[2]:3} DEFAULT: {row[3]}")
    print("-" * 80)

    # 샘플 데이터 추가 (사용자가 있는 경우)
    cursor.execute("SELECT id FROM users LIMIT 1;")
    user = cursor.fetchone()

    if user:
        user_id = user[0]

        # 기존 샘플 데이터 확인
        cursor.execute("SELECT COUNT(*) FROM user_policies WHERE user_id = %s;", (user_id,))
        count = cursor.fetchone()[0]

        if count == 0:
            # 샘플 user_policies 추가 (youth_policies 테이블이 있다면 실제 policy_id 사용)
            cursor.execute("SELECT id FROM youth_policies LIMIT 4;")
            policies = cursor.fetchall()

            if policies:
                sample_policies = [
                    (user_id, policies[0][0], 'in_progress', '2025-11-20', 3, 2, '서류 준비 중', True, 3),
                    (user_id, policies[1][0] if len(policies) > 1 else 1, 'in_progress', '2025-11-22', 4, 3, '거의 완료', True, 3),
                    (user_id, policies[2][0] if len(policies) > 2 else 2, 'completed', None, 3, 3, '지원 완료', True, 3),
                    (user_id, policies[3][0] if len(policies) > 3 else 3, 'completed', None, 4, 4, '심사 중', True, 3),
                ]
            else:
                # youth_policies가 없으면 임시 policy_id 사용
                print("\n⚠️  youth_policies 테이블이 비어있습니다. 임시 policy_id를 사용합니다.")
                sample_policies = [
                    (user_id, 1, 'in_progress', '2025-11-20', 3, 2, '청년내일로 교통패스 - 서류 준비 중', True, 3),
                    (user_id, 2, 'in_progress', '2025-11-22', 4, 3, '청년전세보증금 반환보증 지원 - 거의 완료', True, 3),
                    (user_id, 3, 'completed', None, 3, 3, '서울청년수당 - 지원 완료', True, 3),
                    (user_id, 4, 'completed', None, 4, 4, '국민취업지원제도 - 심사 중', True, 3),
                ]

            insert_sql = """
            INSERT INTO user_policies
            (user_id, policy_id, status, personal_deadline, documents_total, documents_submitted, notes, reminder_enabled, reminder_days_before)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
            """

            for policy in sample_policies:
                try:
                    cursor.execute(insert_sql, policy)
                except Exception as e:
                    print(f"⚠️  샘플 데이터 추가 실패 (policy_id={policy[1]}): {e}")

            print(f"\n✓ {len(sample_policies)}개의 샘플 user_policies가 추가되었습니다.")
        else:
            print(f"\n✓ 이미 {count}개의 user_policies가 존재합니다.")
    else:
        print("\n⚠️  사용자가 없어서 샘플 데이터를 추가하지 않았습니다.")

    print("\n✅ user_policies 테이블 설정이 완료되었습니다!")

except Exception as e:
    print(f"\n❌ 오류 발생: {e}")
    import traceback
    traceback.print_exc()

finally:
    cursor.close()
    conn.close()
