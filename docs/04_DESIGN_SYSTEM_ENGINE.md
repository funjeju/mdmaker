# 04_DESIGN_SYSTEM_ENGINE.md

## Purpose

Design System Engine은 프로젝트의 모든 UI/UX 설계, 디자인 자산, 컴포넌트 규칙, 화면 구조를 관리하는 엔진이다.

본 엔진의 목표는 단순히 예쁜 디자인을 만드는 것이 아니라 PMF와 Feature를 가장 효과적으로 전달하는 사용자 경험을 설계하는 것이다.

모든 디자인은 Feature와 연결되어야 하며 독립적으로 존재할 수 없다.

또한 SpecForge는 단순 디자인 생성이 아닌, 레퍼런스 이미지와 경쟁 서비스 분석을 통해 Design DNA를 추출하고 이를 구현 가능한 시스템으로 변환하는 것을 목표로 한다.

---

## Scope

본 문서는 다음 영역을 정의한다.

- Design Philosophy
- Design Intelligence System
- Design DNA System
- Screenshot Analysis Engine
- SaaS Design Framework
- Design Token System
- Component System
- Landing Architecture System
- User Experience System
- AI Design Generation
- Design Validation
- Design Governance

---

## Dependencies

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 02_PRODUCT_GRAPH_ENGINE.md
- 03_DOCUMENT_GENERATION_ENGINE.md

---

# Core Philosophy

디자인은 장식이 아니다.

디자인은 사용자가 목표를 달성하도록 돕는 시스템이다.

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

모든 디자인은 PMF를 강화해야 한다.

---

# Design Intelligence System

## Purpose

프로젝트 목적에 맞는 디자인 방향을 결정한다.

---

## Inputs

```text
PMF

Target User

Feature

Business Goal

Industry

Competitors

Reference Screenshots
```

---

## Outputs

```text
Design DNA

UX Strategy

Visual Strategy

Component Strategy

Design Tokens
```

---

# Screenshot Analysis Engine

## Purpose

사용자가 제공한 디자인 이미지를 분석한다.

---

## Analysis Targets

```text
Layout Structure

Visual Hierarchy

Typography

Color System

Spacing System

Component Patterns

Interaction Patterns

Conversion Strategy
```

---

## Extraction Flow

```text
Screenshot

↓

Pattern Analysis

↓

Design DNA

↓

Component Mapping

↓

Design Token Creation

↓

UI Specification
```

---

# Design DNA System

## Purpose

프로젝트 고유의 디자인 정체성 정의

---

## DNA Categories

### Personality

```text
Professional

Trustworthy

Premium

Modern

Minimal
```

---

### Emotional Goal

```text
Trust

Confidence

Clarity

Efficiency

Achievement
```

---

### Visual Tone

```text
Clean

Airy

Modern

Elegant

High Conversion
```

---

# AI SaaS Design Framework

## Default Design Direction

SpecForge 기본 SaaS 디자인 규칙

---

## Visual Identity

### Style

```text
Modern AI SaaS
```

---

### Mood

```text
Premium

Trustworthy

Simple

Future Ready
```

---

### Layout

```text
Large Whitespace

High Readability

Card Based Layout

Strong CTA Focus
```

---

### Visual Balance

```text
Text 40%

Visual 60%
```

---

# Color System

## Primary Palette

```yaml
primary:
  deep_purple

secondary:
  indigo

accent:
  pink_purple_gradient
```

---

## Neutral Palette

```yaml
background:
  off_white

surface:
  white

border:
  light_gray

text:
  dark_gray
```

---

## Accent Palette

```yaml
success:
warning:
danger:
info:
```

---

# Typography System

## Heading

```text
Bold

Large

High Contrast
```

---

## Body

```text
Easy Reading

Professional

Minimal
```

---

## Hierarchy

```text
H1

H2

H3

Body

Caption
```

---

# Design Token System

## Spacing Tokens

```yaml
xs:
sm:
md:
lg:
xl:
xxl:
```

---

## Radius Tokens

```yaml
small:
medium:
large:
pill:
```

---

## Shadow Tokens

```yaml
light:
medium:
large:
floating:
```

---

# SaaS Landing Architecture

## Standard Structure

```text
Navbar

↓

Hero

↓

Trust Layer

↓

Social Proof

↓

Feature Showcase

↓

Product Demo

↓

Benefits

↓

Pricing

↓

FAQ

↓

CTA

↓

Footer
```

