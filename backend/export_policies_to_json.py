"""
데이터베이스의 청년 정책 데이터를 JSON 파일로 내보내기

youth_policies 테이블의 모든 데이터를 하나의 JSON 파일로 변환합니다.
"""
import psycopg2
import json
from datetime import datetime

conn = psycopg2.connect(
    host='localhost',
    database='finkurn',
    user='postgres',
    password='postgres123'
)

cursor = conn.cursor()

print('=' * 80)
print('📤 청년 정책 데이터 JSON 변환')
print('=' * 80)

# 모든 정책 조회
cursor.execute("""
    SELECT
        id,
        policy_name,
        filename,
        policy_number,
        region,
        category,
        deadline,
        summary,
        full_text,
        operation_period,
        application_period,
        support_content,
        support_scale,
        eligibility,
        application_info,
        additional_info,
        required_documents,
        created_at,
        updated_at
    FROM youth_policies
    ORDER BY id;
""")

policies = []
for row in cursor.fetchall():
    policy = {
        "id": row[0],
        "policy_name": row[1],
        "filename": row[2],
        "policy_number": row[3],
        "region": row[4],
        "category": row[5],
        "deadline": row[6],
        "summary": row[7],
        "full_text": row[8],
        "operation_period": row[9],
        "application_period": row[10],
        "support_content": row[11],
        "support_scale": row[12],
        "eligibility": row[13] if row[13] else {},
        "application_info": row[14] if row[14] else {},
        "additional_info": row[15] if row[15] else {},
        "required_documents": row[16] if row[16] else [],
        "created_at": row[17].isoformat() if row[17] else None,
        "updated_at": row[18].isoformat() if row[18] else None
    }
    policies.append(policy)

cursor.close()
conn.close()

# JSON 파일로 저장
output_file = '/Users/yeong-gwang/Documents/배움 오전 1.38.42/외부/공모전/새싹ai/개발/ver3/backend/youth_policies_all.json'

json_data = {
    "metadata": {
        "total_count": len(policies),
        "export_date": datetime.now().isoformat(),
        "version": "1.0",
        "description": "청년 정책 데이터 (FinKuRN)"
    },
    "policies": policies
}

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(json_data, f, ensure_ascii=False, indent=2)

print(f'\n✅ JSON 변환 완료!')
print(f'   파일 위치: {output_file}')
print(f'   총 정책 수: {len(policies)}개')
print(f'   파일 크기: {len(json.dumps(json_data, ensure_ascii=False)) / 1024:.1f} KB')

# 카테고리별 통계
categories = {}
for policy in policies:
    cat = policy['category']
    categories[cat] = categories.get(cat, 0) + 1

print(f'\n📊 카테고리별 분포:')
for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
    print(f'   {cat}: {count}개')

# 서류 정보 통계
docs_count = sum(1 for p in policies if p['required_documents'])
print(f'\n📋 서류 정보:')
print(f'   서류 정보 있음: {docs_count}개 ({docs_count/len(policies)*100:.1f}%)')
print(f'   서류 정보 없음: {len(policies) - docs_count}개')

print('\n' + '=' * 80)
