# FinKuRN - Financial Knowledge & Resource Navigator

> A React Native mobile application for financial literacy and resource management, built with Expo and optimized for AI-assisted development.

## 🚀 Quick Start for AI & New Developers

**If you're an AI assistant or new developer, start here:**

### Reading Order (5-10 minutes to understand entire project)

```
1. README.md (this file)        ← You are here - Project overview
   ↓
2. PROJECT_OVERVIEW.md          ← Architecture & documentation map (START HERE!)
   ↓
3. Choose your role:

   📱 Frontend Developer?
   → src/README.md              ← Source code architecture
   → src/components/README.md   ← Component guidelines
   → src/services/README.md     ← Data layer

   🔧 Backend Developer?
   → BACKEND_INTEGRATION_GUIDE.md  ← Integration guide
   → API_SPECIFICATION.md          ← API specs

   🤖 AI Assistant?
   → All of the above, in order
```

**Important**: We created `PROJECT_OVERVIEW.md` specifically for fast onboarding. Read it first!

---

## 📋 Project Overview

FinKuRN is a comprehensive financial assistant app that helps users:
- **Onboarding**: 5-step guided setup for personalized experience
- **Plan Management**: Track daily financial tasks with interactive checklists
- **Explore**: Discover government financial support programs
- **Savings & Spending**: Monitor financial habits with visual insights
- **AI Chatbot**: Get instant financial guidance and recommendations
- **Personalized Content**: Receive tailored financial information

---

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript (strict mode, zero `any`)
- **Navigation**: React Navigation (type-safe)
- **UI**: Custom design system with centralized theme
- **State Management**: React Hooks
- **Data Layer**: Service layer with Promise-based API (ready for backend integration)

---

## 📁 Project Structure (High-Level)

```
FinKuRN/
├── 📄 PROJECT_OVERVIEW.md       ← START HERE! Complete guide
├── 📄 PROJECT_STRUCTURE.md      ← Detailed file-by-file guide (NEW!)
├── 📄 API_SPECIFICATION.md      ← Backend API specs
├── 📄 BACKEND_INTEGRATION_GUIDE.md  ← Backend developer guide
├── 📄 REFACTORING_SUMMARY.md    ← What we've refactored
│
├── src/
│   ├── 📄 README.md             ← Source code architecture
│   │
│   ├── components/
│   │   ├── 📄 README.md         ← Component creation guide
│   │   ├── common/              ← Shared components (3)
│   │   ├── home/                ← HomeScreen components (4)
│   │   └── plan/                ← PlanScreen components (4) (NEW!)
│   │       └── 📄 README.md     ← Plan components guide
│   │
│   ├── api/                     ← API layer (NEW!)
│   │   ├── planApi.ts           ← Plan/Todo API
│   │   └── onboardingApi.ts     ← Onboarding API
│   │
│   ├── services/                ← Data fetching layer
│   │   ├── 📄 README.md         ← Service layer guide
│   │   ├── homeService.ts       ← Home API (dummy → real API ready)
│   │   └── chatService.ts       ← Chat API (dummy → real API ready)
│   │
│   ├── types/                   ← TypeScript type definitions
│   │   ├── home.ts              ← Home data types
│   │   ├── chat.ts              ← Chat data types
│   │   ├── plan.ts              ← Plan/Todo data types (NEW!)
│   │   ├── onboarding.ts        ← Onboarding data types (NEW!)
│   │   └── navigation.ts        ← Navigation types
│   │
│   ├── constants/               ← Theme & design tokens
│   │   ├── theme.ts             ← Colors, typography, spacing
│   │   └── gradients.ts         ← Gradient configs
│   │
│   ├── screens/                 ← 13 screens (all refactored)
│   │   ├── onboarding/          ← 5 onboarding screens (NEW!)
│   │   │   └── 📄 README.md     ← Onboarding flow guide
│   │   └── PlanScreen.tsx       ← Todo/Checklist screen (NEW!)
│   │
│   └── navigation/              ← Navigation config
│
└── App.tsx                      ← Entry point
```

---

## 🎯 For AI Assistants

### What Makes This Project AI-Friendly

1. **Comprehensive Documentation**: 6,000+ lines of docs (including onboarding & plan guides)
2. **Clear Architecture**: Single Responsibility Principle everywhere
3. **Type Definitions**: All data structures documented
4. **JSDoc Comments**: Every component explained
5. **Consistent Patterns**: Easy to learn, easy to extend
6. **Detailed READMEs**: File-by-file explanations with UI mockups

### AI Development Workflow

