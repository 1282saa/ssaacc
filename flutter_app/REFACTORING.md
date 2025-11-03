# 코드 리팩토링 문서

## 개요
본 문서는 Flutter 금융 관리 앱의 코드 구조 개선을 위한 리팩토링 내역을 설명합니다.

## 리팩토링 목표
1. **단일 책임 원칙(SRP)** 준수
2. **중복 코드 제거** (DRY 원칙)
3. **파일/폴더 체계적 관리**
4. **데이터와 UI 분리**
5. **유지보수성 향상**

## 주요 변경사항

### 1. 데이터 모델 생성 (models/)
하드코딩된 데이터를 구조화된 모델로 분리

**생성된 파일:**
- `models/user.dart` - 사용자 정보 모델
- `models/savings_item.dart` - 저축 항목 모델 (진행률 계산 로직 포함)
- `models/spending_data.dart` - 소비 데이터 모델
- `models/task_item.dart` - 할 일 항목 모델 (D-Day 계산 포함)

**장점:**
- 데이터 구조 명확화
- 타입 안전성 확보
- 비즈니스 로직을 모델에 캡슐화

### 2. 상수 관리 강화 (constants/)
매직 넘버와 하드코딩된 문자열 제거

**생성된 파일:**
- `constants/dimensions.dart` - 크기, 간격, 반경 등 수치 상수
- `constants/app_strings.dart` - 앱 전체에서 사용되는 문자열 상수

**개선 전:**
```dart
BorderRadius.circular(32)  // 여러 곳에 중복
Text('좋아요 은별님!')      // 하드코딩
```

**개선 후:**
```dart
BorderRadius.circular(AppDimensions.borderRadiusXLarge)
Text(AppStrings.congratulations)
```

### 3. 공통 UI 컴포넌트 추출 (widgets/common/)
중복된 UI 패턴을 재사용 가능한 컴포넌트로 분리

**생성된 파일:**
- `widgets/common/app_card.dart` - 공통 카드 컴포넌트
- `widgets/common/app_button.dart` - 공통 버튼 컴포넌트 (원형/둥근 모서리)
- `widgets/common/progress_bar.dart` - 진행 바 (선형/원형)
- `widgets/common/chart_bar.dart` - 차트 막대 컴포넌트

**사용 예시:**
```dart
// Before: 10줄 이상의 중복 코드
Container(
  decoration: BoxDecoration(
    color: AppColors.white,
    borderRadius: BorderRadius.circular(32),
    boxShadow: [...],
  ),
  child: ...
)

// After: 재사용 가능한 컴포넌트
AppCard(
  child: ...,
)
```

### 4. 유틸리티 함수 추가 (utils/)
포맷팅 및 검증 로직 중앙화

**생성된 파일:**
- `utils/formatters.dart` - 금액, 날짜, 퍼센트 포맷팅 함수
- `utils/validators.dart` - 데이터 검증 함수

**주요 함수:**
```dart
// 금액 포맷팅
AppFormatters.formatCurrency(1234567) // "1,234,567원"

// 퍼센트 포맷팅
AppFormatters.formatPercentage(0.72) // "72%"

// D-Day 포맷팅
AppFormatters.formatDDay(2) // "D-2"
```

### 5. 상태 관리 도입 (providers/)
Provider 패턴으로 전역 상태 관리

**생성된 파일:**
- `providers/user_provider.dart` - 사용자 상태 관리
- `providers/finance_provider.dart` - 금융 데이터 상태 관리

**주요 기능:**
- 저축 항목 CRUD
- 소비 데이터 필터링
- 할 일 관리
- 실시간 UI 업데이트 (notifyListeners)

**사용 예시:**
```dart
// 데이터 읽기
final userName = context.watch<UserProvider>().userName;
final savingsItems = context.watch<FinanceProvider>().savingsItems;

// 데이터 수정
context.read<FinanceProvider>().addSavingsItem(newItem);
```

