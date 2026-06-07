# 03_DOCUMENT_GENERATION_ENGINE.md

## Purpose

Document Generation Engine은 Product Graph를 기반으로 프로젝트 문서를 자동 생성하고 지속적으로 동기화하는 엔진이다.

모든 문서는 Feature를 기준으로 생성되며, 독립적으로 존재할 수 없다.

Document Generation Engine의 목표는 문서 작성이 아니라 AI Agent와 개발자가 동일한 정보를 공유하도록 만드는 것이다.

---

## Scope

본 문서는 다음 영역을 정의한다.

- Document Architecture
- Document Generation Rules
- PRD Engine
- User Flow Engine
- API Specification Engine
- Database Specification Engine
- Test Specification Engine
- Agent Context Engine
- Synchronization Rules

---

## Dependencies

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 02_PRODUCT_GRAPH_ENGINE.md

---

# Core Philosophy

문서는 프로젝트의 진실 공급원이 아니다.

Product Graph가 진실 공급원이다.

모든 문서는 Graph의 표현 방식일 뿐이다.

```text
Product Graph
      │
      ▼
Document Engine
      │
      ├── PRD
      ├── User Flow
      ├── API Spec
      ├── DB Spec
      ├── Test Cases
      ├── Agent Context
      └── Workspace Rules
```

---

# Document Hierarchy

## Level 0

Core Documents

```text
00_PROJECT_CONSTITUTION.md

01_FORGELAUNCH_PROTOCOL.md

02_PRODUCT_GRAPH_ENGINE.md

03_DOCUMENT_GENERATION_ENGINE.md

04_DESIGN_SYSTEM_ENGINE.md

05_DEV_EXECUTION_ENGINE.md

06_IMPLEMENTATION_ROADMAP.md
```

---

## Level 1

Project Documents

```text
PROJECT_OVERVIEW.md

PMF_ANALYSIS.md

PROJECT_SCOPE.md
```

---

## Level 2

Feature Documents

```text
FEATURE_AUTH.md

FEATURE_PAYMENT.md

FEATURE_BOOKING.md
```

---

## Level 3

Technical Documents

```text
API_SPEC.md

DATABASE_SCHEMA.md

TEST_SPEC.md
```

---

# Document Generation Lifecycle

## Stage 01

Feature Created

```text
Feature 등록
```

---

## Stage 02

Document Mapping

```text
필요 문서 식별
```

---

## Stage 03

Document Generation

```text
문서 자동 생성
```

---

## Stage 04

Cross Linking

```text
문서 연결
```

---

## Stage 05

Synchronization

```text
Graph 동기화
```

---

# PRD Engine

## Purpose

Feature를 사용자 가치 중심으로 정의한다.

---

## Required Sections

### Overview

기능 설명

---

### Problem

해결하려는 문제

---

### Target User

대상 사용자

---

### User Story

```text
As a user

I want to

So that
```

---

### Success Metrics

정량 목표

---

### Constraints

제약 조건

---

### Acceptance Criteria

완료 조건

---

# User Flow Engine

## Purpose

사용자의 행동 흐름을 정의한다.

---

## Required Sections

### Entry Point

유입 경로

---

### Main Flow

정상 흐름

---

### Alternative Flow

예외 흐름

---

### Exit Point

종료 지점

---

## Example

```text
홈

↓

회원가입

↓

로그인

↓

예약

↓

결제

↓

완료
```

---

# API Specification Engine

## Purpose

프론트엔드와 백엔드 간 계약을 정의한다.

---

## Required Structure

### Endpoint

```text
POST /api/auth/signup
```

---

### Request

```json
{
  "email": "",
  "password": ""
}
```

---

### Response

```json
{
  "success": true
}
```

---

### Error Cases

```text
400

401

403

500
```

---

# Database Specification Engine

## Purpose

데이터 구조를 정의한다.

---

## Required Structure

### Table Name

---

### Description

---

### Columns

```text
id

created_at

updated_at
```

---

### Relationships

```text
User

↓

Booking

↓

Payment
```

---

### Constraints

```text
NOT NULL

UNIQUE

FOREIGN KEY
```

---

# Test Specification Engine

## Purpose

기능 검증 기준을 정의한다.

---

## Test Categories

### Functional Test

기능 검증

---

### UI Test

화면 검증

---

### Integration Test

연동 검증

---

### Regression Test

회귀 검증

---

## Required Format

```text
Test ID

Scenario

Expected Result

Status
```

---

# Agent Context Engine

## Purpose

AI Agent가 프로젝트를 이해하도록 만든다.

---

## Context Sources

```text
PMF

Feature

Business Rules

Design Rules

Technical Rules

Dependencies
```

---

## Context Layers

### Layer 1

Business Context

---

### Layer 2

Feature Context

---

### Layer 3

Technical Context

---

### Layer 4

Implementation Context

---

# CLAUDE.md Generation

## Purpose

Claude Code 전용 작업 컨텍스트 생성

---

## Required Sections

### Project Summary

---

### Architecture

---

### Features

---

### Coding Standards

---

### Rules

---

### Current Tasks

---

# Cursor Rules Generation

## Purpose

Cursor Agent 행동 규칙 생성

---

## Required Sections

### Development Rules

---

### Folder Structure

---

### Coding Standards

---

### Documentation Standards

---

### Deployment Rules

---

# Cross Reference System

## Purpose

문서 간 연결 관계 관리

---

## Example

```text
Feature
 │
 ├── PRD
 ├── User Flow
 ├── Design
 ├── API
 ├── DB
 └── Test
```

---

## Rule

문서는 단독 생성 금지

항상 Feature와 연결

---

# Synchronization Engine

## Purpose

모든 문서를 Product Graph와 동기화한다.

---

## Synchronization Targets

```text
PRD

User Flow

Design

API

DB

Test

Claude

Cursor
```

---

## Trigger Events

### Feature Added

---

### Feature Updated

---

### Feature Removed

---

### Dependency Changed

---

### Business Rule Changed

---

# Naming Convention

## Core Documents

```text
00_*.md

01_*.md

02_*.md
```

---

## Feature Documents

```text
FEATURE_[NAME].md
```

---

## Technical Documents

```text
API_SPEC.md

DATABASE_SCHEMA.md

TEST_SPEC.md
```

---

# Document Governance

## Rule 01

Feature 없는 문서 생성 금지

---

## Rule 02

Graph 미등록 문서 금지

---

## Rule 03

수동 중복 문서 금지

---

## Rule 04

동기화 실패 문서 사용 금지

---

## Rule 05

모든 문서는 추적 가능해야 함

---

# Success Criteria

```text
□ 모든 문서가 Feature와 연결됨

□ 모든 문서가 Graph와 동기화됨

□ Agent Context 자동 생성됨

□ 구현 기준 문서 자동 생성됨

□ 변경 시 자동 영향도 계산됨

□ 문서가 아닌 Feature 중심으로 관리됨
```

---

## Related Documents

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 02_PRODUCT_GRAPH_ENGINE.md
- 04_DESIGN_SYSTEM_ENGINE.md
- 05_DEV_EXECUTION_ENGINE.md
- 06_IMPLEMENTATION_ROADMAP.md