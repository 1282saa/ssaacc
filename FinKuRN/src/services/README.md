# Services Layer Documentation

This document explains the service layer architecture for FinKuRN, optimized for easy migration from dummy data to real API calls.

## Overview

The services layer provides a clean separation between data fetching logic and UI components. Currently, all services return dummy data via `Promise.resolve()`, but they're structured to make the transition to real API calls seamless.

## Directory Structure

```
services/
├── homeService.ts      # HomeScreen data fetching
├── chatService.ts      # Chat functionality data fetching
├── index.ts           # Barrel export
└── README.md          # This file
```

## Architecture Principles

### 1. Service Layer Pattern

Each service is a singleton class that encapsulates data fetching logic:

```tsx
class HomeService {
  async getHomeScreenData(): Promise<HomeScreenData> {
    // Currently: return Promise.resolve(DUMMY_DATA);
    // Future: return fetch('/api/home').then(r => r.json());
    return Promise.resolve(DUMMY_HOME_DATA);
  }
}

export const homeService = new HomeService();
```

### 2. Promise-Based API

All methods return Promises, even for dummy data:

**Why?** This ensures components are already async-ready. When you replace dummy data with real API calls, components don't need to change.

```tsx
// Component code stays the same whether using dummy or real data
useEffect(() => {
  const fetchData = async () => {
    const data = await homeService.getHomeScreenData();
    setHomeData(data);
  };
  fetchData();
}, []);
```

### 3. Type Safety

All data structures are defined in `src/types/`:
- `src/types/home.ts` - HomeScreen data types
- `src/types/chat.ts` - Chat data types

Services use these types for both dummy data and future API responses.

## Available Services

### homeService

**Location**: `src/services/homeService.ts`

**Purpose**: Provides data for HomeScreen

**Methods**:

#### `getHomeScreenData()`

Fetches complete HomeScreen data including greeting, today items, savings, and spending.

```tsx
import { homeService } from '../services';

const data = await homeService.getHomeScreenData();
// Returns: HomeScreenData {
//   greeting: { userName, greetingMessage, motivationMessage }
//   todayItems: TodayItemData[]
//   todayItemsCount: number
//   savingsFilters: string[]
//   spendingFilters: string[]
//   savings: SavingsData
//   spending: SpendingData
// }
```

#### `getTodayItems()`

Fetches only today task items.

```tsx
const items = await homeService.getTodayItems();
// Returns: TodayItemData[]
```

#### `getSavingsData(filterId?: string)`

Fetches savings data with optional filter.

```tsx
const savings = await homeService.getSavingsData();
const filteredSavings = await homeService.getSavingsData('savings-1');
// Returns: SavingsData
```

#### `getSpendingData(period?: string)`

Fetches spending data for specified period.

```tsx
const spending = await homeService.getSpendingData('이번 달');
// Returns: SpendingData
```

---

### chatService

**Location**: `src/services/chatService.ts`

**Purpose**: Provides chat functionality

**Methods**:

#### `getChatList()`

Fetches list of chat conversations.

```tsx
import { chatService } from '../services';

const chats = await chatService.getChatList();
// Returns: ChatItem[]
```

#### `getChatMessages(chatId: string)`

Fetches messages for a specific chat.

```tsx
const messages = await chatService.getChatMessages('chat-1');
// Returns: Message[]
```

#### `sendMessage(chatId: string, messageText: string)`

Sends a message and receives AI response.

```tsx
const [userMessage, aiResponse] = await chatService.sendMessage(
  'chat-1',
  '안녕하세요'
);
// Returns: [Message, Message] (user message and AI response)
```

#### `createChat(initialMessage?: string)`

Creates a new chat conversation.

```tsx
const newChat = await chatService.createChat('적금 추천해주세요');
// Returns: ChatItem
```

#### `deleteChat(chatId: string)`

Deletes a chat conversation.

```tsx
const success = await chatService.deleteChat('chat-1');
// Returns: boolean
```

## Usage in Components

### Basic Usage

```tsx
import React, { useState, useEffect } from 'react';
import { homeService } from '../services';
import type { HomeScreenData } from '../types/home';

export const HomeScreen = () => {
  const [data, setData] = useState<HomeScreenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeData = await homeService.getHomeScreenData();
        setData(homeData);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <ErrorView />;

  return (
    <View>
      <Text>{data.greeting.greetingMessage}</Text>
      {/* ... rest of UI */}
    </View>
  );
};
```

### With State Management

```tsx
import React, { useState, useEffect } from 'react';
import { chatService } from '../services';
import type { Message } from '../types/chat';

export const ChatConversationPage = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await chatService.getChatMessages(chatId);
      setMessages(msgs);
    };
    fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    setSending(true);
    try {
      const [userMsg, aiMsg] = await chatService.sendMessage(chatId, inputText);
      setMessages([...messages, userMsg, aiMsg]);
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <View>
      <FlatList data={messages} renderItem={...} />
      <TextInput value={inputText} onChangeText={setInputText} />
      <Button title="전송" onPress={handleSend} disabled={sending} />
    </View>
  );
};
```

## Migrating to Real API

When backend APIs are ready, follow these steps:

### 1. Update Service Methods

Replace `Promise.resolve(DUMMY_DATA)` with actual fetch calls:

```tsx
// BEFORE (Dummy data)
async getHomeScreenData(): Promise<HomeScreenData> {
  return Promise.resolve(DUMMY_HOME_DATA);
}

// AFTER (Real API)
async getHomeScreenData(): Promise<HomeScreenData> {
  const response = await fetch('https://api.example.com/home', {
    headers: {
      'Authorization': `Bearer ${await getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
```

### 2. Add Error Handling

Implement proper error handling for network requests:

```tsx
async getHomeScreenData(): Promise<HomeScreenData> {
  try {
    const response = await fetch('/api/home');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    // Could fall back to cached data or throw
    throw error;
  }
}
```

### 3. Add Request/Response Interceptors (Optional)

Create a shared API client for common functionality:

```tsx
// src/services/apiClient.ts
class ApiClient {
  private baseUrl = 'https://api.example.com';

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: await this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  private async getHeaders() {
    return {
      'Authorization': `Bearer ${await getAuthToken()}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

Then update services:

```tsx
// homeService.ts
import { apiClient } from './apiClient';

async getHomeScreenData(): Promise<HomeScreenData> {
  return apiClient.get<HomeScreenData>('/home');
}
```

### 4. Update Dummy Data Location

Move dummy data to a separate file for testing:

```tsx
// src/services/__mocks__/homeData.ts
export const MOCK_HOME_DATA: HomeScreenData = {
  // ... dummy data
};

// src/services/homeService.ts
import { MOCK_HOME_DATA } from './__mocks__/homeData';

// For development/testing
const USE_MOCK_DATA = __DEV__ && false; // Toggle this

async getHomeScreenData(): Promise<HomeScreenData> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(MOCK_HOME_DATA);
  }

  return apiClient.get<HomeScreenData>('/home');
}
```

## Environment-Based Configuration

Use environment variables to switch between mock and real data:

```tsx
// .env.development
API_URL=http://localhost:3000/api
USE_MOCK_DATA=true

// .env.production
API_URL=https://api.production.com
USE_MOCK_DATA=false
```

```tsx
// src/services/config.ts
export const config = {
  apiUrl: process.env.API_URL || 'https://api.production.com',
  useMockData: process.env.USE_MOCK_DATA === 'true',
};

// src/services/homeService.ts
async getHomeScreenData(): Promise<HomeScreenData> {
  if (config.useMockData) {
    return Promise.resolve(DUMMY_HOME_DATA);
  }

  return apiClient.get<HomeScreenData>('/home');
}
```

## Testing Services

Services can be easily tested with Jest:

```tsx
// src/services/__tests__/homeService.test.ts
import { homeService } from '../homeService';

describe('homeService', () => {
  it('should fetch home screen data', async () => {
    const data = await homeService.getHomeScreenData();

    expect(data).toBeDefined();
    expect(data.greeting).toBeDefined();
    expect(data.todayItems).toBeInstanceOf(Array);
  });

  it('should fetch today items', async () => {
    const items = await homeService.getTodayItems();

    expect(items).toBeInstanceOf(Array);
    expect(items.length).toBeGreaterThan(0);
  });
});
```

## Best Practices

### 1. Always Use Services, Never Inline Data

```tsx
// BAD - Hardcoded data in component
const HomeScreen = () => {
  const [data] = useState({ greeting: 'Hello' });
  // ...
};

// GOOD - Data from service
const HomeScreen = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    homeService.getHomeScreenData().then(setData);
  }, []);
  // ...
};
```

### 2. Handle Loading and Error States

```tsx
const [data, setData] = useState<HomeScreenData | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await homeService.getHomeScreenData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### 3. Type Everything

```tsx
// Use defined types from src/types/
import type { HomeScreenData } from '../types/home';

const [data, setData] = useState<HomeScreenData | null>(null);

// NOT: useState<any>(null)
```

### 4. Avoid Prop Drilling with Service Calls

```tsx
// BAD - Fetching in parent and passing down
const ParentScreen = () => {
  const [data, setData] = useState(null);
  useEffect(() => { fetchData(); }, []);
  return <ChildComponent data={data} />;
};

// GOOD - Each component fetches what it needs
const SavingsSection = () => {
  const [savings, setSavings] = useState(null);
  useEffect(() => {
    homeService.getSavingsData().then(setSavings);
  }, []);
  // ...
};
```

## Troubleshooting

### Service returns undefined

Check that service method returns Promise:
```tsx
// WRONG
async getData() {
  DUMMY_DATA; // Missing return
}

// RIGHT
async getData() {
  return Promise.resolve(DUMMY_DATA);
}
```

### TypeScript errors on service calls

Ensure types are imported:
```tsx
import type { HomeScreenData } from '../types/home';
const [data, setData] = useState<HomeScreenData | null>(null);
```

### Network errors not handled

Add try-catch in component:
```tsx
try {
  const data = await homeService.getHomeScreenData();
  setData(data);
} catch (error) {
  console.error('Fetch failed:', error);
  // Show error UI
}
```

## Migration Checklist

When migrating to real API:

- [ ] Update service method to use fetch/axios
- [ ] Add proper error handling
- [ ] Add authentication headers if needed
- [ ] Test with real backend
- [ ] Update types if API response structure differs
- [ ] Add loading states in components
- [ ] Add error states in components
- [ ] Test offline behavior
- [ ] Add request retries if needed
- [ ] Update documentation

## Questions?

For questions about the service layer:
1. Check this README
2. Review service JSDoc comments
3. Check `src/README.md` for overall architecture
4. Review type definitions in `src/types/`
