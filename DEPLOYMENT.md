# FinKuRN Backend 배포 가이드 (AWS EC2)

MVP용 저비용 배포 가이드입니다.

## 💰 비용 예상

- **EC2 t4g.micro**: 프리티어 12개월 무료, 이후 월 $6-8
- **트래픽**: 15GB/월까지 무료
- **총 예상 비용**: 프리티어 내 **$0/월**, 이후 **$6-10/월**

## 📋 사전 요구사항

1. AWS 계정
2. AWS CLI 설치 및 구성
3. AWS 자격 증명 (Access Key, Secret Key)

### AWS CLI 설치 (Mac)

```bash
brew install awscli
```

### AWS 자격 증명 설정

```bash
aws configure
```

입력 항목:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `ap-northeast-2` (Seoul)
- Default output format: `json`

## 🚀 배포 단계

### 1단계: EC2 인스턴스 생성

```bash
cd /Users/yeong-gwang/Documents/배움\ 오전\ 1.38.42/외부/공모전/새싹ai/개발/ver2
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

**결과물:**
- EC2 인스턴스 생성 (t4g.micro)
- Security Group 설정 (포트 22, 8000, 5432)
- SSH Key Pair 생성 (`finkurn-ec2-key.pem`)
- `deployment-info.txt` 파일 생성

**예상 시간:** 3-5분

### 2단계: Backend 코드 배포

```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

**동작:**
1. 배포 패키지 생성
2. EC2로 파일 업로드
3. Docker 환경 설정

**예상 시간:** 2-3분

### 3단계: EC2 접속 및 환경 설정

```bash
# deployment-info.txt에서 SSH 명령어 확인
cat deployment-info.txt

# SSH 접속
ssh -i finkurn-ec2-key.pem ec2-user@<PUBLIC_IP>
```

EC2 내부에서:

```bash
# 디렉토리 이동
cd ~/finkurn

# .env 파일 수정 (AWS 자격 증명 입력)
nano .env
```

`.env` 파일 수정:
```bash
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
AWS_DEFAULT_REGION=ap-northeast-2
DATABASE_URL=postgresql://finkurn:finkurn123!@#@postgres:5432/finkurn
API_HOST=0.0.0.0
API_PORT=8000
```

저장: `Ctrl+X` → `Y` → `Enter`

### 4단계: Backend 시작

```bash
./start-backend.sh
```

**동작:**
1. PostgreSQL 컨테이너 시작
2. Backend API 컨테이너 빌드 및 시작
3. 헬스 체크
4. 로그 출력

**예상 시간:** 5-10분 (첫 빌드)

### 5단계: API 테스트

로컬 터미널에서:

```bash
# Health Check
curl http://<PUBLIC_IP>:8000/health

# API Docs
open http://<PUBLIC_IP>:8000/docs
```

## 📡 API 엔드포인트

배포 완료 후 사용 가능한 엔드포인트:

- **Health Check**: `GET http://<PUBLIC_IP>:8000/health`
- **API Docs**: `GET http://<PUBLIC_IP>:8000/docs`
- **Chat**: `POST http://<PUBLIC_IP>:8000/api/chat`
- **Messages**: `POST http://<PUBLIC_IP>:8000/api/chats/{chat_id}/messages`
- **WebSocket**: `ws://<PUBLIC_IP>:8000/ws/chat/{chat_id}`

## 🔧 관리 명령어

### 컨테이너 상태 확인

```bash
docker-compose -f docker-compose.prod.yml ps
```

### 로그 확인

```bash
# 전체 로그
docker-compose -f docker-compose.prod.yml logs -f

# API 로그만
docker-compose -f docker-compose.prod.yml logs -f api

# PostgreSQL 로그만
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### 재시작

```bash
# 전체 재시작
docker-compose -f docker-compose.prod.yml restart

# API만 재시작
docker-compose -f docker-compose.prod.yml restart api
```

### 중지

```bash
docker-compose -f docker-compose.prod.yml down
```

### 업데이트 배포

```bash
# 로컬에서 실행
./deploy-backend.sh

