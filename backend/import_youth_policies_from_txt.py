"""
청년 정책 txt 파일을 파싱하여 데이터베이스에 업로드

txt 파일 형식:
- 라인 1: 지역
- 라인 2: 카테고리
- 라인 3: 신청기간
- 라인 8: 정책명
- 라인 14: 요약
- 라인 19: 정책번호
- 등등...
"""
import os
import re
import psycopg2
import json
from pathlib import Path

def parse_txt_file(filepath):
    """txt 파일 파싱"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f.readlines()]

    # 기본 정보 추출
    policy_data = {
        'region': lines[0] if len(lines) > 0 else None,
        'category': lines[1] if len(lines) > 1 else None,
        'deadline': lines[2] if len(lines) > 2 else None,
        'policy_name': lines[7] if len(lines) > 7 else None,
        'summary': lines[13] if len(lines) > 13 else None,
        'policy_number': None,
        'operation_period': None,
        'application_period': None,
        'support_content': None,
        'eligibility': {},
        'application_info': {},
        'additional_info': {},
        'required_documents': [],
        'full_text': '\n'.join(lines)
    }

    # 정책번호 찾기
    for i, line in enumerate(lines):
        if line == '정책번호' and i + 1 < len(lines):
            policy_data['policy_number'] = lines[i + 1]
        elif line == '지원내용' and i + 1 < len(lines):
            # 여러 줄일 수 있으므로 다음 섹션까지 수집
            content_lines = []
            j = i + 1
            while j < len(lines) and not lines[j].startswith('사업') and not lines[j].startswith('신청'):
                if lines[j] and not lines[j].startswith('□'):
                    content_lines.append(lines[j])
                j += 1
            policy_data['support_content'] = ' '.join(content_lines)
        elif line == '사업 운영 기간' and i + 1 < len(lines):
            policy_data['operation_period'] = lines[i + 1]
        elif line == '사업 신청기간' and i + 1 < len(lines):
            policy_data['application_period'] = lines[i + 1]

    # 자격 조건 파싱
    eligibility = {}
    for i, line in enumerate(lines):
        if line == '연령' and i + 1 < len(lines):
            age_text = lines[i + 1]
            # "만 19세~만 34세" 파싱
            age_match = re.search(r'만\s*(\d+)세.*?만\s*(\d+)세', age_text)
            if age_match:
                eligibility['age'] = {
                    'min': int(age_match.group(1)),
                    'max': int(age_match.group(2)),
                    'description': age_text
                }
        elif line == '소득' and i + 1 < len(lines):
            eligibility['income'] = {'description': lines[i + 1]}
        elif line == '거주지역' and i + 1 < len(lines):
            region = lines[i + 1]
            eligibility['region'] = [region] if region != '전국' else ['전국']

    policy_data['eligibility'] = eligibility

    # 신청 정보 파싱
    application_info = {}
    for i, line in enumerate(lines):
        if line.startswith('참고사이트'):
            if i + 1 < len(lines):
                url = lines[i + 1]
                if url.startswith('http'):
                    application_info['application_url'] = url
        elif line == '주관 기관' and i + 1 < len(lines):
            application_info['managing_agency'] = lines[i + 1]
        elif line == '운영 기관' and i + 1 < len(lines):
            application_info['operating_agency'] = lines[i + 1]

    policy_data['application_info'] = application_info

    # filename 생성 (고유 식별자)
    filename = policy_data['policy_name'].replace(' ', '_').replace('(', '').replace(')', '')
    filename = re.sub(r'[^\w가-힣]', '_', filename)
    policy_data['filename'] = f"{filename}_{policy_data['policy_number'][:10] if policy_data['policy_number'] else 'unknown'}"

    return policy_data


def insert_to_database(conn, policy_data):
    """데이터베이스에 삽입"""
    cursor = conn.cursor()

    try:
        # 중복 체크 (filename 기준)
        cursor.execute(
            "SELECT id FROM youth_policies WHERE filename = %s",
            (policy_data['filename'],)
        )
        existing = cursor.fetchone()

        if existing:
            print(f"  ⚠️  이미 존재: {policy_data['policy_name']}")
            return False

        # 삽입
        cursor.execute("""
            INSERT INTO youth_policies (
                policy_name, filename, policy_number, region, category, deadline,
                summary, full_text, operation_period, application_period, support_content,
                eligibility, application_info, additional_info, required_documents
            ) VALUES (
                %(policy_name)s, %(filename)s, %(policy_number)s, %(region)s, %(category)s, %(deadline)s,
                %(summary)s, %(full_text)s, %(operation_period)s, %(application_period)s, %(support_content)s,
                %(eligibility)s::jsonb, %(application_info)s::jsonb, %(additional_info)s::jsonb, %(required_documents)s::jsonb
            )
            RETURNING id;
        """, {
            **policy_data,
            'eligibility': json.dumps(policy_data['eligibility'], ensure_ascii=False),
            'application_info': json.dumps(policy_data['application_info'], ensure_ascii=False),
            'additional_info': json.dumps(policy_data['additional_info'], ensure_ascii=False),
            'required_documents': json.dumps(policy_data['required_documents'], ensure_ascii=False)
        })

        policy_id = cursor.fetchone()[0]
        conn.commit()
        print(f"  ✅ 추가됨: {policy_data['policy_name']} (ID: {policy_id})")
        return True

    except Exception as e:
        conn.rollback()
        print(f"  ❌ 오류: {policy_data['policy_name']} - {e}")
        return False
    finally:
        cursor.close()


def main():
    """메인 함수"""
    txt_dir = Path("/Users/yeong-gwang/Documents/배움 오전 1.38.42/외부/공모전/새싹ai/개발/ver3/docs/청년")

    print('=' * 80)
    print('📥 청년 정책 데이터 업로드')
    print('=' * 80)

    # txt 파일 목록
    txt_files = sorted(txt_dir.glob('*.txt'))
    print(f'\n📂 발견된 파일: {len(txt_files)}개\n')

    if not txt_files:
        print('❌ txt 파일을 찾을 수 없습니다.')
        return

    # 데이터베이스 연결
    try:
        conn = psycopg2.connect(
            host='localhost',
            database='finkurn',
            user='postgres',
            password='postgres123'
        )
        print('✅ 데이터베이스 연결 성공\n')
    except Exception as e:
        print(f'❌ 데이터베이스 연결 실패: {e}')
        return

    # 파일 처리
    success_count = 0
    skip_count = 0
    error_count = 0

    for i, filepath in enumerate(txt_files, 1):
        print(f'{i}. {filepath.name}')

        try:
            # 파싱
            policy_data = parse_txt_file(filepath)

            # 필수 필드 확인
            if not policy_data['policy_name']:
                print(f'  ⚠️  정책명 없음 - 스킵')
                skip_count += 1
                continue

            # 데이터베이스에 삽입
            if insert_to_database(conn, policy_data):
                success_count += 1
            else:
                skip_count += 1

        except Exception as e:
            print(f'  ❌ 파일 처리 오류: {e}')
            error_count += 1

    conn.close()

    # 결과 요약
    print('\n' + '=' * 80)
    print('📊 업로드 완료')
    print('=' * 80)
    print(f'✅ 성공: {success_count}개')
    print(f'⚠️  스킵: {skip_count}개 (중복 또는 오류)')
    print(f'❌ 실패: {error_count}개')
    print(f'📁 총 파일: {len(txt_files)}개')
    print('=' * 80)

    # 데이터베이스 확인
    conn = psycopg2.connect(
        host='localhost',
        database='finkurn',
        user='postgres',
        password='postgres123'
    )
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM youth_policies;')
    total = cursor.fetchone()[0]
    print(f'\n📊 현재 데이터베이스 총 정책 수: {total}개')

    cursor.execute("""
        SELECT policy_name, region, category
        FROM youth_policies
        ORDER BY created_at DESC
        LIMIT 5;
    """)
    print('\n📋 최근 추가된 정책 (최대 5개):')
    for row in cursor.fetchall():
        print(f'  - {row[0]} ({row[1]}, {row[2]})')

    cursor.close()
    conn.close()


if __name__ == '__main__':
    main()
