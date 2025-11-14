#!/usr/bin/env python3
"""
Parse Korean youth policy text files and convert to structured JSON format.
This script reads all .txt files from the docs/청년 directory and creates a consolidated JSON file.
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime


def parse_policy_file(file_path: str) -> Dict[str, Any]:
    """
    Parse a single policy text file and extract structured information.

    Args:
        file_path: Path to the policy text file

    Returns:
        Dictionary containing parsed policy information
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')

    # Extract policy name from filename
    filename = os.path.basename(file_path)
    policy_name = filename.replace('.txt', '')

    # Initialize policy data structure
    policy_data = {
        'id': '',
        'name': policy_name,
        'region': '',
        'category': '',
        'deadline': '',
        'summary': '',
        'last_modified': '',
        'scraps': 0,
        'views': 0,
        'tags': [],
        'policy_number': '',
        'support_content': '',
        'operation_period': '',
        'application_period': '',
        'support_scale': '',
        'eligibility': {
            'age': '',
            'region': '',
            'income': '',
            'education': '',
            'major': '',
            'employment_status': '',
            'special_field': '',
            'additional_requirements': '',
            'exclusions': ''
        },
        'application': {
            'procedure': '',
            'review_process': '',
            'website': '',
            'required_documents': ''
        },
        'additional_info': {
            'notes': '',
            'supervising_agency': '',
            'operating_agency': '',
            'reference_sites': []
        },
        'full_text': content
    }

    # Parse basic information
    for i, line in enumerate(lines):
        line = line.strip()

        # Extract region, category, deadline from first few lines
        if i < 5:
            if line and not line.startswith('공유하기') and not line.startswith('인쇄'):
                if '전국' in line or '서울' in line or '경기' in line:
                    policy_data['region'] = line
                elif '일자리' in line or '복지문화' in line or '주거' in line:
                    policy_data['category'] = line
                elif 'D-' in line or '상시' in line or '신청마감' in line:
                    policy_data['deadline'] = line

        # Extract policy name
        if i >= 5 and i < 15 and line and not line.startswith('최종') and not line.startswith('#'):
            if policy_data['name'] == policy_name:  # If still using filename
                if len(line) > 5 and not line.startswith('공유하기'):
                    potential_name = line
                    # Check if this looks like a policy name
                    if any(keyword in potential_name for keyword in ['청년', '지원', '사업', '계좌', '급여', '대출']):
                        policy_data['name'] = potential_name

        # Extract last modified date
        if line.startswith('최종 수정일'):
            date_str = line.replace('최종 수정일', '').strip()
            policy_data['last_modified'] = date_str

        # Extract scraps and views
        if line.startswith('스크랩 수'):
            scraps = re.findall(r'\d+', line)
            if scraps:
                policy_data['scraps'] = int(scraps[0])

        if line.startswith('조회수'):
            views = re.findall(r'\d+', line)
            if views:
                policy_data['views'] = int(views[0])

        # Extract tags
        if line.startswith('#'):
            tags = [tag.strip() for tag in line.split('#') if tag.strip()]
            policy_data['tags'] = tags

    # Extract policy number
    for i, line in enumerate(lines):
        if '정책번호' in line and i + 1 < len(lines):
            policy_number = lines[i + 1].strip()
            if policy_number and policy_number.isdigit():
                policy_data['policy_number'] = policy_number
                break

    # Extract summary (description line after tags)
    for i, line in enumerate(lines):
        if line.startswith('#') and i + 1 < len(lines):
            potential_summary = lines[i + 1].strip()
            if len(potential_summary) > 20:
                policy_data['summary'] = potential_summary
                break

    # Extract support content
    support_content = []
    capture_support = False
    for i, line in enumerate(lines):
        if '지원내용' in line:
            capture_support = True
            continue
        if capture_support:
            if '사업 운영 기간' in line or '사업 신청기간' in line:
                break
            if line.strip() and not line.startswith('정책분야'):
                support_content.append(line.strip())

    if support_content:
        policy_data['support_content'] = '\n'.join(support_content)

    # Extract operation period
    for i, line in enumerate(lines):
        if '사업 운영 기간' in line and i + 1 < len(lines):
            policy_data['operation_period'] = lines[i + 1].strip()
            break

    # Extract application period
    for i, line in enumerate(lines):
        if '사업 신청기간' in line and i + 1 < len(lines):
            policy_data['application_period'] = lines[i + 1].strip()
            break

    # Extract support scale
    for i, line in enumerate(lines):
        if '지원 규모(명)' in line and i + 1 < len(lines):
            policy_data['support_scale'] = lines[i + 1].strip()
            break

    # Extract eligibility criteria
    eligibility_fields = {
        '연령': 'age',
        '거주지역': 'region',
        '소득': 'income',
        '학력': 'education',
        '전공': 'major',
        '취업상태': 'employment_status',
        '특화분야': 'special_field',
        '추가사항': 'additional_requirements',
        '참여제한 대상': 'exclusions'
    }

    for i, line in enumerate(lines):
        for kr_field, en_field in eligibility_fields.items():
            if line.strip() == kr_field and i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                # Collect multi-line content
                content = [next_line]
                j = i + 2
                while j < len(lines) and lines[j].strip() and lines[j].strip() not in eligibility_fields.keys():
                    if any(keyword in lines[j] for keyword in ['신청방법', '신청절차', '기타']):
                        break
                    content.append(lines[j].strip())
                    j += 1
                policy_data['eligibility'][en_field] = '\n'.join(content)
                break

    # Extract application information
    for i, line in enumerate(lines):
        if '신청절차' in line and i + 1 < len(lines):
            procedure = []
            j = i + 1
            while j < len(lines) and lines[j].strip() and '심사 및 발표' not in lines[j]:
                procedure.append(lines[j].strip())
                j += 1
            policy_data['application']['procedure'] = '\n'.join(procedure)

        if '신청 사이트' in line and i + 1 < len(lines):
            website = lines[i + 1].strip()
            if website.startswith('http'):
                policy_data['application']['website'] = website

    # Extract additional information
    for i, line in enumerate(lines):
        if '주관 기관' in line and i + 1 < len(lines):
            policy_data['additional_info']['supervising_agency'] = lines[i + 1].strip()

        if '운영 기관' in line and i + 1 < len(lines):
            policy_data['additional_info']['operating_agency'] = lines[i + 1].strip()

        if '참고사이트' in line and i + 1 < len(lines):
            ref_site = lines[i + 1].strip()
            if ref_site.startswith('http'):
                policy_data['additional_info']['reference_sites'].append(ref_site)

    # Generate unique ID from policy number or filename
    if policy_data['policy_number']:
        policy_data['id'] = policy_data['policy_number']
    else:
        # Generate ID from filename
        policy_data['id'] = 'POL_' + re.sub(r'[^\w]', '_', policy_name)[:50]

    return policy_data


