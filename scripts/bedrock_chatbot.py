#!/usr/bin/env python3
"""
AWS Bedrock Chatbot with PostgreSQL pgvector RAG.
Uses Claude 3.5 Sonnet for chat and Titan Embeddings for retrieval.
"""

import json
import boto3
import psycopg2
from typing import List, Dict, Any, Optional
from datetime import datetime
from prompts import get_system_prompt


class BedrockPolicyBot:
    """
    AI Chatbot for Korean youth policy recommendations.
    Uses RAG (Retrieval-Augmented Generation) with pgvector.
    """

    def __init__(
        self,
        db_config: Dict[str, str],
        aws_profile: Optional[str] = None,
        model_id: str = 'us.anthropic.claude-3-5-sonnet-20240620-v1:0',
        max_tokens: int = 4000,
        temperature: float = 0.7
    ):
        """
        Initialize chatbot.

        Args:
            db_config: PostgreSQL connection config
            aws_profile: AWS profile name
            model_id: Bedrock model ID
            max_tokens: Maximum tokens for response
            temperature: Model temperature (0.0-1.0)
        """
        self.db_config = db_config
        self.model_id = model_id
        self.max_tokens = max_tokens
        self.temperature = temperature

        # Initialize AWS Bedrock client
        session = boto3.Session(profile_name=aws_profile) if aws_profile else boto3.Session()
        self.bedrock = session.client('bedrock-runtime')

        # Connect to PostgreSQL
        self.conn = psycopg2.connect(**db_config)
        print("✅ Connected to PostgreSQL and AWS Bedrock")

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate query embedding using Titan Embeddings V2.

        Args:
            text: Query text

        Returns:
            1024-dimensional embedding vector
        """
        response = self.bedrock.invoke_model(
            modelId='amazon.titan-embed-text-v2:0',
            body=json.dumps({
                'inputText': text,
                'dimensions': 1024,
                'normalize': True
            })
        )

        response_body = json.loads(response['body'].read())
        return response_body['embedding']

    def search_policies(
        self,
        query: str,
        top_k: int = 5,
        similarity_threshold: float = 0.3
    ) -> List[Dict[str, Any]]:
        """
        Search for relevant policies using vector similarity.

        Args:
            query: User query
            top_k: Number of results to return
            similarity_threshold: Minimum similarity score (0-1)

        Returns:
            List of matching policies with scores
        """
        # Generate query embedding
        query_embedding = self.generate_embedding(query)
        embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'

        # Search database
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT
                id,
                policy_name,
                category,
                region,
                deadline,
                summary,
                support_content,
                eligibility,
                application_info,
                additional_info,
                tags,
                1 - (embedding <=> %s::vector) as similarity_score
            FROM youth_policies
            WHERE embedding IS NOT NULL
                AND (1 - (embedding <=> %s::vector)) >= %s
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (embedding_str, embedding_str, similarity_threshold, embedding_str, top_k))

        results = []
        for row in cursor.fetchall():
            results.append({
                'id': row[0],
                'policy_name': row[1],
                'category': row[2],
                'region': row[3],
                'deadline': row[4],
                'summary': row[5],
                'support_content': row[6],
                'eligibility': row[7],
                'application_info': row[8],
                'additional_info': row[9],
                'tags': row[10],
                'similarity_score': float(row[11])
            })

        cursor.close()
        return results

    def generate_response_stream(
        self,
        user_query: str,
        retrieved_policies: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, str]]] = None
    ):
        """
        Generate chatbot response using Claude with RAG (streaming mode).

        Args:
            user_query: User's question
            retrieved_policies: Policies retrieved from vector search
            conversation_history: Previous conversation turns

        Yields:
            Text chunks from Claude
        """
        # Build context from retrieved policies
        context_parts = []
        for i, policy in enumerate(retrieved_policies, 1):
            context_parts.append(f"""
