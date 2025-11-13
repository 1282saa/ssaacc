/**
 * WebSocket Service for Streaming Chat
 *
 * AWS Bedrock Claude의 스트리밍 응답을 WebSocket으로 받아 처리합니다.
 *
 * @module services/websocketService
 */

import { Platform } from 'react-native';

// WebSocket URL
const getWebSocketUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'ws://localhost:8000';
  }
  if (Platform.OS === 'ios') {
    return 'ws://localhost:8000';
  }
  if (Platform.OS === 'android') {
    return 'ws://10.0.2.2:8000';
  }
  return 'ws://localhost:8000';
};

const WS_BASE_URL = getWebSocketUrl();

export interface StreamMessage {
  type: 'start' | 'chunk' | 'policy' | 'end' | 'error';
  content?: string;
  full_response?: string;
  policies?: Array<{
    id: number;
    policy_name: string;
    similarity_score: number;
  }>;
  message?: string;
  chat_id?: string;
  timestamp?: string;
}

export interface WebSocketCallbacks {
  onStart?: (data: StreamMessage) => void;
  onChunk?: (chunk: string) => void;
  onPolicy?: (policies: any[]) => void;
  onEnd?: (fullResponse: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private chatId: string = '';
  private callbacks: WebSocketCallbacks = {};

  /**
   * WebSocket 연결 초기화
   */
  connect(chatId: string, callbacks: WebSocketCallbacks): void {
    this.chatId = chatId;
    this.callbacks = callbacks;

    const wsUrl = `${WS_BASE_URL}/ws/chat/${chatId}`;
    console.log('🔌 Connecting to WebSocket:', wsUrl);

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data: StreamMessage = JSON.parse(event.data);
        console.log('📨 WebSocket message:', data.type);

        switch (data.type) {
          case 'start':
            this.callbacks.onStart?.(data);
            break;

          case 'chunk':
            if (data.content) {
              this.callbacks.onChunk?.(data.content);
            }
            break;

          case 'policy':
            if (data.policies) {
              this.callbacks.onPolicy?.(data.policies);
            }
            break;

          case 'end':
            if (data.full_response) {
              this.callbacks.onEnd?.(data.full_response);
            }
            break;

          case 'error':
            this.callbacks.onError?.(data.message || 'Unknown error');
            break;
        }
      } catch (error) {
        console.error('❌ Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.callbacks.onError?.('WebSocket connection error');
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      this.callbacks.onClose?.();
    };
  }

  /**
   * 메시지 전송
   */
  sendMessage(message: string, context: Record<string, any> = {}): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket is not connected');
      this.callbacks.onError?.('WebSocket is not connected');
      return;
    }

    const payload = {
      message,
      context,
    };

    console.log('📤 Sending message via WebSocket:', payload);
    this.ws.send(JSON.stringify(payload));
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect(): void {
    if (this.ws) {
      console.log('🔌 Closing WebSocket connection');
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
