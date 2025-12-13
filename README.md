# 빛의 연인 (Lovers in the Light)

> 컬트를 파헤치러 갔다가 역으로 포섭당할 뻔한 심리 스릴러 비주얼 노벨

## 📖 소개

**빛의 연인**은 서로를 속이는 두 사람의 위험한 게임을 그린 인터랙티브 비주얼 노벨입니다.

### 스토리
- **지우**: 사이비 종교 "루미너스 서클"을 파헤치기 위해 접근한 여성
- **서준**: 지우를 포섭하려는 컬트 멤버

두 사람은 각자의 목적을 가지고 상대를 속이며 접근합니다.
노션으로 작전을 세우는 지우와 엑셀로 포섭 대상을 관리하는 서준.
과연 누가 누구를 속이고 있을까요?

### 게임 특징
- 🎭 **이중 심리전**: 서로를 속이는 두 관점의 이야기
- 💡 **3가지 게이지 시스템**: 호감도, 의심도, 역의심도
- 🔀 **4가지 엔딩**: 플레이어의 선택에 따라 달라지는 결말
- 📊 **독특한 UI**: Notion, Excel 스타일의 메타 UI
- 🎨 **세련된 비주얼**: 세미 리얼리스틱 애니메이션 스타일

## 🎮 게임플레이

### 게이지 시스템
- **💚 호감도**: 서준이 지우에게 느끼는 호감
- **⚠️ 의심도**: 서준이 지우를 의심하는 정도 (60 이상 시 즉시 D엔딩)
- **🔍 역의심도**: 지우가 서준을 의심하는 정도 (플레이어 참고용)

### 엔딩 조건
| 엔딩 | 조건 | 설명 | 등급 |
|------|------|------|------|
| **A엔딩 - 역관광** | 호감도 75+, 의심도 35 이하 | 지우의 완벽한 승리 | S |
| **B엔딩 - 프로의 벽** | 나머지 | 지우의 패배 | C |
| **C엔딩 - 병맛 로맨스** | 호감도 50+, 의심도 20-45 | 서로 정체를 알면서 관계 지속 | A |
| **D엔딩 - 들통** | 의심도 60 이상 | 게임 오버 | F |

## 🛠 기술 스택

- **Frontend**: React 18.3 + Vite 6.0
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Language**: JavaScript (JSX)

## 📦 설치 및 실행

### 필요 조건
- Node.js 18+
- pnpm (권장) 또는 npm

### 설치
```bash
cd luminous-game
pnpm install
```

### 개발 서버 실행
```bash
pnpm dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드
```bash
pnpm build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 📁 프로젝트 구조

```
luminous-game/
├── public/
│   ├── images/
│   │   ├── backgrounds/     # 배경 이미지 (5개)
│   │   ├── characters/      # 캐릭터 초상화 (14개)
│   │   └── endings/         # 엔딩 CG (4개)
│   └── favicon.svg
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── GameContainer.jsx
│   │   ├── DialogueBox.jsx
│   │   ├── ChoiceButtons.jsx
│   │   ├── CharacterPortrait.jsx
│   │   ├── SplitScreenDialogue.jsx
│   │   ├── NotionUI.jsx
│   │   ├── ExcelUI.jsx
│   │   ├── InferencePhase.jsx
│   │   ├── TitleScreen.jsx
│   │   ├── EndingScreen.jsx
│   │   └── InGameMenu.jsx
│   ├── data/                # 씬 스크립트 (JSON)
│   │   ├── scene1.json ~ scene8.json
│   │   ├── scene9_a/b/c.json
│   │   ├── scene10_a/b/c.json
│   │   └── scene11_a/b/c.json
│   ├── store/               # Zustand 스토어
│   │   ├── gameStore.js     # 게임 상태
│   │   └── scriptStore.js   # 스크립트 상태
│   ├── hooks/               # Custom Hooks
│   │   └── useTypingEffect.js
│   └── styles/              # 스타일
└── index.html
```

## 🎭 씬 구조

### 공통 루트 (Scene 1-8)
1. **Scene 1**: 준비 과정 (오프닝)
2. **Scene 2**: 카페 첫 대화
3. **Scene 3**: 인스타그램 DM
4. **Scene 4**: 한강 데이트
5. **Scene 5**: 두 번째 카페 만남
6. **Scene 6**: 루미너스 서클 첫 참석
7. **Scene 7**: 개인 상담
8. **Scene 8**: 특별 프로그램 (첫 분기점)

