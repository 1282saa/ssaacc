-- Initialize FinKuRN Database Schema
-- PostgreSQL + pgvector

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing table if exists (for fresh start)
DROP TABLE IF EXISTS youth_policies CASCADE;

-- Create youth_policies table
CREATE TABLE youth_policies (
    id SERIAL PRIMARY KEY,
    policy_name TEXT NOT NULL,
    policy_number TEXT,
    filename TEXT UNIQUE NOT NULL,
    region TEXT,
    category TEXT,
    deadline TEXT,
    summary TEXT,
    full_text TEXT NOT NULL,
    last_modified TEXT,
    scraps INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    tags TEXT[],
    support_content TEXT,
    operation_period TEXT,
    application_period TEXT,
    support_scale TEXT,
    eligibility JSONB DEFAULT '{}'::jsonb,
    application_info JSONB DEFAULT '{}'::jsonb,
    additional_info JSONB DEFAULT '{}'::jsonb,
    embedding vector(1024),
    s3_bucket TEXT,
    s3_key TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster search
CREATE INDEX idx_policy_name ON youth_policies(policy_name);
CREATE INDEX idx_category ON youth_policies(category);
CREATE INDEX idx_region ON youth_policies(region);
CREATE INDEX idx_embedding ON youth_policies USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create sample policy for testing (without embedding)
INSERT INTO youth_policies (
    policy_name,
    filename,
    region,
    category,
    summary,
    full_text,
    eligibility,
    application_info
) VALUES (
    '청년 지원 테스트 정책',
    'test_policy.txt',
    '전국',
    '일자리',
    '테스트용 샘플 정책입니다. 실제 데이터를 로드하려면 정책 데이터 로더를 실행하세요.',
    '이것은 테스트용 정책입니다.\n\n청년들을 위한 다양한 지원 혜택을 제공합니다.\n\n지원 대상: 만 19-34세 청년\n지원 내용: 취업 지원, 교육 지원\n신청 방법: 온라인 신청',
    '{"age": "만 19-34세", "region": "전국", "employment_status": "제한없음"}'::jsonb,
    '{"website": "https://www.youthcenter.go.kr"}'::jsonb
);

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE youth_policies TO finkurn;
GRANT USAGE, SELECT ON SEQUENCE youth_policies_id_seq TO finkurn;

-- Display summary
SELECT
    'Database initialized successfully!' as status,
    COUNT(*) as total_policies,
    'youth_policies table created with pgvector support' as note
FROM youth_policies;
