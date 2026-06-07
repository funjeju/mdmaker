# 08_UX_EDGE_CASES_AND_OUTPUT_SPEC.md

## Purpose

본 문서는 기존 MD 파일 및 HTML 프로토타입을 보완하는 추가 명세서다.

다음 6가지 영역을 정의한다.

1. 화면별 엣지 케이스 및 예외 처리
2. 최종 산출물(MD 파일) 구조 및 템플릿
3. 모바일 대응 정책
4. AI API 프롬프트 명세
5. 상태 관리 및 데이터 흐름
6. 로그인 및 저장 시스템

---

## Dependencies

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 02_PRODUCT_GRAPH_ENGINE.md
- 03_DOCUMENT_GENERATION_ENGINE.md
- 04_DESIGN_SYSTEM_ENGINE.md
- 05_DEV_EXECUTION_ENGINE.md
- 06_IMPLEMENTATION_ROADMAP.md
- 07_OPERATION_AND_EVOLUTION_ENGINE.md
- specforge_v2_project_definition.html

---

# PART 1. 화면별 엣지 케이스 및 예외 처리

---

## Step 1. Readiness Check

### 정상 플로우
사용자가 개발 경험, 툴 보유 여부, 서비스 상태를 선택하고 다음으로 진행한다.

### 엣지 케이스

#### EC-01. 아무것도 선택하지 않고 다음 버튼 클릭
```
처리: 다음 버튼 비활성화 상태 유지
조건: 개발 경험 수준 최소 1개 선택 필수
안내: "개발 경험 수준을 선택해주세요" 인라인 메시지 표시
```

#### EC-02. Node.js 미설치 선택
```
처리: 상단 또는 해당 항목 옆에 설치 안내 배너 표시
버튼: "Node.js 다운로드" → https://nodejs.org 새 탭 이동
흐름 차단 여부: 차단하지 않음. 안내 후 계속 진행 가능
```

#### EC-03. Git 미설치 선택
```
처리: 설치 안내 배너 표시
버튼: "Git 다운로드" → https://git-scm.com 새 탭 이동
흐름 차단 여부: 차단하지 않음. 안내 후 계속 진행 가능
```

#### EC-04. VSCode 미설치 선택
```
처리: 설치 안내 배너 표시
버튼: "VSCode 다운로드" → https://code.visualstudio.com 새 탭 이동
흐름 차단 여부: 차단하지 않음. 안내 후 계속 진행 가능
```

#### EC-05. 모든 툴이 미설치 상태
```
처리: "개발환경 먼저 구축을 권장합니다" 안내 카드 표시
추천 Route: Route A (신규 프로젝트 + 개발환경 세팅 우선) 자동 추천
흐름 차단 여부: 차단하지 않음
```

#### EC-06. 뒤로 가기 (브라우저 뒤로가기 또는 이전 버튼)
```
처리: 이전 단계로 이동, 기존 선택값 유지
상태 보존: Step 1 선택값은 Step 4 완료 전까지 세션에 보존
```

---

## Step 2. 순서 선택 및 기술 스택 선택

### 정상 플로우
사용자가 "기획 먼저" 또는 "개발환경 먼저"를 선택하고, 기술 스택을 선택한다.

### 엣지 케이스

#### EC-07. 순서 미선택 상태에서 다음 클릭
```
처리: 다음 버튼 비활성화
조건: 순서 카드 1개 선택 필수
기본값: "기획(PRD) 먼저" 기본 선택 상태로 진입
```

#### EC-08. 기술 스택 미선택
```
처리: "잘 모름 / 스킵" 옵션이 기본 선택됨
결과: Next.js + Firebase 기준으로 산출물 생성
안내: "선택하지 않으면 Next.js + Firebase 기준으로 생성됩니다" 툴팁 표시
```

#### EC-09. 뒤로 가기
```
처리: Step 1로 이동, 기존 선택값 유지
```

---

## Step 3. 아이디어 입력 및 PMF 평가

### 정상 플로우
사용자가 아이디어를 입력하면 AI가 PMF 점수를 산출하고 Feature를 추출한다.