# EC2에서 실행
cd ~/finkurn
./start-backend.sh
```

## 🐛 트러블슈팅

### 문제: API가 응답하지 않음

```bash
# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 로그 확인
docker-compose -f docker-compose.prod.yml logs api

# 재시작
docker-compose -f docker-compose.prod.yml restart api
```

### 문제: PostgreSQL 연결 실패

```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml logs postgres

# 데이터베이스 접속 테스트
docker exec -it finkurn-postgres psql -U finkurn -d finkurn
```

### 문제: 디스크 공간 부족

```bash
# Docker 정리
docker system prune -a

# 사용량 확인
df -h
```

### 문제: 메모리 부족

```bash
# 메모리 사용량 확인
free -h

# Swap 추가 (1GB)
sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 💡 프론트엔드 연동

### React Native에서 API 사용

`FinKuRN/src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://<PUBLIC_IP>:8000';

export const chatAPI = {
  sendMessage: async (chatId: string, message: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return response.json();
  },
};
```

### Expo 개발 환경에서 테스트

Expo는 실제 디바이스/시뮬레이터에서 실행되므로 `localhost` 대신 **Public IP**를 사용해야 합니다.

```typescript
// ❌ 작동하지 않음 (Expo)
const API_BASE_URL = 'http://localhost:8000';

// ✅ 작동함 (Expo)
const API_BASE_URL = 'http://<PUBLIC_IP>:8000';
```

## 🔒 보안 권장사항

### 1. SSH Key 보호

```bash
# .pem 파일 권한 확인
chmod 400 finkurn-ec2-key.pem

# Git에서 제외
echo "*.pem" >> .gitignore
```

### 2. 환경 변수 보호

```bash
# .env 파일 Git 제외
echo ".env" >> .gitignore
```

### 3. Security Group 제한 (선택사항)

프로덕션 배포 시 SSH 접근을 특정 IP로 제한:

```bash
# 현재 IP 확인
MY_IP=$(curl -s ifconfig.me)

# SSH를 내 IP만 허용하도록 변경
aws ec2 revoke-security-group-ingress \
  --group-id <SG_ID> \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id <SG_ID> \
  --protocol tcp \
  --port 22 \
  --cidr ${MY_IP}/32
```

## 📊 모니터링

### CPU 및 메모리 사용량

```bash
# 실시간 모니터링
top

# Docker 컨테이너 리소스
docker stats
```

### 디스크 사용량

```bash
df -h
du -sh ~/finkurn/*
```

## 🛑 인스턴스 중지/삭제

### 인스턴스 중지 (비용 절감)

```bash
aws ec2 stop-instances --instance-ids <INSTANCE_ID> --region ap-northeast-2
```

### 인스턴스 시작

```bash
aws ec2 start-instances --instance-ids <INSTANCE_ID> --region ap-northeast-2

# 새 Public IP 확인
aws ec2 describe-instances \
  --instance-ids <INSTANCE_ID> \
  --region ap-northeast-2 \
  --query 'Reservations[0].Instances[0].PublicIpAddress'
```

### 인스턴스 삭제 (완전 제거)

```bash
# 인스턴스 삭제
aws ec2 terminate-instances --instance-ids <INSTANCE_ID> --region ap-northeast-2

# Security Group 삭제
aws ec2 delete-security-group --group-id <SG_ID> --region ap-northeast-2

# Key Pair 삭제
aws ec2 delete-key-pair --key-name finkurn-ec2-key --region ap-northeast-2
rm finkurn-ec2-key.pem
```

## 📚 다음 단계

1. ✅ EC2 배포 완료
2. ⏳ 프론트엔드 API 클라이언트 생성
3. ⏳ 프론트엔드-백엔드 통합 테스트
4. ⏳ 도메인 연결 (선택사항)
5. ⏳ HTTPS 설정 (Let's Encrypt)
6. ⏳ CI/CD 파이프라인 구축

## 💬 문의

문제가 발생하면 다음 정보와 함께 문의하세요:

- `deployment-info.txt` 내용
- 에러 로그 (`docker-compose logs`)
- EC2 인스턴스 상태
