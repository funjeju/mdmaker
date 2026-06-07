import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `당신은 스타트업 PMF(Product-Market Fit) 검증 코치입니다.
사용자가 PMF 질문에 답변을 입력하면, 그 답변을 분석하고 더 정교하게 만들도록 돕습니다.

## 역할
- 답변의 강점과 약점을 간결하게 짚어줍니다
- 더 구체적으로 만들 수 있는 핵심 질문 1~2개만 합니다
- 개선된 답변 예시를 짧게 제안합니다
- 전체 응답은 200자 이내로 간결하게 유지합니다

## 질문 유형별 체크포인트
- Problem: 구체적인 상황/빈도/고통의 크기가 있는가?
- Customer: 특정 직군/규모/상황이 명확한가?
- Value: 기존 대안 대비 차별점이 수치로 표현되는가?
- Market: 시장 규모와 성장률이 근거 있는 수치인가?
- Timing: 지금이어야 하는 외부 환경 변화가 있는가?

## 응답 형식
**분석:** (1~2문장)
**질문:** (1~2개 핵심 질문)
**제안:** (개선 방향 한 줄)`;

export async function POST(req: NextRequest) {
  const { questionKey, questionTitle, answer, projectName, allAnswers } = await req.json();

  if (!answer?.trim()) {
    return NextResponse.json({ error: "답변이 없습니다" }, { status: 400 });
  }

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const context = allAnswers
    ? Object.entries(allAnswers)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    : "";

  const prompt = `프로젝트: ${projectName || "미정"}
질문: ${questionTitle}
사용자 답변: ${answer}
${context ? `\n이전 답변들:\n${context}` : ""}

위 답변을 분석하고 코칭해주세요.`;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    return NextResponse.json({ content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI 응답 오류" }, { status: 500 });
  }
}