```
1. Read PROJECT_OVERVIEW.md (understand structure)
2. Read PROJECT_STRUCTURE.md (detailed file guide)
3. Read src/README.md (understand code architecture)
4. Read src/components/README.md (learn component patterns)
5. Check feature-specific READMEs:
   - src/screens/onboarding/README.md (onboarding flow)
   - src/components/plan/README.md (plan components)
6. Check JSDoc comments in files (specific implementation details)
7. Start coding! (follow established patterns)
```

### Key Principles (Must Follow)

- ✅ Single Responsibility Principle
- ✅ No code duplication (DRY)
- ✅ Use theme system (no hardcoded values)
- ✅ Type everything (zero `any`)
- ✅ Write JSDoc comments
- ✅ Components < 400 lines

---

## 👨‍💻 For Frontend Developers

### Installation

```bash
cd FinKuRN
npm install
npx expo start
```

Press `w` for web, `i` for iOS, `a` for Android.

### Key Files to Read

1. **src/README.md** - Architecture overview
2. **src/components/README.md** - How to create components
3. **src/services/README.md** - How data fetching works
4. **REFACTORING_SUMMARY.md** - What's been refactored and why

### Development Commands

```bash
npm start              # Start Expo dev server
npm run web            # Start web only
npx tsc --noEmit       # Type check
npx expo start -c      # Clear cache
```

### Theme System Example

```tsx
import { theme } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
});
```

Never hardcode colors, spacing, or typography!

---

## 🔧 For Backend Developers

### Quick Start

1. **Read**: `BACKEND_INTEGRATION_GUIDE.md` (complete guide)
2. **Read**: `API_SPECIFICATION.md` (exact API specs)
3. **Check**: `src/types/home.ts` and `src/types/chat.ts` (data structures)
4. **Review**: `src/services/homeService.ts` (dummy data examples)

### API Endpoints to Implement

**Priority 1 (Required)**:
- `GET /api/home` - Home screen data
- `GET /api/chats` - Chat list
- `GET /api/chats/:chatId/messages` - Chat messages
- `POST /api/chats/:chatId/messages` - Send message

**Priority 2 (Optional)**:
- `GET /api/today-items`
- `GET /api/savings`
- `GET /api/spending`
- `POST /api/chats`
- `DELETE /api/chats/:chatId`

### Response Format Example

```json
// GET /api/home response (see API_SPECIFICATION.md for full spec)
{
  "greeting": {
    "userName": "은별",
    "greetingMessage": "좋은 아침이에요, 은별님",
    "motivationMessage": "오늘은 커피값만큼 절약 도전 어떨까요? 💙"
  },
  "todayItems": [...],
  "savings": {...},
  "spending": {...}
}
```

All response formats are in `API_SPECIFICATION.md` with curl examples!

### CORS Setup (Important!)

```javascript
app.use(cors({
  origin: [
    'http://localhost:19006',  // Expo web
    'http://localhost:8081',   // Metro bundler
  ],
  credentials: true,
}));
```

---

## 📚 Documentation Map

| File | Purpose | For Who |
|------|---------|---------|
| **PROJECT_OVERVIEW.md** | Complete project guide | Everyone (START HERE) |
| **PROJECT_STRUCTURE.md** | File-by-file detailed guide | Everyone (NEW!) |
| **README.md** | Quick start & overview | Everyone (you are here) |
| **API_SPECIFICATION.md** | Detailed API specs | Backend devs |
| **BACKEND_INTEGRATION_GUIDE.md** | Backend integration guide | Backend devs |
| **src/README.md** | Source code architecture | Frontend devs, AI |
| **src/components/README.md** | Component creation guide | Frontend devs, AI |
| **src/components/plan/README.md** | Plan components guide | Frontend devs, AI (NEW!) |
| **src/screens/onboarding/README.md** | Onboarding flow guide | Frontend devs, AI (NEW!) |
| **src/services/README.md** | Data layer guide | Frontend devs, AI |
| **REFACTORING_SUMMARY.md** | Refactoring history | Everyone (reference) |

---

## 🏗 Architecture Highlights

### Clean Separation of Concerns

```
UI Layer (Screens/Components)
    ↓
Service Layer (homeService, chatService)
    ↓
Backend API (to be implemented)
```

### Component Hierarchy

```
screens/
  ↓ uses
components/home/  (screen-specific)
  ↓ uses
components/common/ (shared across app)
```

### Type Safety

All data structures are TypeScript typed:
- No `any` types allowed
- All API responses have type definitions
- Navigation is type-safe

---

## 🎨 Design System

Centralized theme in `src/constants/theme.ts`:

**Colors**: `theme.colors.*`
- `primary`, `background`, `surface`
- `textPrimary`, `textSecondary`, `textTertiary`

**Typography**: `theme.typography.*`
- `heading1`, `heading2`, `heading3`, `heading4`
- `body1`, `body2`, `body3`, `caption`

**Spacing**: `theme.spacing.*`
- `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`

**Border Radius**: `theme.borderRadius.*`
- `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`, `full`

