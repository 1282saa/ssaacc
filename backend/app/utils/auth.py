"""
JWT Authentication Utilities

JWT 토큰 생성, 검증, 디코딩 기능
"""

import os
from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import JWTError, jwt
import bcrypt

# JWT 설정 (환경변수에서 가져오기)
SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24시간

# bcrypt 솔트 라운드 설정
BCRYPT_ROUNDS = int(os.getenv("BCRYPT_ROUNDS", "12"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    JWT 액세스 토큰 생성
    
    Args:
        data: JWT 페이로드에 포함할 데이터
        expires_delta: 토큰 만료 시간 (기본: ACCESS_TOKEN_EXPIRE_MINUTES)
        
    Returns:
        str: JWT 토큰 문자열
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """
    JWT 토큰 검증 및 디코딩
    
    Args:
        token: JWT 토큰 문자열
        
    Returns:
        dict: 토큰 페이로드 (유효하지 않으면 None)
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def create_user_token(user_id: str, email: str) -> str:
    """
    사용자용 JWT 토큰 생성
    
    Args:
        user_id: 사용자 ID
        email: 사용자 이메일
        
    Returns:
        str: JWT 토큰
    """
    token_data = {
        "sub": user_id,  # subject (사용자 ID)
        "email": email,
        "type": "access_token"
    }
    
    return create_access_token(token_data)


def get_user_from_token(token: str) -> Optional[dict]:
    """
    토큰에서 사용자 정보 추출
    
    Args:
        token: JWT 토큰
        
    Returns:
        dict: 사용자 정보 {"user_id": str, "email": str} 또는 None
    """
    payload = verify_token(token)
    if payload is None:
        return None
    
    user_id = payload.get("sub")
    email = payload.get("email")
    token_type = payload.get("type")
    
    if user_id is None or email is None or token_type != "access_token":
        return None
    
    return {
        "user_id": user_id,
        "email": email
    }


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    비밀번호 검증
    
    Args:
        plain_password: 평문 비밀번호
        hashed_password: 해싱된 비밀번호
        
    Returns:
        bool: 비밀번호 일치 여부
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def get_password_hash(password: str) -> str:
    """
    비밀번호 해싱
    
    Args:
        password: 평문 비밀번호
        
    Returns:
        str: 해싱된 비밀번호
    """
    # bcrypt는 최대 72바이트만 지원하므로 UTF-8 바이트 기준으로 자동 잘라내기
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')