### 엣지 케이스

#### EC-10. 아이디어 입력란 공백 제출
```
처리: 제출 버튼 비활성화
조건: 최소 20자 이상 입력 필수
안내: "아이디어를 조금 더 구체적으로 입력해주세요 (최소 20자)" 인라인 메시지
```

#### EC-11. 아이디어가 너무 짧거나 모호한 경우 (20자 이상이지만 내용 부족)
```
처리: AI가 PMF 평가 진행 후 낮은 점수(0~30점)와 함께 보완 요청 메시지 반환
안내 예시: "아이디어가 조금 더 구체적이면 더 정확한 평가가 가능합니다.
           어떤 문제를 해결하는지, 누구를 위한 서비스인지 추가해보세요."
행동: 재입력 버튼 제공, 그대로 진행 버튼도 제공 (강제 차단 없음)
```

#### EC-12. PMF 점수 범위별 처리
```
0 ~ 30점:
  색상: Red (#EF4444)
  메시지: "아이디어 검증이 더 필요합니다. 문제 정의를 보완해보세요."
  행동: 재입력 권유, 그래도 진행 가능

31 ~ 60점:
  색상: Yellow (#F59E0B)
  메시지: "가능성 있는 아이디어입니다. 타겟 사용자를 더 구체화하면 좋습니다."
  행동: 바로 다음 진행 가능

61 ~ 80점:
  색상: Blue (#3B82F6)
  메시지: "좋은 아이디어입니다. Feature 추출을 시작합니다."
  행동: 자동으로 Feature 추출 진행

81 ~ 100점:
  색상: Green (#22C55E)
  메시지: "강력한 PMF 신호입니다. 바로 개발을 시작하세요."
  행동: 자동으로 Feature 추출 진행
```

#### EC-13. AI API 응답 지연 (3초 이상)
```
처리: 로딩 스피너 + "AI가 아이디어를 분석하고 있습니다..." 메시지 표시
타임아웃: 30초 초과 시 에러 처리
```

#### EC-14. AI API 에러 (네트워크 오류, 서버 오류 등)
```
처리: "분석 중 오류가 발생했습니다. 다시 시도해주세요." 메시지 표시
버튼: "다시 시도" 버튼 제공
데이터 보존: 입력한 아이디어 텍스트 유지
```

#### EC-15. 뒤로 가기
```
처리: Step 2로 이동, 아이디어 입력 내용 유지
PMF 결과: 초기화
```

---

## Step 4. 산출물 생성 및 환경 세팅

### 정상 플로우
Tab 1~4를 순서대로 진행하며 터미널 명령어, 폴더 구조, Firebase, Vercel, 최종 MD 다운로드를 완료한다.

### 엣지 케이스

#### EC-16. 탭 순서 건너뛰기
```
처리: 모든 탭 자유롭게 이동 가능
강제 순서 없음: 사용자가 원하는 탭으로 바로 이동 가능
단, 최종 다운로드 버튼은 항상 활성화 상태 유지
```

#### EC-17. 터미널 명령어 복사 실패
```
처리: "복사에 실패했습니다. 직접 선택 후 복사해주세요." 안내
대안: 텍스트 전체 선택 버튼 제공
```

#### EC-18. Firebase 콘솔 링크 이동 후 돌아왔을 때
```
처리: 해당 Firebase 항목에 "완료" 체크 버튼 수동 클릭 제공
상태: 클릭 시 해당 행 완료 표시 (녹색)
자동 감지: 불가. 수동 확인 방식
```

#### EC-19. MD 파일 다운로드 실패
```
처리: "다운로드에 실패했습니다." 메시지
대안: "전체 내용 복사하기" 버튼 제공
```

#### EC-20. 처음부터 다시 시작
```
처리: 모든 상태 초기화
위치: Step 4 하단 "처음부터 다시 시작" 버튼 제공
확인 모달: "모든 입력 내용이 초기화됩니다. 계속하시겠습니까?" 확인 후 진행
```

---

# PART 2. 최종 산출물 MD 파일 구조 및 템플릿

---

