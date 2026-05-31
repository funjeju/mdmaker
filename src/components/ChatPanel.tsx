"use client";

import { useState } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";

interface ChatPanelProps {
  activeDocument: string;
  setMarkdownContent: (content: string) => void;
  setProgress: (val: number) => void;
}

type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
  reasoning?: string;
};

export default function ChatPanel({ activeDocument, setMarkdownContent, setProgress }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content: "안녕하세요! 대화형 MD 파일 생성기입니다. 무엇을 만들고 싶으신가요? (예: 혼자 쓰는 일기장, 여러 사람이 쓰는 팀 협업 툴 등)",
      reasoning: "1단계 공통 사전 질문을 통해 프로젝트 성격을 확정하기 위한 첫 번째 질문입니다."
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMsg: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");

    // Simulate AI response and Markdown update (MVP logic)
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: "좋습니다. 로그인이 필요한 기능인가요? 아니면 인증 없이 누구나 쓸 수 있는 서비스인가요?",
        reasoning: "인증 구조(Firebase Auth 등) 도입 여부를 결정하기 위한 질문입니다."
      };
      setMessages((prev) => [...prev, aiResponse]);
      
      // Update Markdown prototype
      setMarkdownContent(`# CORE.md\n\n## 프로젝트 성격\n- 대상: 여러 사용자\n- 목적: 팀 협업 툴\n\n_AI가 사용자의 응답을 기반으로 실시간으로 문서를 업데이트합니다._`);
      setProgress(30);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 relative">
      {/* Header */}
      <div className="h-14 border-b border-gray-800 flex items-center px-6 shrink-0 bg-gray-900/80 backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
        <h2 className="font-semibold text-gray-200">AI 기획 인터뷰</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-cyan-600" : "bg-indigo-600"
            }`}>
              {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            <div className={`flex flex-col max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.role === "user" 
                  ? "bg-gray-800 text-gray-100 rounded-tr-none border border-gray-700" 
                  : "bg-indigo-950/40 text-gray-100 rounded-tl-none border border-indigo-900/50"
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              {msg.reasoning && (
                <div className="mt-2 text-xs text-gray-500 bg-gray-800/50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {msg.reasoning}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSend} className="relative flex items-center max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="생활 언어로 편하게 답변해 주세요..."
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-full pl-6 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-500 text-sm shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-600 mt-2">
          기술 용어를 몰라도 AI가 개발 언어와 구조로 변환합니다.
        </p>
      </div>
    </div>
  );
}