<policy id="{i}">
<name>{policy['policy_name']}</name>
<category>{policy['category']}</category>
<region>{policy['region']}</region>
<deadline>{policy['deadline']}</deadline>
<summary>{policy['summary']}</summary>
<support_content>{policy['support_content']}</support_content>
<eligibility>{json.dumps(policy['eligibility'], ensure_ascii=False)}</eligibility>
<application_website>{policy['application_info'].get('website', 'N/A') if policy['application_info'] else 'N/A'}</application_website>
<similarity_score>{policy['similarity_score']:.2f}</similarity_score>
</policy>
""")

        context = "\n".join(context_parts)

        # Build system prompt using structured template
        system_prompt = get_system_prompt(context)

        # Build messages
        messages = []

        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history[-5:])  # Last 5 turns

        # Add current user query
        messages.append({
            'role': 'user',
            'content': user_query
        })

        # Call Claude via Bedrock with streaming
        request_body = {
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': self.max_tokens,
            'temperature': self.temperature,
            'system': system_prompt,
            'messages': messages
        }

        response = self.bedrock.invoke_model_with_response_stream(
            modelId=self.model_id,
            body=json.dumps(request_body)
        )

        # Stream the response
        for event in response['body']:
            chunk = json.loads(event['chunk']['bytes'])

            if chunk['type'] == 'content_block_delta':
                if chunk['delta']['type'] == 'text_delta':
                    yield chunk['delta']['text']

    def generate_response(
        self,
        user_query: str,
        retrieved_policies: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Generate chatbot response using Claude with RAG.

        Args:
            user_query: User's question
            retrieved_policies: Policies retrieved from vector search
            conversation_history: Previous conversation turns

        Returns:
            Chatbot response
        """
        # Build context from retrieved policies
        context_parts = []
        for i, policy in enumerate(retrieved_policies, 1):
            context_parts.append(f"""
<policy id="{i}">
<name>{policy['policy_name']}</name>
<category>{policy['category']}</category>
<region>{policy['region']}</region>
<deadline>{policy['deadline']}</deadline>
<summary>{policy['summary']}</summary>
<support_content>{policy['support_content']}</support_content>
<eligibility>{json.dumps(policy['eligibility'], ensure_ascii=False)}</eligibility>
<application_website>{policy['application_info'].get('website', 'N/A') if policy['application_info'] else 'N/A'}</application_website>
<similarity_score>{policy['similarity_score']:.2f}</similarity_score>
</policy>
""")

        context = "\n".join(context_parts)

        # Build system prompt using structured template
        system_prompt = get_system_prompt(context)

        # Build messages
        messages = []

        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history[-5:])  # Last 5 turns

        # Add current user query
        messages.append({
            'role': 'user',
            'content': user_query
        })

        # Call Claude via Bedrock
        request_body = {
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': self.max_tokens,
            'temperature': self.temperature,
            'system': system_prompt,
            'messages': messages
        }

        response = self.bedrock.invoke_model(
            modelId=self.model_id,
            body=json.dumps(request_body)
        )

        response_body = json.loads(response['body'].read())
        assistant_message = response_body['content'][0]['text']

        return assistant_message

    def chat(
        self,
        user_query: str,
        top_k: int = 5,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Complete chat workflow: search + generate.

        Args:
            user_query: User's question
            top_k: Number of policies to retrieve
            conversation_history: Previous conversation

        Returns:
            Dictionary with response and metadata
        """
        print(f"\n🔍 Searching for policies...")
        policies = self.search_policies(user_query, top_k=top_k)

        print(f"📊 Found {len(policies)} relevant policies")
        if policies:
            print(f"   Top match: {policies[0]['policy_name']} (score: {policies[0]['similarity_score']:.2f})")

        print(f"\n🤖 Generating response with Claude...")
        response = self.generate_response(user_query, policies, conversation_history)

        return {
            'response': response,
            'retrieved_policies': policies,
            'timestamp': datetime.now().isoformat()
        }

    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()


def main():
    """Interactive chat demo."""

    print("=" * 60)
    print("FinKuRN AI Chatbot - AWS Bedrock + PostgreSQL pgvector")
    print("=" * 60)
    print()

    # Configuration
    print("📝 Configuration:")
    db_config = {
        'host': input("  PostgreSQL host (default: localhost): ").strip() or 'localhost',
        'port': input("  PostgreSQL port (default: 5432): ").strip() or '5432',
        'database': input("  Database name (default: finkurn): ").strip() or 'finkurn',
        'user': input("  Username (default: postgres): ").strip() or 'postgres',
        'password': input("  Password: ").strip()
    }

    aws_profile = input("  AWS profile (press Enter for default): ").strip() or None

    print()
    print("🚀 Initializing chatbot...")

    try:
        bot = BedrockPolicyBot(db_config=db_config, aws_profile=aws_profile)

        print("✅ Chatbot ready!")
        print()
        print("💬 Start chatting (type 'exit' to quit)")
        print("=" * 60)
        print()

        conversation_history = []

        while True:
            # Get user input
            user_input = input("👤 You: ").strip()

            if user_input.lower() in ['exit', 'quit', '종료']:
                print("\n👋 Goodbye!")
                break

            if not user_input:
                continue

            # Get chatbot response
            result = bot.chat(user_input, conversation_history=conversation_history)

            print(f"\n🤖 FinKu: {result['response']}")
            print()

            # Update conversation history
            conversation_history.append({'role': 'user', 'content': user_input})
            conversation_history.append({'role': 'assistant', 'content': result['response']})

            # Show retrieved policies (optional debug info)
            if result['retrieved_policies']:
                print(f"\n📋 Retrieved {len(result['retrieved_policies'])} policies:")
                for p in result['retrieved_policies'][:3]:
                    print(f"   - {p['policy_name']} (score: {p['similarity_score']:.2f})")
                print()

        bot.close()

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