## 산출물 목록

아이디어 입력 및 PMF 평가 완료 후 자동 생성되는 파일 목록이다.

```
[프로젝트명]/
├── CLAUDE.md
├── .cursorrules
├── .env.example
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── PMF_ANALYSIS.md
│   ├── FEATURE_LIST.md
│   └── features/
│       └── [기능명]/
│           ├── PRD.md
│           ├── USER_FLOW.md
│           ├── API_SPEC.md
│           └── DB_SCHEMA.md
└── setup.sh
```

---

## 템플릿 1. CLAUDE.md

```markdown
# CLAUDE.md

## 프로젝트 개요
[AI가 생성한 프로젝트 한줄 설명]

## 기술 스택
- Frontend: [선택한 스택]
- Backend: [선택한 스택]
- Database: [선택한 스택]
- AI Tool: Claude Code

## 핵심 기능 목록
[AI가 추출한 Feature 목록]

## 코딩 규칙
- 모든 컴포넌트는 Feature 단위로 폴더 분리
- TypeScript 사용 필수
- 함수형 컴포넌트 사용
- 에러 처리 필수

## 현재 작업
[생성 시점 기준 첫 번째 Feature 구현]

## 금지 사항
- Graph 미등록 기능 구현 금지
- 테스트 없는 핵심 기능 배포 금지
- 환경변수 직접 하드코딩 금지
```

---

## 템플릿 2. .cursorrules

```
# Cursor Rules — [프로젝트명]

## 개발 원칙
- Feature 단위로 개발한다
- Product Graph를 기준으로 모든 변경을 진행한다
- 변경 시 영향받는 문서를 함께 업데이트한다

## 폴더 구조
[선택한 스택 기반 자동 생성]

## 코딩 표준
- 언어: TypeScript
- 스타일: Tailwind CSS
- 상태관리: [스택 기반]
- API: REST

## 문서 표준
- 모든 기능은 docs/features/ 하위에 문서화
- API 변경 시 API_SPEC.md 동기화 필수
- DB 변경 시 DB_SCHEMA.md 동기화 필수

## 배포 규칙
- main 브랜치 직접 푸시 금지
- 테스트 통과 후 머지
- 환경변수 .env.example 항상 최신 상태 유지
```

---

## 템플릿 3. PROJECT_OVERVIEW.md

```markdown
# PROJECT_OVERVIEW.md

## 프로젝트명
[AI가 생성]

## 한줄 설명
[AI가 생성]

## 문제 정의
[PMF 분석 기반 AI 생성]

## 타겟 사용자
[PMF 분석 기반 AI 생성]

## 핵심 가치 제안
[PMF 분석 기반 AI 생성]

## 기술 스택
[선택값 기반]

## 핵심 기능
[Feature 추출 결과]

## 성공 지표
[PMF 분석 기반 AI 생성]
```

---

## 템플릿 4. PMF_ANALYSIS.md

```markdown
# PMF_ANALYSIS.md

## PMF 점수
[0~100점]

## 평가 항목별 점수

| 항목 | 점수 | 평가 |
|------|------|------|
| 문제 명확성 | /20 | [AI 평가] |
| 타겟 명확성 | /20 | [AI 평가] |
| 솔루션 차별성 | /20 | [AI 평가] |
| 시장 크기 | /20 | [AI 평가] |
| 타이밍 | /20 | [AI 평가] |

## 종합 의견
[AI 생성]

## 보완 필요 사항
[AI 생성]

## 다음 검증 단계 제안
[AI 생성]
```

---

## 템플릿 5. PRD.md (Feature별)

```markdown
# PRD — [기능명]

## 개요
[AI 생성]

## 해결하는 문제
[AI 생성]

## 타겟 사용자
[AI 생성]

## 사용자 스토리
- As a [사용자], I want to [행동], So that [목적]

## 성공 지표
[AI 생성]

## 제약 조건
[AI 생성]

## 완료 조건
- [ ] [조건 1]
- [ ] [조건 2]
- [ ] [조건 3]
```

---

## 템플릿 6. setup.sh

