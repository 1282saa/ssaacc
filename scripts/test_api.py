#!/usr/bin/env python3
"""Test API endpoints."""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_chat():
    """Test chat endpoint."""
    print("=" * 60)
    print("Testing Chat API")
    print("=" * 60)

    payload = {
        "message": "서울 청년 주거 지원 정책 알려주세요",
        "context": {
            "age": 25,
            "region": "서울"
        },
        "top_k": 3
    }

    try:
        response = requests.post(f"{BASE_URL}/api/chat", json=payload, timeout=60)
        response.raise_for_status()

        data = response.json()

        print(f"\n✅ Response: {data['response'][:300]}...")
        print(f"\n📋 Found {len(data['retrieved_policies'])} policies:")
        for p in data['retrieved_policies']:
            print(f"  - {p['policy_name']} (score: {p['similarity_score']:.2f})")

        print("\n✅ Chat API working!")

    except Exception as e:
        print(f"\n❌ Error: {e}")


def test_search():
    """Test search endpoint."""
    print("\n" + "=" * 60)
    print("Testing Search API")
    print("=" * 60)

    payload = {
        "query": "청년 일자리",
        "top_k": 5
    }

    try:
        response = requests.post(f"{BASE_URL}/api/search", json=payload, timeout=30)
        response.raise_for_status()

        data = response.json()

        print(f"\n📋 Found {data['total_results']} policies:")
        for p in data['policies'][:5]:
            print(f"  - {p['policy_name']} (score: {p['similarity_score']:.2f})")

        print("\n✅ Search API working!")

    except Exception as e:
        print(f"\n❌ Error: {e}")


def test_health():
    """Test health endpoint."""
    print("\n" + "=" * 60)
    print("Testing Health API")
    print("=" * 60)

    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        response.raise_for_status()

        data = response.json()
        print(f"\nStatus: {data['status']}")
        print(f"Database: {data['database']}")
        print(f"Model: {data['model']}")

        print("\n✅ Health API working!")

    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    test_health()
    test_search()
    test_chat()

    print("\n" + "=" * 60)
    print("✅ All tests completed!")
    print("=" * 60)
