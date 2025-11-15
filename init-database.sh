#!/bin/bash

# Initialize PostgreSQL Database on EC2
# This script uploads and runs the database initialization SQL

set -e

echo "🗄️  FinKuRN Database Initialization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Read deployment info
if [ ! -f "deployment-info.txt" ]; then
    echo "❌ deployment-info.txt 파일이 없습니다."
    exit 1
fi

PUBLIC_IP=$(grep "Public IP:" deployment-info.txt | awk '{print $3}')
KEY_FILE=$(grep "Key File:" deployment-info.txt | awk '{print $3}')

if [ -z "$PUBLIC_IP" ] || [ -z "$KEY_FILE" ]; then
    echo "❌ deployment-info.txt에서 정보를 읽을 수 없습니다."
    exit 1
fi

echo "📡 Target: $PUBLIC_IP"
echo ""

# Upload init SQL script
echo "📤 Uploading database initialization script..."
scp -i "$KEY_FILE" \
    -o StrictHostKeyChecking=no \
    scripts/init_db.sql \
    "ec2-user@${PUBLIC_IP}:~/finkurn/"

echo ""
echo "🔧 Executing database initialization..."
echo ""

# Execute init script on EC2
ssh -i "$KEY_FILE" \
    -o StrictHostKeyChecking=no \
    "ec2-user@${PUBLIC_IP}" << 'ENDSSH'

cd ~/finkurn

# Run SQL script in PostgreSQL container
echo "Running init_db.sql..."
docker exec -i finkurn-postgres psql -U finkurn -d finkurn < init_db.sql

echo ""
echo "✅ Database initialized successfully!"
echo ""
echo "📊 Checking database status..."
docker exec -i finkurn-postgres psql -U finkurn -d finkurn -c "
SELECT
    'youth_policies' as table_name,
    COUNT(*) as row_count
FROM youth_policies;
"

echo ""
echo "🔍 Sample policy data:"
docker exec -i finkurn-postgres psql -U finkurn -d finkurn -c "
SELECT
    id,
    policy_name,
    region,
    category,
    LEFT(summary, 50) || '...' as summary_preview
FROM youth_policies
LIMIT 1;
"

ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Database initialization complete!"
echo ""
echo "📝 Note: Sample test policy has been inserted."
echo "   To load real policy data, run the policy loader script."
echo ""
echo "🧪 Test the API:"
echo "   curl http://${PUBLIC_IP}:8000/api/chats/test/messages \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"message\": \"청년 지원 정책 알려줘\"}'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