---

# Hero Section Standard

## Required Elements

```text
Headline

Subheadline

Primary CTA

Secondary CTA

Product Screenshot

Trust Indicators
```

---

## Hero Goal

사용자가 5초 안에

```text
무엇인지

누구를 위한 것인지

왜 써야 하는지
```

를 이해해야 한다.

---

# Trust Layer System

## Purpose

신뢰 확보

---

## Components

```text
Customer Logos

Partner Logos

Media Mentions

Security Indicators
```

---

## Position

Hero 바로 아래

---

# Social Proof System

## Purpose

사용자 신뢰 확보

---

## Components

```text
Reviews

Testimonials

User Count

Customer Success Stories

Ratings
```

---

# Feature Showcase System

## Purpose

기능 설명

---

## Structure

```text
Problem

↓

Feature

↓

Benefit

↓

Proof
```

---

## Rule

기능 나열 금지

문제 해결 중심 설명

---

# Product Demo System

## Purpose

제품 사용 모습을 보여준다.

---

## Components

```text
Dashboard Preview

AI Chat Window

Analytics View

Workflow Demo

Mobile Preview
```

---

# Bento Grid System

## Purpose

기능 설명 최적화

---

## Layout

```text
Feature Card

Feature Card

Feature Card

Feature Card
```

---

## Characteristics

```text
Asymmetric

Visual Focus

High Scanability

Modern SaaS Pattern
```

---

# Component System

## Core Components

```text
Button

Input

Select

Card

Modal

Tabs

Table

Navigation
```

---

## SaaS Components

```text
Hero Block

Trust Bar

Logo Cloud

Feature Grid

Bento Grid

Demo Window

Analytics Card

Pricing Card

Testimonial Card

FAQ Accordion

CTA Banner
```

---

# User Experience Engine

## UX Principles

### Principle 01

최소 클릭

---

### Principle 02

최소 입력

---

### Principle 03

최소 학습

---

### Principle 04

명확한 피드백

---

### Principle 05

강한 CTA 유도

---

# Feature Driven Design

## Structure

```text
Feature

↓

User Flow

↓

Screen

↓

Component

↓

Implementation
```

---

# AI Design Generation Engine

## Inputs

```text
PMF

Feature

User Flow

Design DNA

Reference Screenshots
```

---

## Outputs

```text
Wireframe

Screen Layout

Component Tree

UI Specification

Design Tokens
```

---

# Responsive Design Engine

## Breakpoints

```yaml
mobile:
tablet:
desktop:
wide:
```

---

## Rules

### Mobile First

필수

---

### Responsive Components

필수

---

### Touch Optimization

필수

---

# Accessibility Engine

## Requirements

```text
Keyboard Navigation

Screen Reader

Color Contrast

Focus States

Semantic HTML
```

---

# Design Validation Engine

## Validation Targets

```text
PMF Alignment

UX Consistency

Conversion Optimization

Component Consistency

Accessibility

Responsive Compatibility
```

---

# Design Governance

## Rule 01

Feature 없는 디자인 금지

---

## Rule 02

Reference 없는 디자인 생성 금지

---

## Rule 03

Design Token 미사용 금지

---

## Rule 04

Component 재사용 우선

---

## Rule 05

스크린샷 분석 없이 UI 생성 금지

---

## Rule 06

PMF와 무관한 디자인 금지

---

# Design Deliverables

## Required Outputs

```text
Design DNA

Reference Analysis

Screenshot Analysis

Wireframe

Landing Structure

Component Library

Screen Specification

Interaction Specification

Responsive Rules

Accessibility Rules

Implementation Guide
```

---

# Success Criteria

```text
□ PMF와 디자인 연결 완료

□ Screenshot Analysis 구축 완료

□ Design DNA 정의 완료

□ SaaS Landing Architecture 정의 완료

□ Component Library 구축 완료

□ AI 기반 UI 생성 가능

□ 개발 즉시 착수 가능

□ 디자인-구현 간 차이 최소화
```

---

## Related Documents

- 00_PROJECT_CONSTITUTION.md
- 01_FORGELAUNCH_PROTOCOL.md
- 02_PRODUCT_GRAPH_ENGINE.md
- 03_DOCUMENT_GENERATION_ENGINE.md
- 05_DEV_EXECUTION_ENGINE.md
- 06_IMPLEMENTATION_ROADMAP.md