### 분기 루트 (Scene 9-11)
#### Scene 8 분기 조건
- **A루트** (9_a → 10_a → 11_a): 호감도 ≥50 AND 의심도 ≤20
- **B루트** (9_b → 10_b → 11_b): 호감도 <50 OR 의심도 >35
- **C루트** (9_c → 10_c → 11_c): 호감도 ≥50 AND 의심도 21-35

## ✨ 주요 기능

### 대화 시스템
- **일반 대화**: 캐릭터 초상화 + 대화창
- **내면독백**: 보라색 스타일 (💭)
- **나레이션**: 중앙 정렬 회색 텍스트
- **스플릿 스크린**: 겉모습 vs 속마음

### 선택지 시스템
- 각 선택지마다 호감도, 의심도, 역의심도 변화
- 일관성 추적 (직업, 가족관계, 취미)
- 거짓말 탐지 시스템

### 추론 페이즈
- 시간 제한 있는 특수 선택지
- 이전 선택과의 일관성 체크
- 모순 시 큰 의심도 페널티 (10-50)

### 특수 UI
- **Notion UI**: 작전 프로젝트 체크리스트
- **Excel UI**: 포섭 대상 관리 스프레드시트
- 각 캐릭터의 메타적 시점 표현

### 세이브/로드
- 3개 슬롯
- 씬, 게이지, 선택 이력 완벽 저장
- 타임스탬프 표시

### 인게임 메뉴
- 세이브/로드
- 타이틀로 돌아가기
- 게이지 확인

## 🎨 씬 JSON 구조

```json
{
  "sceneId": "scene_id",
  "title": "씬 제목",
  "background": "room",
  "bgm": "daily",
  "dialogues": [
    {
      "id": "d1",
      "type": "dialogue",
      "character": "지우",
      "expression": "smile",
      "text": "대사 내용"
    },
    {
      "id": "choice1",
      "type": "choice",
      "choices": [
        {
          "id": "c1_1",
          "text": "선택지 1",
          "affection": 10,
          "suspicion": 5,
          "reverseSuspicion": 3,
          "nextDialogue": "d2"
        }
      ]
    },
    {
      "id": "split1",
      "type": "split_screen",
      "left": {
        "character": "지우",
        "expression": "smile",
        "text": "겉모습 대사"
      },
      "right": {
        "type": "inner",
        "text": "속마음"
      }
    }
  ]
}
```

### 대화 타입
- `dialogue`: 일반 대화
- `inner_monologue`: 내면독백
- `narration`: 나레이션
- `system`: 시스템 메시지 (자동 스킵)
- `choice`: 선택지
- `split_screen`: 화면 분할 (겉모습/속마음)
- `ui_notion`: 노션 UI
- `ui_excel`: 엑셀 UI
- `inference`: 추론 페이즈 (시간 제한)
- `scene_transition`: 씬 전환
- `scene_end`: 씬 종료 (다음 씬으로)

## 🎯 개발 팁

### 새 씬 추가하기
1. `src/data/` 폴더에 `sceneX.json` 생성
2. `src/App.jsx`의 `sceneMap`에 import 및 등록
3. 분기 로직 추가 (필요시 `handleSceneTransition` 수정)

### 캐릭터 표정
- **지우**: smile, normal, curious, serious, surprised, shy, worried
- **서준**: smile, normal, serious, cold, confused
- **리더**: normal
- **멤버1, 멤버2**: normal

### 배경
- `room`: 방
- `cafe`: 카페
- `park`: 한강 공원
- `cult`: 컬트 모임 장소
- `street`: 거리

## 🐛 알려진 이슈

- 캐릭터 이미지 배경이 투명하지 않음 (흰색 박스)
- BGM/SFX 시스템 미구현
- 자동 진행 기능 미구현
- 스킵 기능 미구현

## 🔮 향후 계획

- [ ] 캐릭터 이미지 배경 투명화 처리
- [ ] BGM 및 효과음 추가
- [ ] 자동 진행/스킵 기능
- [ ] 갤러리 모드
- [ ] 업적 시스템
- [ ] CG 감상 모드
- [ ] 다국어 지원 (영어)

## 📝 개발 로그

- **2025-12-13**: 프로젝트 시작, 기본 시스템 구현
- **2025-12-14**:
  - 전체 씬 스크립트 완성 (scene1-11_a/b/c)
  - AI 이미지 생성 및 적용
  - 엔딩 조건 밸런싱
  - 메타 태그 및 파비콘 추가

## 📄 라이선스

개인 프로젝트 - 모든 권리 보유

## 👥 제작

- **기획/스토리**: Luminous Team
- **프로그래밍**: React + Zustand + Framer Motion
- **아트**: AI Generated (Semi-realistic anime style)
- **UI/UX**: Custom Design

---

**Built with ❤️ using React**

**현재 버전**: 1.0.0
