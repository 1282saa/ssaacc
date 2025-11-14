#!/usr/bin/env python3
"""
Automated chatbot for quick testing (non-interactive version).
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from bedrock_chatbot import BedrockPolicyBot

def main():
    # Database configuration (localhost Docker)
    db_config = {
        'host': 'localhost',
        'port': '5432',
        'database': 'finkurn',
        'user': 'postgres',
        'password': os.getenv('DB_PASSWORD', 'your-password')
    }

    print("=" * 60)
    print("FinKuRN AI Chatbot - Quick Test")
    print("=" * 60)
    print()

    try:
        # Initialize chatbot
        print("🚀 Initializing chatbot...")
        bot = BedrockPolicyBot(db_config=db_config, aws_profile=None)
        print("✅ Chatbot ready!")
        print()

        # Test queries
        test_queries = [
            "25살 청년인데 적금 추천해주세요",
            "서울에 사는 청년 대상 주거 지원 정책 알려줘",
            "청년 일자리 지원 정책 뭐가 있나요?"
        ]

        print("🔍 Testing chatbot with sample queries...")
        print("=" * 60)
        print()

        for i, query in enumerate(test_queries, 1):
            print(f"[Test {i}/3]")
            print(f"👤 You: {query}")
            print()

            result = bot.chat(query, top_k=3)

            print(f"🤖 FinKu: {result['response']}")
            print()

            if result['retrieved_policies']:
                print(f"📋 Retrieved {len(result['retrieved_policies'])} policies:")
                for p in result['retrieved_policies']:
                    print(f"   - {p['policy_name']} (유사도: {p['similarity_score']:.2f})")
                print()

            print("-" * 60)
            print()

        print("=" * 60)
        print("✅ All tests completed!")
        print()
        print("💬 For interactive chat, run:")
        print("   python3 bedrock_chatbot.py")
        print()

        bot.close()

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
