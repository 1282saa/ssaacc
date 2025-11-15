#!/usr/bin/env python3

from app.core.security import create_access_token

# 테스트용 JWT 토큰 생성
user_email = "ruggy1356@gmail.com"
token = create_access_token(subject=user_email)

print(f"Test JWT Token: {token}")