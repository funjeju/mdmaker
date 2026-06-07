import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `당신은 SpecForge의 Product Architect AI입니다.
사용자의 프로젝트 정보를 기반으로 대화하며 필요한 기술 문서를 파악하고 생성합니다.

## 역할 흐름
1. 질문은 반드시 한 번에 하나씩만 합니다. 절대 두 개 이상 묻지 마세요.
2. 3~4번 대화 후 복잡도를 판단합니다
3. 필요한 문서 목록을 사용자에게 알리고 확인받습니다
4. 확인 후 문서를 하나씩 생성합니다

## 복잡도별 문서 구성
- **단순** (랜딩페이지, 소개페이지 등): PRD, CLAUDE.md, .cursorrules (3개)
- **중간** (MVP, 간단한 앱): PRD, API Spec, CLAUDE.md, .cursorrules, User Flow (5개)
- **복잡** (풀스택 앱, SaaS): PRD, API Spec, DB Schema, Test Case, User Flow, CLAUDE.md, .cursorrules (7개)

## 문서 생성 규칙
- 문서가 준비되면 반드시 아래 형식으로 포함:

[DOCUMENT]
type: prd|api|db|test|flow|claude|cursor
label: 문서 이름
emoji: 적절한 이모지
(마크다운 내용)
[/DOCUMENT]

- 한 번에 하나씩만 생성
- 생성 후 다음 문서로 넘어갈지 물어볼 것

## 질문 스타일
- 한국어로 친근하게
- 간결하게 (2~3문장)
- 한 번에 1~2개 질문만`;

export async function POST(req: NextRequest) {
  const { messages, projectName, projectIdea, pmf } = await req.json();

  const pmfContext = pmf ? `
PMF 검증 결과:
- 문제: ${pmf.problem || "미입력"}
- 고객: ${pmf.customer || "미입력"}
- 가치: ${pmf.value || "미입력"}
- 시장: ${pmf.market || "미입력"}
- 타이밍: ${pmf.timing || "미입력"}` : "";

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT + `\n\n프로젝트명: ${projectName}\n아이디어: ${projectIdea}${pmfContext}`,
  });

  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1]?.content ?? "시작";

  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const rawContent = result.response.text();

    let content = rawContent;
    const docs: Array<{ type: string; label: string; emoji: string; markdown: string }> = [];

    // Extract all [DOCUMENT] blocks
    const docRegex = /\[DOCUMENT\]([\s\S]*?)\[\/DOCUMENT\]/g;
    let match;
    while ((match = docRegex.exec(rawContent)) !== null) {
      const block = match[1].trim();
      const lines = block.split("\n");
      const typeLine = lines.find((l) => l.startsWith("type:"));
      const labelLine = lines.find((l) => l.startsWith("label:"));
      const emojiLine = lines.find((l) => l.startsWith("emoji:"));
      const type = typeLine?.split(":")[1]?.trim() ?? "prd";
      const label = labelLine?.split(":")[1]?.trim() ?? "문서";
      const emoji = emojiLine?.split(":")[1]?.trim() ?? "📄";
      // markdown is everything after the metadata lines
      const metaEnd = lines.findIndex((l) =>
        !l.startsWith("type:") && !l.startsWith("label:") && !l.startsWith("emoji:") && l.trim() !== ""
      );
      const markdown = metaEnd >= 0 ? lines.slice(metaEnd).join("\n").trim() : "";
      docs.push({ type, label, emoji, markdown });
      content = content.replace(match[0], "").trim();
    }

    return NextResponse.json({ content, docs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI 응답 오류" }, { status: 500 });
  }
}
