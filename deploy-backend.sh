#!/bin/bash

# FinKuRN Backend Code Deployment Script
# EC2 인스턴스에서 실행하는 스크립트

set -e

echo "🚀 FinKuRN Backend 코드 배포를 시작합니다..."

# Read deployment info
if [ ! -f "deployment-info.txt" ]; then
    echo "❌ deployment-info.txt 파일이 없습니다."
    echo "먼저 ./deploy-ec2.sh를 실행하세요."
    exit 1
fi

PUBLIC_IP=$(grep "Public IP:" deployment-info.txt | awk '{print $3}')
KEY_FILE=$(grep "Key File:" deployment-info.txt | awk '{print $3}')

if [ -z "$PUBLIC_IP" ] || [ -z "$KEY_FILE" ]; then
    echo "❌ deployment-info.txt에서 정보를 읽을 수 없습니다."
    exit 1
fi

echo "📦 배포 대상: $PUBLIC_IP"

# Create deployment package
echo "📦 배포 패키지 생성 중..."
TEMP_DIR=$(mktemp -d)
mkdir -p "$TEMP_DIR/finkurn"

# Copy necessary files
cp -r scripts "$TEMP_DIR/finkurn/"
cp -r backend "$TEMP_DIR/finkurn/" 2>/dev/null || echo "backend 디렉토리 없음"
cp -r data "$TEMP_DIR/finkurn/" 2>/dev/null || echo "data 디렉토리 없음"

# Create docker-compose for production
cat > "$TEMP_DIR/finkurn/docker-compose.prod.yml" <<'EOF'
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg16
    container_name: finkurn-postgres
    environment:
      POSTGRES_DB: finkurn
      POSTGRES_USER: finkurn
      POSTGRES_PASSWORD: finkurn123!@#
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  api:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: finkurn-api
    environment:
      - DATABASE_URL=postgresql://finkurn:finkurn123!@#@postgres:5432/finkurn
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_DEFAULT_REGION=ap-northeast-2
      - PYTHONUNBUFFERED=1
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    restart: unless-stopped
    volumes:
      - ./data:/app/data

volumes:
  postgres_data:
EOF

# Create production Dockerfile
cat > "$TEMP_DIR/finkurn/Dockerfile.prod" <<'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY scripts/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY scripts/ ./scripts/
COPY data/ ./data/

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "scripts/api_server.py"]
EOF

# Create environment template
cat > "$TEMP_DIR/finkurn/.env.template" <<'EOF'
# AWS Credentials (Required)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_DEFAULT_REGION=ap-northeast-2

# Database
DATABASE_URL=postgresql://finkurn:finkurn123!@#@postgres:5432/finkurn

# API Settings
API_HOST=0.0.0.0
API_PORT=8000
EOF

# Create deployment script for EC2
cat > "$TEMP_DIR/finkurn/start-backend.sh" <<'EOF'
#!/bin/bash

set -e

echo "🚀 FinKuRN Backend 시작..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env 파일이 없습니다. .env.template을 복사하여 .env를 생성하고 AWS 자격 증명을 입력하세요."
    cp .env.template .env
    echo "❌ .env 파일을 수정한 후 다시 실행하세요."
    exit 1
fi

# Source .env
set -a
source .env
set +a

# Stop existing containers
echo "🛑 기존 컨테이너 중지 중..."
docker-compose -f docker-compose.prod.yml down || true

# Build and start
echo "🔨 Docker 이미지 빌드 중..."
docker-compose -f docker-compose.prod.yml build

echo "▶️  컨테이너 시작 중..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for database
echo "⏳ PostgreSQL 시작 대기 중..."
sleep 10

# Check health
echo "🏥 헬스 체크..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null; then
        echo "✅ Backend API 정상 작동 중!"
        echo ""
        echo "📋 API 엔드포인트:"
        echo "  - Health: http://$(curl -s ifconfig.me):8000/health"
        echo "  - Docs: http://$(curl -s ifconfig.me):8000/docs"
        echo "  - Chat: http://$(curl -s ifconfig.me):8000/api/chat"
        echo ""
        docker-compose -f docker-compose.prod.yml logs -f
        exit 0
    fi
    echo "대기 중... ($i/30)"
    sleep 2
done

echo "❌ Backend 시작 실패. 로그 확인:"
docker-compose -f docker-compose.prod.yml logs
exit 1
EOF

chmod +x "$TEMP_DIR/finkurn/start-backend.sh"

# Create tar archive
echo "📦 아카이브 생성 중..."
cd "$TEMP_DIR"
tar -czf finkurn-deploy.tar.gz finkurn/
cd -

echo "📤 파일 업로드 중..."
scp -i "$KEY_FILE" \
    -o StrictHostKeyChecking=no \
    "$TEMP_DIR/finkurn-deploy.tar.gz" \
    "ec2-user@${PUBLIC_IP}:~/"

echo "🔧 원격 배포 실행 중..."
ssh -i "$KEY_FILE" \
    -o StrictHostKeyChecking=no \
    "ec2-user@${PUBLIC_IP}" << 'ENDSSH'
set -e

echo "📦 아카이브 압축 해제 중..."
cd ~
tar -xzf finkurn-deploy.tar.gz
cd finkurn

echo "✅ 배포 파일 준비 완료"
echo ""
echo "⚠️  다음 단계:"
echo "1. .env 파일 수정:"
echo "   nano .env"
echo "   (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY 입력)"
echo ""
echo "2. Backend 시작:"
echo "   ./start-backend.sh"
echo ""
ENDSSH

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "🎉 배포 완료!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 다음 단계:"
echo ""
echo "1. SSH 접속:"
echo "   ssh -i $KEY_FILE ec2-user@${PUBLIC_IP}"
echo ""
echo "2. 디렉토리 이동:"
echo "   cd ~/finkurn"
echo ""
echo "3. .env 파일 수정 (AWS 자격 증명 입력):"
echo "   nano .env"
echo ""
echo "4. Backend 시작:"
echo "   ./start-backend.sh"
echo ""
echo "5. API 테스트:"
echo "   curl http://${PUBLIC_IP}:8000/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
