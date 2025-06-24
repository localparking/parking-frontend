### 개발 표준 정의서

- prettier, eslint로 정의해 commit 시 자동 검증하도록 함.
- .prettierrc
- .eslintrc.js


# ✅ Boolean Naming Convention Guide

## 📌 기본 원칙

1. **상태를 나타내는 boolean 변수는 과거분사(past participle)를 사용한다.**
    - 예: `liked`, `selected`, `subscribed`, `verified`, `muted`, `blocked`

2. **동작 가능 여부나 조건 여부를 표현할 때는 `can`, `has`, `should` 등 동사형 prefix를 붙인다.**
    - 예: `canEdit`, `hasAccess`, `shouldUpdate`

3. **의미가 애매하거나 명확하지 않을 경우에만 `is` prefix를 허용한다.**
    - 예외적 사용 예: `isAvailable`, `isEmpty`, `isOpen`

---

## ✅ 올바른 예시

| 의미          | 네이밍 추천              |
|-------------|---------------------|
| 좋아요 눌렀는가    | `liked`             |
| 선택되었는가      | `selected`          |
| 구독되었는가      | `subscribed`        |
| 인증되었는가      | `verified`          |
| 편집 가능 여부    | `canEdit`           |
| 접근 권한 여부    | `hasAccess`         |
| 업데이트 필요 여부  | `shouldUpdate`      |
| 리스트가 비어 있는가 | `isEmpty` *(예외 허용)* |

---

## 🚫 피해야 할 예시

| 잘못된 예         | 이유                                      |
|------------------|-------------------------------------------|
| `isLiked`        | 과거분사 `liked`만으로 충분함             |
| `isSelected`     | `selected`로 상태를 충분히 표현 가능       |
| `isSubscribed`   | redundant 표현                             |
| `isVerified`     | 상태 표현에 굳이 `is` 불필요               |

---

## 💡 일관된 네이밍 예시

```ts
// 사용자 상태
const blocked = true;
const muted = false;
const verified = true;

// 권한 여부
const canComment = true;
const hasPermission = false;
const shouldReload = true;

// UI 상태
const selected = false;
const expanded = true;
