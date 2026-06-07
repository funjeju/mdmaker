import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `당신은 SpecForge의 문서 생성 AI입니다.
사용자가 특정 기능(Feature)에 대해 설명하면 해당 문서 타입에 맞는 마크다운 문서를 생성합니다.

## 규칙
- 문서는 항상 마크다운 형식으로 작성
- 질문은 최대 2~3개만 하고 빠르게 문서 생성으로 넘어갈 것
- 문서가 준비되면 응답 마지막에 아래 형식으로 포함:

[DOCUMENT]
(마크다운 내용)
[/DOCUMENT]

## 스택 감지 규칙
대화 중 사용자가 특정 기술 스택을 언급하거나 문서 내용에서 명확한 스택이 확인되면,
응답 어딘가에 아래 형식으로 포함하세요 (확실할 때만, 추측하지 말 것):

[STACK]
frontend: next | vite | react | vue | nuxt | svelte
database: firebase | supabase | mongodb | prisma | planetscale
styling: tailwind | shadcn | mui | chakra | styled | vanilla
[/STACK]

예시: 사용자가 "Next.js랑 Supabase로 만들어요"라고 하면 → frontend:next, database:supabase 업데이트

## 문서 타입별 포맷

### PRD
# Feature: (이름)
## Problem
## Target User
## User Story
## Success Metrics
## Acceptance Criteria

### API Spec
# API: (이름)
## Endpoints
## Request / Response
## Error Codes

### DB Schema
# Schema: (이름)
## Tables
## Columns
## Relationships

### Test Case
# Test: (이름)
## Test Scenarios
## Expected Results

### User Flow
# Flow: (이름)
## Entry Point
## Main Flow
## Exit Point

### CLAUDE.md
# Project Context
## Architecture
## Tech Stack
## Features
## Rules

### .cursorrules
(cursor 에이전트를 위한 규칙 목록)`;

export async function POST(req: NextRequest) {
  const { messages, nodeType, nodeLabel, projectName, projectIdea } = await req.json();

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      SYSTEM_PROMPT +
      `\n\n현재 생성할 문서 타입: ${nodeLabel ?? nodeType}` +
      (projectName ? `\n프로젝트명: ${projectName}` : "") +
      (projectIdea ? `\n프로젝트 아이디어: ${projectIdea}` : ""),
  });

  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages.length === 0 ? "시작" : messages[messages.length - 1].content;

  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const rawContent = result.response.text();

    let content = rawContent;
    let document: string | null = null;
    let stackUpdate: Record<string, string> | null = null;

    // Extract [DOCUMENT] block
    const docMatch = content.match(/\[DOCUMENT\]([\s\S]*?)\[\/DOCUMENT\]/);
    if (docMatch) {
      document = docMatch[1].trim();
      content = content.replace(docMatch[0], "").trim();
    }

    // Extract [STACK] block
    const stackMatch = content.match(/\[STACK\]([\s\S]*?)\[\/STACK\]/);
    if (stackMatch) {
      stackUpdate = {};
      const lines = stackMatch[1].trim().split("\n");
      for (const line of lines) {
        const [key, val] = line.split(":").map((s) => s.trim());
        if (key && val && ["frontend", "database", "styling"].includes(key)) {
          stackUpdate[key] = val;
        }
      }
      content = content.replace(stackMatch[0], "").trim();
    }

    return NextResponse.json({ content, document, stackUpdate });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI 응답 오류" }, { status: 500 });
  }
}