def main():
    """Main function to parse all policy files and create JSON output."""

    # Set up paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    policies_dir = project_root / 'docs' / '청년'
    output_dir = project_root / 'data'
    output_file = output_dir / 'youth_policies.json'

    print(f"📂 Scanning directory: {policies_dir}")

    # Check if directory exists
    if not policies_dir.exists():
        print(f"❌ Error: Directory not found: {policies_dir}")
        return

    # Get all .txt files
    policy_files = list(policies_dir.glob('*.txt'))
    print(f"📄 Found {len(policy_files)} policy files")

    # Parse all files
    policies = []
    for file_path in policy_files:
        print(f"  ⚙️  Parsing: {file_path.name}")
        try:
            policy_data = parse_policy_file(str(file_path))
            policies.append(policy_data)
        except Exception as e:
            print(f"  ❌ Error parsing {file_path.name}: {e}")

    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)

    # Write to JSON file
    output_data = {
        'metadata': {
            'total_policies': len(policies),
            'generated_at': datetime.now().isoformat(),
            'source_directory': str(policies_dir),
            'description': 'Korean youth policy database for AI chatbot and vector search'
        },
        'policies': policies
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Successfully parsed {len(policies)} policies")
    print(f"📦 Output file: {output_file}")
    print(f"📊 File size: {output_file.stat().st_size / 1024:.2f} KB")

    # Print summary statistics
    print("\n📈 Summary Statistics:")
    print(f"  - Total policies: {len(policies)}")
    print(f"  - Policies with tags: {sum(1 for p in policies if p['tags'])}")
    print(f"  - Policies with websites: {sum(1 for p in policies if p['application']['website'])}")
    print(f"  - Average views: {sum(p['views'] for p in policies) / len(policies):.0f}")

    # Print categories
    categories = {}
    for p in policies:
        cat = p['category'] or '기타'
        categories[cat] = categories.get(cat, 0) + 1

    print("\n📑 Policies by Category:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {cat}: {count}")


if __name__ == '__main__':
    main()