```bash
#!/bin/bash
# SpecForge — 자동 생성 프로젝트 세팅 스크립트
# 프로젝트명: [프로젝트명]
# 생성일: [날짜]

echo "🚀 프로젝트 세팅을 시작합니다..."

# 1. 폴더 구조 생성
mkdir -p [프로젝트명]
cd [프로젝트명]
mkdir -p docs/features
mkdir -p app components features services lib hooks styles tests

# 2. 기본 파일 생성
touch .env.local .env.example .cursorrules CLAUDE.md README.md

# 3. Git 초기화
git init
git add .
git commit -m "feat: init project via SpecForge"

echo "✅ 세팅 완료! VS Code를 열겠습니다."
code .
```

---

# PART 3. 모바일 대응 정책

---

## 기본 방침

SpecForge V2는 데스크탑 우선(Desktop First)으로 설계한다.

단, 모바일에서 접속했을 때 완전히 깨지지 않도록 반응형 기본 대응을 적용한다.

---

## 브레이크포인트

```css
Desktop:  1024px 이상 — 풀 기능 제공
Tablet:   768px ~ 1023px — 2열 → 1열 전환
Mobile:   767px 이하 — 1열, 간소화 레이아웃
```

---

## 모바일 레이아웃 처리 규칙

### Step 1. Readiness Check
```
Desktop: 툴 선택 항목 2열 그리드
Mobile:  1열 세로 스택
버튼 크기: 모바일에서 최소 44px 높이 유지 (터치 타겟)
```

### Step 2. 순서 선택
```
Desktop: 2열 카드 (기획 먼저 / 개발환경 먼저)
Mobile:  1열 세로 스택
스택 선택: 모바일에서 2열 유지 (4개 카드 → 2x2 그리드)
```

### Step 3. 아이디어 입력
```
Desktop: 넓은 텍스트 영역 + 우측 PMF 결과 패널
Mobile:  텍스트 영역 전체 너비, PMF 결과는 하단에 표시
```

### Step 4. 산출물
```
Desktop: 탭 수평 나열 + 콘텐츠 영역
Mobile:  탭 스크롤 가능 수평 나열 유지, 콘텐츠 1열
터미널 블록: 가로 스크롤 허용
폴더 구조: 가로 스크롤 허용
다운로드 버튼: 전체 너비 버튼
```

---

## 모바일 비지원 기능

```
Product Knowledge Graph 시각화 (노드-엣지 인터랙티브 그래프):
→ 모바일에서는 텍스트 목록 형태로 대체 표시
→ "그래프 시각화는 데스크탑에서 확인하세요" 안내 표시
```

---

## 모바일 대응 우선순위

```
P0 (필수):
- 레이아웃 깨짐 없음
- 버튼 터치 가능
- 텍스트 입력 가능
- 다운로드 버튼 동작

P1 (권장):
- 탭 스와이프 지원
- 터미널 블록 가로 스크롤

P2 (선택):
- 모바일 최적화 폰트 크기
- 그래프 모바일 대체 UI
```

---

# PART 4. AI API 프롬프트 명세

---

## 기본 원칙

모든 AI 호출은 Anthropic Claude API (claude-sonnet-4-20250514)를 사용한다.

각 호출은 독립적으로 동작하며, 이전 단계 결과를 컨텍스트로 전달한다.

---

## API Call 1. PMF 평가

### 목적
사용자가 입력한 아이디어를 5개 항목으로 평가하고 총점을 산출한다.