## 새로운 폴더 구조

```
lib/
├── constants/
│   ├── colors.dart              (기존)
│   ├── text_styles.dart         (기존)
│   ├── dimensions.dart          (신규) ✨
│   └── app_strings.dart         (신규) ✨
├── models/                       (신규) ✨
│   ├── user.dart
│   ├── savings_item.dart
│   ├── spending_data.dart
│   └── task_item.dart
├── providers/                    (신규) ✨
│   ├── user_provider.dart
│   └── finance_provider.dart
├── utils/                        (신규) ✨
│   ├── formatters.dart
│   └── validators.dart
├── widgets/
│   ├── common/                   (신규) ✨
│   │   ├── app_card.dart
│   │   ├── app_button.dart
│   │   ├── progress_bar.dart
│   │   └── chart_bar.dart
│   ├── greeting_section.dart
│   ├── today_card.dart
│   ├── policy_cards.dart
│   └── ... (기타 위젯들)
├── screens/
│   ├── home_screen.dart
│   └── savings_detail_screen.dart
└── main.dart                     (수정) ✨
```

## 개선 효과

### 코드 품질
- ✅ **단일 책임 원칙** 준수: 각 클래스가 명확한 역할 수행
- ✅ **중복 코드 제거**: 공통 컴포넌트 재사용으로 코드량 감소
- ✅ **가독성 향상**: 의미 있는 상수명과 함수명 사용

### 유지보수성
- ✅ **수정 용이**: 한 곳만 수정하면 전체 반영
- ✅ **확장 가능**: 새로운 기능 추가 시 기존 구조 활용
- ✅ **테스트 용이**: 모델과 로직이 분리되어 단위 테스트 가능

### 개발 생산성
- ✅ **재사용성**: 공통 컴포넌트로 빠른 개발
- ✅ **일관성**: 통일된 스타일과 패턴
- ✅ **협업 효율**: 명확한 구조로 팀원 간 이해도 향상

## 다음 단계 (향후 개선 사항)

### 1. 기존 위젯 리팩토링
기존 위젯들을 새로운 구조에 맞게 수정:
- `today_card.dart` → Provider와 모델 사용
- `savings_section.dart` → 공통 컴포넌트 활용
- `spending_section.dart` → 하드코딩 제거

### 2. 폴더 구조 재조직
위젯을 기능별로 그룹화:
```
widgets/
├── common/
├── home/
│   ├── greeting/
│   ├── today/
│   ├── policy/
│   ├── savings/
│   └── spending/
```

### 3. 서비스 레이어 추가
실제 API 연동을 위한 서비스 계층:
- `services/api_service.dart`
- `services/local_storage_service.dart`
- `repositories/finance_repository.dart`

### 4. 에러 핸들링
- 전역 에러 핸들러
- 로딩 상태 관리
- 에러 메시지 표시

## 마이그레이션 가이드

기존 위젯을 새 구조로 마이그레이션하는 방법:

### Step 1: Provider 사용
```dart
// Before
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Text('은별');
  }
}

// After
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final userName = context.watch<UserProvider>().userName;
    return Text(userName);
  }
}
```

### Step 2: 공통 컴포넌트 사용
```dart
// Before
Container(
  decoration: BoxDecoration(
    color: AppColors.white,
    borderRadius: BorderRadius.circular(32),
    boxShadow: [...],
  ),
  child: Text('내용'),
)

// After
AppCard(
  child: Text('내용'),
)
```

### Step 3: 포맷터 사용
```dart
// Before
Text('${amount.toStringAsFixed(0)}원')

// After
Text(AppFormatters.formatCurrency(amount))
```

## 참고 자료

- [Flutter Provider 공식 문서](https://pub.dev/packages/provider)
- [Clean Architecture in Flutter](https://resocoder.com/flutter-clean-architecture-tdd/)
- [SOLID 원칙](https://en.wikipedia.org/wiki/SOLID)