---

## 🧪 Current Status

### ✅ Completed (Latest Updates - 2025-01-15)

**Core Features**
- [x] 13 screens fully refactored (7 main + 5 onboarding + 1 plan)
- [x] **5-step onboarding flow** (Welcome → Goals → BasicInfo → Consent → Complete)
- [x] **Plan/Todo screen** with 4 reusable card components
- [x] Theme system implemented
- [x] Service layer with dummy data
- [x] Type definitions for all data

**Components**
- [x] HomeScreen component breakdown (818 → 384 lines)
- [x] Plan components (ProgressCard, TaskItemCard, UpcomingItemCard, GoalCard)
- [x] Onboarding screens with clean design (no emojis, penguin PNG mascot)
- [x] Back navigation on all onboarding screens

**Design**
- [x] ExploreScreen refined to match design 100%
- [x] Consistent borderRadius.xxxl (32px) across all cards
- [x] Letter-spacing applied for typography refinement
- [x] Zero hardcoded values

**Documentation**
- [x] Comprehensive documentation (6,000+ lines)
- [x] PROJECT_STRUCTURE.md (complete file guide)
- [x] src/screens/onboarding/README.md (onboarding flow)
- [x] src/components/plan/README.md (plan components)
- [x] Backend API specification
- [x] 100% JSDoc coverage

### 🔄 Ready for Backend Integration

Service layer is ready - backend just needs to implement APIs per spec.

Frontend changes needed when backend is ready:
```typescript
// src/services/homeService.ts
// Change this ONE line:
// return Promise.resolve(DUMMY_HOME_DATA);
const response = await fetch('https://api.example.com/api/home');
return response.json();
```

---

## 📊 Code Quality Metrics

- **Lines of code reduced**: 347 lines (via refactoring)
- **Code duplication**: Eliminated 200+ lines
- **Components**: 36 TypeScript files (13 screens + 11 components + 12 support files)
- **Documentation**: 6,000+ lines
- **Features**: Onboarding (5 screens), Plan (4 components), Home, Explore, Chat, Profile
- **TypeScript errors**: 0 (all resolved)
- **SRP violations**: 0
- **Hardcoded values**: 0

---

## 🤝 Team Collaboration

### Roles

- **Frontend**: React Native development, UI/UX
- **Backend**: API implementation, data management
- **Tools**: Claude Code for AI-assisted development

### Communication

All team members should:
1. Read `PROJECT_OVERVIEW.md` first
2. Follow their role-specific guide
3. Reference API specs for integration
4. Keep documentation updated

---

## 🚨 Important Notes

### For AI Assistants

- ⚠️ NEVER use emojis in code (only in markdown docs)
- ⚠️ ALWAYS follow Single Responsibility Principle
- ⚠️ ALWAYS use theme system (no hardcoded values)
- ⚠️ ALWAYS add JSDoc comments
- ⚠️ ALWAYS use TypeScript types (no `any`)

### For All Developers

- Read `PROJECT_OVERVIEW.md` before starting
- Follow established patterns
- Update docs when making changes
- Use type-safe navigation
- Clear Metro cache if things break: `npx expo start -c`

---

## 📞 Getting Help

1. **Architecture questions**: Check `src/README.md`
2. **Component questions**: Check `src/components/README.md`
3. **Backend integration**: Check `BACKEND_INTEGRATION_GUIDE.md`
4. **API specs**: Check `API_SPECIFICATION.md`
5. **Still stuck**: Check the specific file's JSDoc comments

---

## 🎉 Quick Win

Want to see the app running in 2 minutes?

```bash
cd FinKuRN
npm install
npx expo start --web
```

Then press `w` for web browser. Done!

---

## 📝 License

Copyright 2025. All rights reserved.

---

## 🎯 Next Steps

### For New AI Assistant

1. Read `PROJECT_OVERVIEW.md` (5 min)
2. Read `PROJECT_STRUCTURE.md` (8 min) - NEW! File-by-file guide
3. Read `src/README.md` (5 min)
4. Read `src/components/README.md` (5 min)
5. Check feature-specific READMEs as needed:
   - `src/screens/onboarding/README.md` (onboarding)
   - `src/components/plan/README.md` (plan/todo)
6. Check component JSDoc comments (2 min)
7. Start coding! You now understand the entire project.

### For Backend Developer

1. Read `BACKEND_INTEGRATION_GUIDE.md`
2. Read `API_SPECIFICATION.md`
3. Check `src/services/homeService.ts` for dummy data
4. Implement APIs
5. Give frontend team the API URL

### For Frontend Developer

1. Read `src/README.md`
2. Read `src/components/README.md`
3. Start building features using existing patterns

---

**Ready to dive in? → Start with PROJECT_OVERVIEW.md**
