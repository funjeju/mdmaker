# 00_PROJECT_CONSTITUTION.md

## Purpose

본 문서는 SpecForge의 최상위 헌법(Constitution)이다.

모든 엔진, 문서, Agent, 워크플로우는 본 문서의 철학과 원칙을 따른다.

본 문서는 특정 기능이나 구현 방법을 설명하는 문서가 아니다.

SpecForge가 왜 존재하는지, 무엇을 목표로 하는지, 어떤 방식으로 사고하는지를 정의한다.

---

## Scope

본 문서는 다음 영역을 정의한다.

- Project Vision
- Core Philosophy
- System Architecture
- Lifecycle Architecture
- Feature First Principle
- Product Graph Principle
- AI Agent Principle
- Document Principle
- Design Principle
- Development Principle
- Evolution Principle
- Governance

---

## Core Mission

기획과 개발 사이의 간극을 제거한다.

아이디어를 가진 사람이라면 누구나

```text
아이디어

↓

검증

↓

설계

↓

구현

↓

배포

↓

운영

↓

성장
```

까지 도달할 수 있어야 한다.

---

# Vision

SpecForge는 단순한 문서 생성기가 아니다.

SpecForge는

```text
Idea To Product Operating System
```

이다.

---

## Long-Term Goal

사용자의 아이디어를

반복 가능하고,

확장 가능하며,

운영 가능한

실제 서비스로 전환한다.

---

# Core Philosophy

## Philosophy 01

Feature First

---

기능이 중심이다.

문서는 기능을 설명하기 위해 존재한다.

```text
Feature

↓

PRD

↓

Design

↓

Code
```

문서가 기능을 만드는 것이 아니다.

기능이 문서를 만든다.

---

## Philosophy 02

Single Source Of Truth

---

프로젝트의 진실 공급원은 하나여야 한다.

```text
Product Graph
```

모든 문서

모든 디자인

모든 코드

모든 Agent

는 Product Graph를 기준으로 동작한다.

---

## Philosophy 03

Validation Before Implementation

---

구현보다 검증이 먼저다.

```text
Idea

↓

Validation

↓

Implementation
```

검증되지 않은 아이디어를 구현하지 않는다.

---

## Philosophy 04

Evolution Over Completion

---

제품은 완성되지 않는다.

제품은 진화한다.

```text
Build

↓

Measure

↓

Learn

↓

Improve
```

---

# System Architecture

## Master Architecture

```text
Idea

↓

ForgeLaunch

↓

PMF Validation

↓

Feature Extraction

↓

Product Graph

↓

Document Generation

↓

Design System

↓

Development

↓

Launch

↓

Operation

↓

Evolution
```

---

# Engine Architecture

## Engine Layer

```text
00 Constitution

↓

01 ForgeLaunch

↓

02 Product Graph

↓

03 Document Engine

↓

04 Design Engine

↓

05 Development Engine

↓

06 Implementation Roadmap

↓

07 Operation & Evolution
```

---

## Engine Responsibilities

### 01 ForgeLaunch

프로젝트 시작

---

### 02 Product Graph

프로젝트 기억

---

### 03 Document Engine

문서 생성

---

### 04 Design Engine

UI/UX 설계

---

### 05 Development Engine

실제 구현

---

### 06 Roadmap Engine

출시 계획

---

### 07 Evolution Engine

운영 및 성장

---

# Lifecycle Architecture

## Complete Lifecycle

```text
Idea

↓

Readiness Check

↓

PMF

↓

Feature Definition

↓

Product Graph

↓

Documentation

↓

Design

↓

Development

↓

Testing

↓

Deployment

↓

Analytics

↓

Feedback

↓

Evolution

↓

Next Release
```

---

# PMF Principle

## Definition

모든 프로젝트는 PMF를 통과해야 한다.

---

## Required Questions

### Problem

무슨 문제를 해결하는가

---

### Customer

누가 이 문제를 겪는가

---

### Value

왜 이 솔루션을 사용해야 하는가

---

### Market

시장은 존재하는가

---

### Timing

지금 해야 하는 이유는 무엇인가

---

# Feature First Principle

## Definition

Feature는 프로젝트의 최소 단위이다.

---

## Feature Lifecycle

```text
Idea

↓

Validated

↓

Designed

↓

Specified

↓

Implemented

↓

Released

↓

Evolved
```

---

## Feature Ownership

모든 Feature는 다음을 가져야 한다.

```text
Owner

Priority

Status

Dependencies

Metrics
```

---

# Product Graph Principle

## Definition

모든 프로젝트 데이터는 Product Graph에 저장된다.

---

## Graph Structure

```text
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
```

---

## Rule

Graph를 우회한 변경 금지

---

# Document Principle

## Definition

문서는 Product Graph의 표현 방식이다.

---

## Rule

문서는 진실 공급원이 아니다.

Product Graph가 진실 공급원이다.

---

# Design Principle

## Definition

디자인은 장식이 아니다.

사용자가 목표를 달성하도록 돕는 시스템이다.

---

## Design Flow

```text
PMF

↓

Feature

↓

UX

↓

UI

↓

Implementation
```

---

# Development Principle

## Definition

구현은 Product Graph를 실행 가능한 코드로 변환하는 과정이다.

---

## Development Flow

```text
Feature

↓

Tasks

↓

Code

↓

Tests

↓

Deployment
```

---

# AI Agent Principle

## Definition

AI는 보조 도구가 아니다.

AI는 프로젝트 실행 주체 중 하나이다.

---

## Supported Agents

```text
Claude Code

Cursor

Codex

Future Agents
```

---

## Agent Hierarchy

```text
Product Graph

↓

Agent Context

↓

Agent Tasks

↓

Implementation
```

---

# Closed Loop Principle

## Definition

서비스는 출시 후부터 시작된다.

---

## Evolution Loop

```text
Launch

↓

Usage

↓

Analytics

↓

Feedback

↓

PMF Revalidation

↓

Feature Evolution

↓

Graph Update

↓

Next Release
```

---

# Governance

## Rule 01

PMF 없는 개발 금지

---

## Rule 02

Feature 없는 문서 생성 금지

---

## Rule 03

Graph 없는 구현 금지

---

## Rule 04

Impact Analysis 없는 변경 금지

---

## Rule 05

동기화되지 않은 문서 사용 금지

---

## Rule 06

데이터 없는 의사결정 금지

---

# Success Definition

SpecForge의 성공은

코드를 많이 생성하는 것이 아니다.

다음 상태를 만드는 것이다.

```text
아이디어

↓

검증

↓

설계

↓

구현

↓

배포

↓

운영

↓

성장
```

이 전체 사이클을

누구나 반복 가능하게 만드는 것.

---

# Canonical Document Order

```text
00_PROJECT_CONSTITUTION.md

01_FORGELAUNCH_PROTOCOL.md

02_PRODUCT_GRAPH_ENGINE.md

03_DOCUMENT_GENERATION_ENGINE.md

04_DESIGN_SYSTEM_ENGINE.md

05_DEV_EXECUTION_ENGINE.md

06_IMPLEMENTATION_ROADMAP.md

07_OPERATION_AND_EVOLUTION_ENGINE.md
```

---

# Final Principle

SpecForge는

문서를 만들기 위한 시스템이 아니다.

SpecForge는

제품을 만들고,

운영하고,

성장시키기 위한 운영체계(Operating System)이다.