### System Prompt
```
당신은 스타트업 PMF(Product-Market Fit) 전문 분석가입니다.
사용자가 입력한 아이디어를 다음 5개 항목으로 평가하고 반드시 JSON 형식으로만 응답하세요.
마크다운 코드블록, 설명 텍스트 없이 순수 JSON만 반환하세요.

평가 항목:
1. 문제 명확성 (0~20점): 해결하려는 문제가 실재하고 명확한가
2. 타겟 명확성 (0~20점): 누구를 위한 서비스인지 명확한가
3. 솔루션 차별성 (0~20점): 기존 솔루션 대비 차별점이 있는가
4. 시장 크기 (0~20점): 충분한 시장 수요가 존재하는가
5. 타이밍 (0~20점): 지금 이 시점에 만들어야 하는 이유가 있는가

응답 형식:
{
  "total_score": 0,
  "scores": {
    "problem_clarity": { "score": 0, "reason": "" },
    "target_clarity": { "score": 0, "reason": "" },
    "solution_differentiation": { "score": 0, "reason": "" },
    "market_size": { "score": 0, "reason": "" },
    "timing": { "score": 0, "reason": "" }
  },
  "summary": "",
  "improvements": [],
  "next_steps": []
}
```

### User Prompt 구조
```
다음 아이디어를 PMF 기준으로 평가해주세요:

[사용자 입력 아이디어]
```

---

## API Call 2. Feature 추출

### 목적
PMF 분석 결과와 아이디어를 기반으로 핵심 Feature 목록을 추출한다.

### System Prompt
```
당신은 프로덕트 매니저입니다.
주어진 아이디어와 PMF 분석을 바탕으로 필요한 기능(Feature) 목록을 추출하세요.
반드시 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 반환하세요.

Feature 분류 기준:
- core: 서비스의 핵심 기능. 없으면 서비스가 동작하지 않음
- supporting: 핵심 기능을 보조하는 기능
- operational: 운영 및 관리 기능

응답 형식:
{
  "project_name": "",
  "project_summary": "",
  "features": [
    {
      "feature_id": "F001",
      "feature_name": "",
      "feature_type": "core | supporting | operational",
      "priority": "P0 | P1 | P2 | P3",
      "description": "",
      "user_story": "",
      "dependencies": []
    }
  ]
}
```

### User Prompt 구조
```
아이디어: [사용자 입력 아이디어]

PMF 분석 결과:
[API Call 1 결과 JSON]

위 내용을 바탕으로 필요한 Feature 목록을 추출해주세요.
```

---

## API Call 3. MD 파일 세트 생성

### 목적
Feature 목록을 기반으로 전체 MD 파일 내용을 한 번에 생성한다.

### System Prompt
```
당신은 시니어 프로덕트 매니저이자 소프트웨어 아키텍트입니다.
주어진 프로젝트 정보를 바탕으로 개발자가 바로 사용할 수 있는 문서 세트를 생성하세요.
반드시 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 반환하세요.

응답 형식:
{
  "CLAUDE_md": "",
  "cursorrules": "",
  "env_example": "",
  "PROJECT_OVERVIEW_md": "",
  "PMF_ANALYSIS_md": "",
  "FEATURE_LIST_md": "",
  "features": [
    {
      "feature_name": "",
      "PRD_md": "",
      "USER_FLOW_md": "",
      "API_SPEC_md": "",
      "DB_SCHEMA_md": ""
    }
  ],
  "setup_sh": ""
}
```

### User Prompt 구조
```
프로젝트 정보:
- 아이디어: [사용자 입력]
- 기술 스택: [선택한 스택]
- 개발 경험: [선택값]
- 서비스 상태: [선택값]

PMF 분석:
[API Call 1 결과]

Feature 목록:
[API Call 2 결과]

위 내용을 바탕으로 전체 문서 세트를 생성해주세요.
각 문서는 실제 개발자가 Claude Code 또는 Cursor에 바로 넣어서 개발을 시작할 수 있는 수준으로 작성하세요.
```

---

## API Call 4. 터미널 명령어 생성

### 목적
선택한 기술 스택과 프로젝트 정보를 기반으로 setup.sh 및 터미널 명령어를 생성한다.

### 처리 방식
API 호출 없이 선택값 기반 템플릿 조합으로 동적 생성한다.

### 스택별 명령어 매핑

#### Next.js + Firebase
```bash
npx create-next-app@latest [프로젝트명] --typescript --tailwind --eslint
cd [프로젝트명]
npm install firebase
npm install -g firebase-tools
```

#### React + Supabase
```bash
npx create-react-app [프로젝트명] --template typescript
cd [프로젝트명]
npm install @supabase/supabase-js
```

