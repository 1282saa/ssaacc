# FinKuRN Project - Version 2

Financial Knowledge & Resource Navigator - 금융 지식 및 리소스 내비게이터

## Project Overview

FinKuRN은 사용자의 금융 생활을 돕는 종합 금융 앱입니다. 이 프로젝트는 React Native(Expo)를 사용하여 개발된 크로스 플랫폼 모바일 애플리케이션입니다.

## Directory Structure

```
ver2/
├── FinKuRN/                          # 메인 프로젝트 (React Native with Expo)
│   ├── src/                          # 소스 코드
│   │   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── screens/                  # 화면 컴포넌트 (7개 전체 리팩토링 완료)
│   │   ├── constants/                # 테마, 그라데이션 등 상수
│   │   ├── types/                    # TypeScript 타입 정의
│   │   └── navigation/               # 네비게이션 설정
│   ├── App.tsx                       # 앱 진입점
│   ├── package.json                  # 의존성 관리
│   ├── README.md                     # 프로젝트 문서
│   ├── REFACTORING_SUMMARY.md        # 리팩토링 요약
│   └── REFACTORING_GUIDE.md          # 리팩토링 가이드
│
├── data/                             # 데이터 파일
│   ├── data.json                     # 대용량 데이터 (42MB, git에서 제외)
│   └── .gitkeep                      # 폴더 유지용
│
├── docs/                             # 문서 및 디자인 자료
│   └── images/                       # 이미지 에셋
│       ├── source_image.png          # 소스 이미지
│       └── 핀쿠.png                   # 로고/디자인
│
├── prototypes/                       # 프로토타입 및 테스트
│   └── anima-web-prototype/          # Anima 웹 프로토타입
│       ├── index.html                # 웹 프로토타입 진입점
│       ├── package.json              # Vite + React 설정
│       ├── tailwind.config.js        # Tailwind CSS 설정
│       └── README.md                 # 프로토타입 문서
│
├── .git/                             # Git 저장소
├── .gitignore                        # Git 제외 파일 목록
└── README.md                         # 이 파일
```

## Quick Start

### FinKuRN (Main Project)

```bash
cd FinKuRN
npm install
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan QR code with Expo Go app.

### Web Prototype

```bash
cd prototypes/anima-web-prototype
npm install
npm run dev
```

## Tech Stack

### Main Project (FinKuRN)
- **Framework**: React Native with Expo
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation
- **Styling**: StyleSheet with centralized theme system
- **State Management**: React Hooks

### Code Quality Standards
- ✅ 단일 책임 원칙 (Single Responsibility Principle)
- ✅ DRY (Don't Repeat Yourself)
- ✅ 100% TypeScript 타입 안전성
- ✅ JSDoc 문서화
- ✅ 중앙화된 테마 시스템

## Project Status

### Completed
- [x] 전체 프로젝트 구조 재구성
- [x] FinKuRN 메인 프로젝트 완전 리팩토링
  - 7개 화면 전체 리팩토링 완료
  - 공통 컴포넌트 분리 (StatusBar, BackgroundGradient, ChatItem)
  - 테마 시스템 구축
  - TypeScript 타입 시스템 구축
- [x] 문서화 완료 (README, 리팩토링 가이드, 요약서)
- [x] 디렉토리 구조 정리

### Refactored Screens (7/7)
1. ✅ ChatConversationPage
2. ✅ NewChatPage
3. ✅ ChatbotScreenV2
4. ✅ HomeScreen
5. ✅ ExploreScreen
6. ✅ TodayListScreen
7. ✅ PlanUpgradePage

## Team Collaboration

이 프로젝트는 프론트엔드와 백엔드 개발자가 협업하며, 모두 Claude Code를 사용합니다.

### For Frontend Developers
- FinKuRN 프로젝트의 `src/README.md` 참고
- 모든 스크린은 일관된 패턴을 따름
- 테마 시스템 사용 필수 (`src/constants/theme.ts`)

### For Backend Developers
- API 통합 가이드는 `FinKuRN/src/README.md` 참고
- 타입 정의는 `src/types/` 참고
- 네비게이션 라우트 정의는 `src/types/navigation.ts` 참고

### For AI Assistants
- 전체 프로젝트 구조는 이 README 참고
- FinKuRN 프로젝트 상세 문서는 `FinKuRN/README.md`
- 소스 코드 구조는 `FinKuRN/src/README.md`
- 리팩토링 패턴은 `FinKuRN/REFACTORING_GUIDE.md`

## Key Features

### FinKuRN App
1. **Home Dashboard** - 재정 관리 대시보드
   - 오늘의 할 일 (D-DAY 알림)
   - 저축 현황
   - 소비 현황

2. **Explore** - 정부 지원금 및 혜택 탐색
   - 청년 지원 혜택
   - 금융 혜택
   - 맞춤형 추천

3. **AI Chatbot** - 금융 상담 챗봇
   - 실시간 대화
   - 금융 관련 질문 답변
   - 대화 히스토리 관리

4. **Today List** - 오늘의 할 일 상세 보기
   - 납부 마감일 관리
   - 서류 제출 마감일
   - 자동 출금 알림

## Development Guidelines

### Code Style
- TypeScript strict mode 사용
- JSDoc 주석 필수
- 테마 시스템 사용 (하드코딩 금지)
- 컴포넌트는 단일 책임 원칙 준수

### Git Workflow
- 대용량 파일은 `data/` 폴더에 저장 (git 제외)
- 빌드 결과물은 commit 하지 않음
- 의미 있는 commit 메시지 작성

## Documentation

- **FinKuRN/README.md** - 메인 프로젝트 개요 및 시작 가이드
- **FinKuRN/src/README.md** - 소스 코드 구조 및 컴포넌트 가이드
- **FinKuRN/REFACTORING_GUIDE.md** - 리팩토링 패턴 및 예제
- **FinKuRN/REFACTORING_SUMMARY.md** - 완료된 리팩토링 요약

## License

Copyright 2025. All rights reserved.

## Contact

For questions about the project:
- Frontend: FinKuRN 프로젝트 문서 참고
- Backend API: `FinKuRN/src/README.md`의 "Collaboration Notes" 섹션 참고
