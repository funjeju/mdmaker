# 05_DEV_EXECUTION_ENGINE.md

## Purpose

Dev Execution Engine는 Product Graph, Document Engine, Design System을 실제 서비스로 구현하는 실행 엔진이다.

본 엔진의 목표는 기획 문서를 작성하는 것이 아니라 AI Agent와 개발 도구를 활용하여 아이디어를 실제 운영 가능한 서비스로 전환하는 것이다.

---

## Scope

본 문서는 다음 영역을 정의한다.

- Development Architecture
- AI Agent Execution
- Workspace Structure
- Source Control
- Development Workflow
- Backend Execution
- Frontend Execution
- Deployment Execution
- Environment Management
- Quality Assurance
- Release Management

---

## Dependencies

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 02_PRODUCT_GRAPH_ENGINE.md
- 03_DOCUMENT_GENERATION_ENGINE.md
- 04_DESIGN_SYSTEM_ENGINE.md

---

# Core Philosophy

구현은 문서를 만드는 작업이 아니다.

구현은 Product Graph를 실제 동작하는 서비스로 변환하는 과정이다.

```text
PMF
 ↓
Feature
 ↓
Product Graph
 ↓
Documents
 ↓
Implementation
 ↓
Deployment
 ↓
Operation
```

---

# Development Architecture

## Execution Flow

```text
Product Graph

↓

Agent Context

↓

Task Generation

↓

Code Generation

↓

Validation

↓

Deployment
```

---

## Single Source Of Truth

```text
Product Graph
```

모든 개발은 Product Graph를 기준으로 진행한다.

---

# AI Agent Execution Layer

## Purpose

AI Agent가 개발 작업을 수행한다.

---

## Supported Agents

```text
Claude Code

Cursor

Codex

Future Agents
```

---

# Claude Code Engine

## Purpose

프로젝트 구현 주체

---

## Responsibilities

```text
Feature 구현

API 구현

Database 구현

Bug Fix

Refactoring

Test 생성
```

---

## Input

```text
CLAUDE.md

Product Graph

Feature Context

Technical Rules
```

---

## Output

```text
Source Code

Tests

Documentation Updates
```

---

# Cursor Execution Engine

## Purpose

개발 생산성 향상

---

## Responsibilities

```text
Code Editing

Refactoring

Auto Completion

Documentation Assistance
```

---

## Input

```text
Cursor Rules

Project Context

Feature Context
```

---

# Agent Task Engine

## Purpose

Feature를 개발 작업으로 분해한다.

---

## Example

```text
회원가입

↓

UI

API

DB

Validation

Test
```

---

## Task Categories

### Feature Task

---

### Design Task

---

### Backend Task

---

### Frontend Task

---

### Infrastructure Task

---

### QA Task

---

# Workspace Architecture

## Standard Structure

```text
project/

├── docs/
├── app/
├── components/
├── features/
├── services/
├── lib/
├── hooks/
├── styles/
├── tests/
├── scripts/
├── public/
└── config/
```

---

# Feature Based Architecture

## Principle

기능 단위로 관리한다.

---

## Example

```text
features/

├── auth/
├── booking/
├── payment/
├── review/
└── admin/
```

---

# Source Control Engine

## Purpose

버전 관리

---

## Platform

```text
Git

GitHub
```

---

## Branch Strategy

### Main

운영

---

### Develop

통합

---

### Feature

기능 개발

---

## Naming Convention

```text
feature/auth

feature/payment

feature/review
```

---

# Development Workflow

## Standard Flow

```text
Feature Created

↓

Task Generated

↓

Agent Assigned

↓

Implementation

↓

Test

↓

Review

↓

Merge

↓

Deploy
```

---

# Frontend Execution Engine

## Purpose

UI 구현

---

## Standard Stack

```text
Next.js

React

TypeScript

Tailwind CSS
```

---

## Responsibilities

```text
Screen

Component

State

Interaction

Accessibility
```

---

# Backend Execution Engine

## Purpose

비즈니스 로직 구현

---

## Standard Stack

```text
Firebase

Supabase

Node.js
```

---

## Responsibilities

```text
Authentication

Business Logic

Database

Storage

API
```

---

# Database Execution Engine

## Purpose

데이터 저장소 구현

---

## Responsibilities

```text
Schema

Indexes

Relations

Security Rules

Migration
```

---

# API Execution Engine

## Purpose

서비스 인터페이스 구현

---

## Responsibilities

```text
REST API

Validation

Authorization

Error Handling

Logging
```

---

# Environment Management Engine

## Purpose

환경 변수 관리

---

## Required Files

```text
.env

.env.local

.env.example
```

---

## Categories

### Public

```text
NEXT_PUBLIC_*
```

---

### Private

```text
SERVER_*
```

---

### Secret

```text
API_KEY

SERVICE_KEY
```

---

# Quality Assurance Engine

## Purpose

품질 보장

---

## Validation Layers

### Unit Test

---

### Integration Test

---

### E2E Test

---

### Security Review

---

### Accessibility Review

---

# Automated Testing Engine

## Purpose

자동 검증

---

## Required Coverage

```text
Core Features

Critical Flow

Business Rules
```

---

## Minimum Requirements

```text
Build Success

Test Success

No Critical Error
```

---

# Deployment Engine

## Purpose

서비스 배포

---

## Platforms

```text
Vercel

Firebase Hosting

Cloud Run

Future Platforms
```

---

## Deployment Flow

```text
Merge

↓

Build

↓

Test

↓

Deploy

↓

Verify

↓

Release
```

---

# Monitoring Engine

## Purpose

운영 상태 추적

---

## Monitoring Targets

```text
Errors

Performance

Usage

Availability
```

---

## Logging Targets

```text
API

Authentication

Database

System Events
```

---

# Release Management

## Release Types

### Major

대규모 변경

---

### Minor

기능 추가

---

### Patch

버그 수정

---

## Versioning

```text
MAJOR.MINOR.PATCH
```

---

# Security Engine

## Purpose

보안 관리

---

## Requirements

```text
Authentication

Authorization

Input Validation

Secret Protection

Audit Logging
```

---

# Dev Governance

## Rule 01

Graph 없는 구현 금지

---

## Rule 02

Feature 없는 코드 작성 금지

---

## Rule 03

문서 미동기화 상태 배포 금지

---

## Rule 04

테스트 없는 핵심 기능 배포 금지

---

## Rule 05

영향도 분석 없는 변경 금지

---

# Success Criteria

```text
□ 모든 Feature 구현 완료

□ Product Graph와 코드 동기화 완료

□ Agent Context 최신 상태 유지

□ 테스트 통과

□ 배포 성공

□ 운영 가능 상태 확보

□ 유지보수 가능 구조 확보
```

---

## Related Documents

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 02_PRODUCT_GRAPH_ENGINE.md
- 03_DOCUMENT_GENERATION_ENGINE.md
- 04_DESIGN_SYSTEM_ENGINE.md
- 06_IMPLEMENTATION_ROADMAP.md