#### Vue + Express
```bash
npm create vue@latest [프로젝트명]
cd [프로젝트명]
npm install express axios
```

#### 잘 모름 / 스킵 (기본값)
```bash
npx create-next-app@latest [프로젝트명] --typescript --tailwind --eslint
cd [프로젝트명]
npm install firebase
```

---

# PART 5. 상태 관리 및 데이터 흐름

---

## 전역 상태 구조

Step 1부터 Step 4까지 모든 선택값과 생성 결과를 하나의 전역 상태로 관리한다.

```typescript
interface ForgeState {
  // Step 1: Readiness Check
  readiness: {
    dev_experience: 'none' | 'beginner' | 'intermediate' | 'advanced';
    has_github: boolean;
    has_vscode: boolean;
    has_nodejs: boolean;
    has_firebase: boolean;
    has_vercel: boolean;
    service_status: 'new_idea' | 'mvp_dev' | 'operating';
  };

  // Step 2: 순서 및 스택 선택
  setup: {
    build_sequence: 'prd_first' | 'env_first';
    tech_stack: 'next_firebase' | 'react_supabase' | 'vue_express' | 'unknown';
  };

  // Step 3: 아이디어 및 PMF
  idea: {
    raw_input: string;
    pmf_score: number;
    pmf_result: PMFResult | null;
    features: Feature[] | null;
    project_name: string;
  };

  // Step 4: 산출물
  outputs: {
    md_files: MDFileSet | null;
    terminal_commands: string;
    env_example: string;
    is_generated: boolean;
  };

  // 현재 단계
  current_step: 1 | 2 | 3 | 4;
}
```

---

## 선택값 → 산출물 조합 로직

사용자의 선택값 조합에 따라 생성되는 산출물이 달라진다.

### 서비스 상태별 산출물 차이

#### 신규 아이디어
```
생성: 전체 MD 세트
포함: CLAUDE.md, .cursorrules, PROJECT_OVERVIEW.md,
      PMF_ANALYSIS.md, FEATURE_LIST.md, 각 Feature별 PRD/API/DB,
      setup.sh, .env.example
```

#### MVP 개발중
```
생성: 기술 문서 중심
포함: CLAUDE.md, .cursorrules, FEATURE_LIST.md,
      각 Feature별 PRD/API/DB, .env.example
제외: PROJECT_OVERVIEW.md (이미 있다고 가정), setup.sh (이미 세팅됨)
```

#### 운영중 서비스
```
생성: 확장 및 개선 문서 중심
포함: CLAUDE.md 업데이트, 신규 Feature PRD/API/DB
추가: IMPACT_ANALYSIS.md (기존 기능 영향도 분석)
제외: setup.sh, PROJECT_OVERVIEW.md
```

---

### 기술 스택별 산출물 차이

#### Next.js + Firebase
```
.env.example: Firebase 환경변수 포함
setup.sh: create-next-app + firebase 설치 명령어
CLAUDE.md: Next.js App Router 기준 폴더 구조
.cursorrules: Firebase SDK 사용 규칙 포함
```

#### React + Supabase
```
.env.example: Supabase 환경변수 포함
setup.sh: create-react-app + supabase 설치 명령어
CLAUDE.md: React 기준 폴더 구조
.cursorrules: Supabase 사용 규칙 포함
```

#### Vue + Express
```
.env.example: Express 서버 환경변수 포함
setup.sh: create-vue + express 설치 명령어
CLAUDE.md: Vue 기준 폴더 구조
.cursorrules: Vue + Express 규칙 포함
```

---

## 단계별 데이터 전달 흐름

```
Step 1 선택값
  └→ ForgeState.readiness 저장

Step 2 선택값
  └→ ForgeState.setup 저장

Step 3 아이디어 입력
  └→ API Call 1 (PMF 평가)
       └→ ForgeState.idea.pmf_result 저장
  └→ API Call 2 (Feature 추출)
       └→ ForgeState.idea.features 저장

Step 4 진입 시
  └→ API Call 3 (MD 파일 세트 생성)
       입력: ForgeState 전체
       └→ ForgeState.outputs.md_files 저장
  └→ 터미널 명령어 동적 생성
       입력: ForgeState.setup.tech_stack
             ForgeState.idea.project_name
       └→ ForgeState.outputs.terminal_commands 저장
```

