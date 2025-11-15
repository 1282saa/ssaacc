#!/bin/bash

# FinKuRN Backend AWS EC2 Deployment Script
# MVP용 저비용 배포 스크립트 (t3.micro - Free Tier, us-east-1)

set -e  # Exit on error

echo "🚀 FinKuRN Backend EC2 배포를 시작합니다..."

# Configuration - Virginia Region (가장 저렴)
INSTANCE_TYPE="t3.micro"
AMI_ID="ami-0cae6d6fe6048ca2c"  # Amazon Linux 2023 x86_64 (Virginia region)
KEY_NAME="finkurn-ec2-key"
SECURITY_GROUP_NAME="finkurn-backend-sg"
INSTANCE_NAME="finkurn-backend-mvp"
REGION="us-east-1"  # Virginia (가장 저렴한 리전)

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI가 설치되어 있지 않습니다."
    echo "설치: brew install awscli"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS 자격 증명이 설정되어 있지 않습니다."
    echo "설정: aws configure"
    exit 1
fi

echo "✅ AWS CLI 확인 완료"

# 1. Create Key Pair if not exists
if ! aws ec2 describe-key-pairs --key-names "$KEY_NAME" --region "$REGION" &> /dev/null; then
    echo "🔑 SSH Key Pair 생성 중..."
    aws ec2 create-key-pair \
        --key-name "$KEY_NAME" \
        --region "$REGION" \
        --query 'KeyMaterial' \
        --output text > "${KEY_NAME}.pem"
    chmod 400 "${KEY_NAME}.pem"
    echo "✅ Key Pair 생성 완료: ${KEY_NAME}.pem"
else
    echo "✅ Key Pair 이미 존재: $KEY_NAME"
fi

# 2. Create Security Group if not exists
SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=$SECURITY_GROUP_NAME" \
    --region "$REGION" \
    --query 'SecurityGroups[0].GroupId' \
    --output text 2>/dev/null || echo "None")

if [ "$SG_ID" == "None" ]; then
    echo "🔒 Security Group 생성 중..."
    SG_ID=$(aws ec2 create-security-group \
        --group-name "$SECURITY_GROUP_NAME" \
        --description "FinKuRN Backend API Security Group" \
        --region "$REGION" \
        --query 'GroupId' \
        --output text)

    # SSH (22)
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp \
        --port 22 \
        --cidr 0.0.0.0/0 \
        --region "$REGION"

    # API (8000)
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp \
        --port 8000 \
        --cidr 0.0.0.0/0 \
        --region "$REGION"

    # PostgreSQL (5432) - for direct access if needed
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp \
        --port 5432 \
        --cidr 0.0.0.0/0 \
        --region "$REGION"

    echo "✅ Security Group 생성 완료: $SG_ID"
else
    echo "✅ Security Group 이미 존재: $SG_ID"
fi

# 3. Launch EC2 Instance
echo "🖥️  EC2 인스턴스 생성 중 ($INSTANCE_TYPE, $REGION)..."

# User data script for instance initialization
USER_DATA=$(cat <<'EOF'
#!/bin/bash
# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
yum install -y git

# Create app directory
mkdir -p /home/ec2-user/finkurn
chown ec2-user:ec2-user /home/ec2-user/finkurn

echo "✅ EC2 초기 설정 완료" > /home/ec2-user/setup-complete.txt
EOF
)

INSTANCE_ID=$(aws ec2 run-instances \
    --image-id "$AMI_ID" \
    --instance-type "$INSTANCE_TYPE" \
    --key-name "$KEY_NAME" \
    --security-group-ids "$SG_ID" \
    --region "$REGION" \
    --user-data "$USER_DATA" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "✅ 인스턴스 생성 완료: $INSTANCE_ID"

# 4. Wait for instance to be running
echo "⏳ 인스턴스 시작 대기 중..."
aws ec2 wait instance-running \
    --instance-ids "$INSTANCE_ID" \
    --region "$REGION"

# Get Public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids "$INSTANCE_ID" \
    --region "$REGION" \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo ""
echo "🎉 EC2 인스턴스 배포 완료!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 인스턴스 정보:"
echo "  - Instance ID: $INSTANCE_ID"
echo "  - Public IP: $PUBLIC_IP"
echo "  - Instance Type: $INSTANCE_TYPE"
echo "  - Region: $REGION (Virginia - 최저가)"
echo ""
echo "🔑 SSH 접속:"
echo "  ssh -i ${KEY_NAME}.pem ec2-user@${PUBLIC_IP}"
echo ""
echo "📝 다음 단계:"
echo "  1. 인스턴스 초기화 대기 (약 2-3분)"
echo "  2. SSH로 접속하여 Docker 설치 확인"
echo "  3. ./deploy-backend.sh 스크립트로 백엔드 배포"
echo ""
echo "💡 배포 정보를 deployment-info.txt에 저장했습니다."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Save deployment info
cat > deployment-info.txt <<EOF
# FinKuRN Backend Deployment Info

Instance ID: $INSTANCE_ID
Public IP: $PUBLIC_IP
Instance Type: $INSTANCE_TYPE
Region: $REGION
Key File: ${KEY_NAME}.pem

SSH Command:
ssh -i ${KEY_NAME}.pem ec2-user@${PUBLIC_IP}

API Endpoint:
http://${PUBLIC_IP}:8000

Next Steps:
1. Wait 2-3 minutes for instance initialization
2. SSH into instance
3. Run ./deploy-backend.sh to deploy backend code
EOF

echo "✅ deployment-info.txt 파일 생성 완료"
