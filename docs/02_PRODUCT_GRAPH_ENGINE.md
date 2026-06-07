# 02_PRODUCT_GRAPH_ENGINE.md

## Purpose

Product Graph Engine은 프로젝트의 모든 기능(Feature), 문서(Document), 디자인(Design), 데이터(Data), 구현(Implementation)을 하나의 연결된 구조로 관리하는 Single Source of Truth 엔진이다.

모든 프로젝트 정보는 Product Knowledge Graph에 저장되며, 어떤 변경도 Graph를 거치지 않고 직접 수정될 수 없다.

---

## Scope

본 문서는 다음 영역을 정의한다.

- Feature Model
- Product Knowledge Graph
- Dependency Graph
- Impact Analysis
- Knowledge Synchronization
- Change Management
- Traceability System

---

## Dependencies

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md

---

# Core Philosophy

문서는 중심이 아니다.

Feature가 중심이다.

모든 산출물은 Feature로부터 파생된다.

```text
Feature
 ├─ PRD
 ├─ User Flow
 ├─ Design
 ├─ API
 ├─ Database
 ├─ Test
 ├─ Agent Context
 ├─ Claude Rules
 └─ Cursor Rules
```

---

# Product Knowledge Graph

## Definition

Product Knowledge Graph는 프로젝트의 모든 요소를 연결하는 구조이다.

```text
Project
 │
 ├── Feature
 │     ├── Design
 │     ├── API
 │     ├── DB
 │     ├── Test
 │     └── Documents
 │
 ├── Dependencies
 │
 ├── Business Rules
 │
 ├── Technical Rules
 │
 └── Agent Context
```

---

## Single Source of Truth

모든 정보는 Graph를 기준으로 관리한다.

수정 시 Graph가 먼저 변경되어야 한다.

직접 문서 수정은 금지한다.

---

# Feature Entity

## Definition

Feature는 프로젝트의 최소 관리 단위이다.

---

## Required Properties

```yaml
feature_id:
feature_name:
feature_type:
feature_status:
priority:
owner:
created_at:
updated_at:
```

---

## Feature Categories

### Core Feature

프로젝트 핵심 기능

예시

```text
회원가입
로그인
결제
예약
```

---

### Supporting Feature

보조 기능

예시

```text
알림
검색
문의
즐겨찾기
```

---

### Operational Feature

운영 기능

예시

```text
관리자
통계
권한관리
로그분석
```

---

# Feature Relationship Model

## Parent Feature

```text
예약 시스템
 ├─ 예약 생성
 ├─ 예약 수정
 ├─ 예약 취소
 └─ 예약 조회
```

---

## Child Feature

하위 기능은 부모 Feature에 종속된다.

---

## Shared Feature

여러 기능이 공유하는 공통 기능

```text
인증
파일업로드
알림
```

---

# Feature Lifecycle

## Stage 01

Idea

---

## Stage 02

Validated

PMF 검증 완료

---

## Stage 03

Designed

설계 완료

---

## Stage 04

Specified

문서화 완료

---

## Stage 05

Implemented

구현 완료

---

## Stage 06

Released

배포 완료

---

## Stage 07

Deprecated

폐기

---

# Dependency Graph

## Definition

Feature 간 의존성을 관리한다.

---

## Dependency Types

### Business Dependency

비즈니스 흐름 의존성

```text
회원가입
 ↓
로그인
 ↓
예약
```

---

### Technical Dependency

기술 의존성

```text
API
 ↓
Database
 ↓
Storage
```

---

### Design Dependency

UI/UX 의존성

```text
Design System
 ↓
Component
 ↓
Screen
```

---

# Impact Analysis Engine

## Purpose

변경 시 영향을 받는 영역을 자동 계산한다.

---

## Example

```text
회원가입 변경

↓

영향 대상

PRD

User Flow

API

Database

Test

Design

Agent Context
```

---

## Analysis Rules

### Rule 01

직접 연결된 노드 분석

---

### Rule 02

간접 연결된 노드 분석

---

### Rule 03

하위 Feature 영향 분석

---

### Rule 04

상위 Feature 영향 분석

---

# Knowledge Synchronization Engine

## Purpose

모든 문서와 구현 상태를 Graph와 동기화한다.

---

## Synchronization Targets

```text
PRD

User Flow

Design

API Spec

Database Schema

Test Cases

Claude.md

Cursor Rules

Implementation Status
```

---

## Synchronization Policy

Graph 변경 발생

↓

영향도 계산

↓

대상 문서 식별

↓

자동 갱신 요청

↓

상태 검증

↓

동기화 완료

---

# Agent Context Layer

## Purpose

AI Agent가 프로젝트를 이해할 수 있도록 컨텍스트를 제공한다.

---

## Context Sources

```text
PMF

Features

Business Rules

Design Rules

Technical Rules

Dependencies

Implementation Status
```

---

## Context Priority

```text
1. Product Graph

2. Business Rules

3. Technical Rules

4. Documents

5. Historical Changes
```

---

# Change Management Engine

## Rule 01

Feature 없이 문서 생성 금지

---

## Rule 02

Graph 미등록 기능 구현 금지

---

## Rule 03

Impact Analysis 없는 변경 금지

---

## Rule 04

동기화되지 않은 문서 사용 금지

---

## Rule 05

Feature 삭제 시 모든 종속성 검토

---

# Traceability System

## Purpose

모든 변경 이력을 추적한다.

---

## Trace Chain

```text
PMF

↓

Feature

↓

Design

↓

API

↓

Database

↓

Test

↓

Implementation

↓

Deployment
```

---

## Audit Requirement

모든 Feature는 다음을 추적 가능해야 한다.

```text
왜 만들어졌는가

누가 만들었는가

어떤 PMF를 해결하는가

어떤 문서와 연결되는가

어떤 기능에 영향을 주는가
```

---

# Success Criteria

```text
□ 모든 기능이 Graph에 등록됨

□ 모든 문서가 Feature와 연결됨

□ 모든 변경이 Impact Analysis를 통과함

□ 모든 Agent가 동일한 Context를 사용함

□ Graph가 프로젝트의 단일 진실 공급원이 됨
```

---

## Related Documents

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 03_DOCUMENT_GENERATION_ENGINE.md
- 04_DESIGN_SYSTEM_ENGINE.md
- 05_DEV_EXECUTION_ENGINE.md