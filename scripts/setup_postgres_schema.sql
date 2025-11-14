-- PostgreSQL + pgvector schema for youth policy database
-- This schema supports vector similarity search for AI chatbot

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create youth_policies table
CREATE TABLE IF NOT EXISTS youth_policies (
    -- Primary key
    id SERIAL PRIMARY KEY,

    -- Policy metadata
    policy_name VARCHAR(500) NOT NULL,
    policy_number VARCHAR(100),
    filename VARCHAR(255) NOT NULL UNIQUE,

    -- Basic information
    region VARCHAR(100),
    category VARCHAR(100),
    deadline VARCHAR(100),
    summary TEXT,

    -- Content
    full_text TEXT NOT NULL,

    -- Statistics
    last_modified VARCHAR(50),
    scraps INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,

    -- Tags (stored as array)
    tags TEXT[],

    -- Structured data (stored as JSONB for flexibility)
    support_content TEXT,
    operation_period VARCHAR(200),
    application_period VARCHAR(200),
    support_scale VARCHAR(100),

    -- Eligibility criteria (JSONB)
    eligibility JSONB,

    -- Application information (JSONB)
    application_info JSONB,

    -- Additional information (JSONB)
    additional_info JSONB,

    -- Vector embedding (1024 dimensions for AWS Titan Embeddings V2)
    embedding vector(1024),

    -- S3 reference
    s3_bucket VARCHAR(255),
    s3_key VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_policy_name ON youth_policies(policy_name);
CREATE INDEX IF NOT EXISTS idx_category ON youth_policies(category);
CREATE INDEX IF NOT EXISTS idx_region ON youth_policies(region);
CREATE INDEX IF NOT EXISTS idx_tags ON youth_policies USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_eligibility ON youth_policies USING GIN(eligibility);

-- Create vector similarity search index (HNSW algorithm)
-- HNSW (Hierarchical Navigable Small World) is faster than IVFFlat for most use cases
CREATE INDEX IF NOT EXISTS idx_embedding_hnsw ON youth_policies
USING hnsw (embedding vector_cosine_ops);

-- Alternative: IVFFlat index (use if you prefer or for comparison)
-- CREATE INDEX IF NOT EXISTS idx_embedding_ivfflat ON youth_policies
-- USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_youth_policies_updated_at
    BEFORE UPDATE ON youth_policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION search_policies_by_embedding(
    query_embedding vector(1024),
    limit_count INTEGER DEFAULT 5,
    similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    id INTEGER,
    policy_name VARCHAR(500),
    category VARCHAR(100),
    summary TEXT,
    similarity_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        yp.id,
        yp.policy_name,
        yp.category,
        yp.summary,
        1 - (yp.embedding <=> query_embedding) as similarity_score
    FROM youth_policies yp
    WHERE yp.embedding IS NOT NULL
        AND (1 - (yp.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY yp.embedding <=> query_embedding
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search by keywords with vector search
CREATE OR REPLACE FUNCTION search_policies_hybrid(
    search_query TEXT,
    query_embedding vector(1024) DEFAULT NULL,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id INTEGER,
    policy_name VARCHAR(500),
    category VARCHAR(100),
    summary TEXT,
    match_type VARCHAR(50),
    score FLOAT
) AS $$
BEGIN
    -- If embedding is provided, use vector similarity search
    IF query_embedding IS NOT NULL THEN
        RETURN QUERY
        SELECT
            yp.id,
            yp.policy_name,
            yp.category,
            yp.summary,
            'vector'::VARCHAR(50) as match_type,
            (1 - (yp.embedding <=> query_embedding))::FLOAT as score
        FROM youth_policies yp
        WHERE yp.embedding IS NOT NULL
        ORDER BY yp.embedding <=> query_embedding
        LIMIT limit_count;
    ELSE
        -- Fallback to text search
        RETURN QUERY
        SELECT
            yp.id,
            yp.policy_name,
            yp.category,
            yp.summary,
            'text'::VARCHAR(50) as match_type,
            1.0::FLOAT as score
        FROM youth_policies yp
        WHERE
            yp.policy_name ILIKE '%' || search_query || '%'
            OR yp.summary ILIKE '%' || search_query || '%'
            OR yp.full_text ILIKE '%' || search_query || '%'
            OR search_query = ANY(yp.tags)
        ORDER BY
            CASE
                WHEN yp.policy_name ILIKE '%' || search_query || '%' THEN 1
                WHEN yp.summary ILIKE '%' || search_query || '%' THEN 2
                WHEN search_query = ANY(yp.tags) THEN 3
                ELSE 4
            END
        LIMIT limit_count;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create view for easy querying
CREATE OR REPLACE VIEW policy_summary AS
SELECT
    id,
    policy_name,
    category,
    region,
    deadline,
    summary,
    tags,
    views,
    scraps,
    operation_period,
    application_period,
    application_info->>'website' as website,
    additional_info->>'supervising_agency' as supervising_agency,
    created_at,
    updated_at
FROM youth_policies
ORDER BY views DESC;

-- Sample queries for testing
COMMENT ON TABLE youth_policies IS 'Korean youth policy database with vector embeddings for AI chatbot';
COMMENT ON COLUMN youth_policies.embedding IS 'Vector embedding (1024d) generated by AWS Bedrock Titan Embeddings V2';
COMMENT ON FUNCTION search_policies_by_embedding IS 'Search policies using vector similarity (cosine distance)';
COMMENT ON FUNCTION search_policies_hybrid IS 'Hybrid search combining vector similarity and keyword matching';

-- Print success message
DO $$
BEGIN
    RAISE NOTICE '✅ Schema created successfully!';
    RAISE NOTICE '📊 Table: youth_policies';
    RAISE NOTICE '🔍 Indexes: name, category, region, tags, eligibility, embedding (HNSW)';
    RAISE NOTICE '⚙️  Functions: search_policies_by_embedding, search_policies_hybrid';
    RAISE NOTICE '📈 View: policy_summary';
END $$;