---

# PART 6. 로그인 및 저장 시스템

---

## 기본 방침

SpecForge V2는 로그인 없이도 사용 가능하다.

단, 로그인 시 생성한 프로젝트를 저장하고 나중에 다시 접근할 수 있다.

---

## 인증 방식

```
제공 방식:
- Google OAuth (Firebase Authentication)
- GitHub OAuth (Firebase Authentication)

비로그인:
- 전체 플로우 사용 가능
- 산출물 생성 및 다운로드 가능
- 저장 불가. 세션 종료 시 데이터 소멸
```

---

## 로그인 진입 시점

```
강제 로그인 없음.

로그인 유도 시점:
1. Step 4 산출물 생성 완료 후
   → "프로젝트를 저장하려면 로그인하세요" 배너 표시
2. 다운로드 버튼 클릭 시
   → 비로그인: 바로 다운로드
   → 로그인: 다운로드 + 자동 저장
```

---

## 저장 데이터 구조

Firebase Firestore 기준

```
Collection: projects
Document ID: [자동 생성 UUID]

{
  user_id: string,
  created_at: timestamp,
  updated_at: timestamp,
  project_name: string,
  idea_input: string,
  pmf_score: number,
  pmf_result: object,
  features: array,
  setup: {
    build_sequence: string,
    tech_stack: string
  },
  readiness: object,
  outputs: {
    md_files: object,
    terminal_commands: string,
    env_example: string
  }
}
```

---

## 마이페이지 (저장된 프로젝트 목록)

### 기능
```
- 저장된 프로젝트 목록 조회
- 프로젝트 클릭 시 Step 4 결과 화면으로 바로 이동
- 프로젝트 삭제
- 산출물 재다운로드
- 프로젝트 이름 수정
```

### 화면 구조
```
헤더: 로고 + 로그인 상태 표시 + 마이페이지 버튼

마이페이지:
- 프로젝트 카드 목록 (생성일, 프로젝트명, PMF 점수, 기술 스택)
- 각 카드: 열기 버튼, 다운로드 버튼, 삭제 버튼
- 새 프로젝트 시작 버튼
```

---

## 비로그인 → 로그인 전환 시 데이터 처리

```
시나리오: 비로그인으로 Step 4까지 완료 후 로그인한 경우

처리:
1. 로그인 완료 즉시 현재 세션의 프로젝트 데이터 자동 저장
2. "프로젝트가 저장되었습니다." 토스트 메시지 표시
3. 마이페이지에서 확인 가능
```

---

## 엣지 케이스

#### EC-21. 로그인 중 네트워크 오류
```
처리: "로그인에 실패했습니다. 다시 시도해주세요." 메시지
데이터: 현재 세션 데이터 유지
```

#### EC-22. 저장 중 오류
```
처리: "저장에 실패했습니다." 메시지 + 재시도 버튼
대안: 다운로드는 정상 진행 가능
```

#### EC-23. 동일한 프로젝트명으로 재저장
```
처리: 기존 프로젝트 덮어쓰기가 아닌 새 프로젝트로 저장
프로젝트명 자동 처리: "[프로젝트명] (2)", "[프로젝트명] (3)" 형태로 구분
```

#### EC-24. 로그아웃 후 마이페이지 접근
```
처리: 로그인 페이지로 리다이렉트
메시지: "마이페이지는 로그인 후 이용 가능합니다."
```

---

## Related Documents

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 02_PRODUCT_GRAPH_ENGINE.md
- 03_DOCUMENT_GENERATION_ENGINE.md
- 04_DESIGN_SYSTEM_ENGINE.md
- 05_DEV_EXECUTION_ENGINE.md
- 06_IMPLEMENTATION_ROADMAP.md
- 07_OPERATION_AND_EVOLUTION_ENGINE.md
- specforge_v2_project_definition.html
