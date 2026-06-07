01_FORGELAUNCH_PROTOCOL.md
문서 목적

ForgeLaunch는 개발환경 생성기가 아니다.

ForgeLaunch의 본질은 사용자의 현재 상태를 진단하고, 가장 적합한 프로젝트 시작 경로(Route)를 결정한 뒤, 필요한 경우 개발환경까지 자동 구축하는 프로젝트 부트스트랩 엔진이다.

핵심 원칙
Principle 01

사용자보다 프로젝트를 먼저 만들지 않는다.

사용자의 현재 상태를 파악하기 전에는

PMF 분석
Feature 추출
문서 생성
개발환경 생성

어느 것도 시작하지 않는다.

Principle 02

모든 프로젝트는 Route부터 결정한다.

동일한 아이디어라도

초보자
개발자
기존 프로젝트 보유자
운영 중 서비스 보유자

에 따라 진입 경로가 달라진다.

ForgeLaunch 위치
사용자 아이디어
       │
       ▼
ForgeLaunch
       │
       ▼
PMF Engine
       │
       ▼
Feature Engine
       │
       ▼
Product Knowledge Graph
       │
       ▼
Document Engine
       │
       ▼
Development Execution

ForgeLaunch는 PMF 이전에 동작한다.

Stage 01
Readiness Check

사용자의 현재 상태를 진단한다.

개발 경험
없음
초급
중급
고급
Github 상태
없음
보유
사용중
VSCode 상태
설치 안됨
설치됨
Node.js 상태
설치 안됨
설치됨
Firebase 상태
미사용
계정보유
프로젝트보유
Vercel 상태
미사용
계정보유
프로젝트보유
Repository 상태
없음
보유
운영중
서비스 상태
신규 아이디어

MVP 개발중

운영중 서비스

기존 서비스 확장
Stage 02
Project Classification Engine

프로젝트를 분류한다.

Type A

신규 프로젝트

아이디어만 존재
Type B

개발환경 보유 프로젝트

Github
VSCode
Node

준비 완료
Type C

기존 Repository 프로젝트

Github Repository 존재
Type D

운영 중 서비스

실제 사용자 존재
Stage 03
Route Engine

프로젝트 진행 경로를 결정한다.

Route A

신규 프로젝트

ForgeLaunch
 ↓
PMF
 ↓
Feature
 ↓
Knowledge Graph
 ↓
Document Engine
 ↓
Workspace Setup
Route B

개발환경 보유

ForgeLaunch
 ↓
PMF
 ↓
Feature
 ↓
Knowledge Graph
 ↓
Development
Route C

기존 Repository

ForgeLaunch
 ↓
Repository Scan
 ↓
Knowledge Graph 생성
 ↓
Feature 분석
 ↓
확장 설계
Route D

운영 서비스

ForgeLaunch
 ↓
서비스 분석
 ↓
문제 분석
 ↓
PMF 재검증
 ↓
Feature 확장
Stage 04
Technology Stack Mapping

사용자의 선호 기술을 확인한다.

Frontend
Next.js

React

Vue

기타

모름
Backend
Firebase

Supabase

Node

기타

모름
AI Development Tool
Claude Code

Cursor

Codex

기타
Stage 05
Build Sequence Engine

사용자가 원하는 시작 순서를 결정한다.

Sequence A

기획 우선

PMF
 ↓
Feature
 ↓
문서 생성
 ↓
개발환경
Sequence B

개발환경 우선

Github
 ↓
Workspace
 ↓
Firebase
 ↓
Vercel
 ↓
PMF
 ↓
Feature
Sequence C

병렬 진행

PMF
      │
      ├── 개발환경
      │
      └── Feature 설계
Stage 06
Workspace Provisioning Engine

프로젝트 작업공간을 생성한다.

생성 대상
Github Repository

Local Workspace

Firebase Project

Vercel Project
자동 생성 산출물
README

.env.example

Project Structure

Agent Context

Workspace Rules
Stage 07
Cloud Automation Engine

자동 연동을 수행한다.

Firebase
프로젝트 생성

환경변수 추출

SDK 초기화
Vercel
프로젝트 생성

환경변수 등록

배포 준비
Stage 08
Handoff Protocol

ForgeLaunch 종료 후 다음 엔진으로 전달한다.

신규 프로젝트
→ PMF Engine
기존 프로젝트
→ Product Graph Engine
운영 서비스
→ Impact Analysis Engine
성공 조건

ForgeLaunch 완료 시

□ 사용자 상태 파악 완료

□ 프로젝트 유형 결정 완료

□ 진행 경로 결정 완료

□ 기술 스택 결정 완료

□ 개발환경 준비 완료

□ 다음 엔진 전달 완료

ForgeLaunch의 목표는 개발환경 구축이 아니라 올바른 시작 경로를 결정하는 것이다. 이는 기존 HTML의 DevLaunch 개념을 확장하여 프로젝트 진단 엔진으로 재정의한 구조를 따른다.