"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import MarkdownPanel from "@/components/MarkdownPanel";
import TopBar from "@/components/TopBar";

export default function Home() {
  // Global state for prototype (in a real app, use Context or Zustand)
  const [activeDocument, setActiveDocument] = useState("CORE.md");
  const [markdownContent, setMarkdownContent] = useState("# CORE.md\n\n이 문서는 프로젝트의 기준점입니다.");
  const [progress, setProgress] = useState(15);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      <TopBar progress={progress} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Document Tree */}
        <Sidebar activeDocument={activeDocument} setActiveDocument={setActiveDocument} />

        {/* Center Panel: AI Chat */}
        <ChatPanel 
          activeDocument={activeDocument} 
          setMarkdownContent={setMarkdownContent}
          setProgress={setProgress}
        />

        {/* Right Panel: Markdown Preview & Editor */}
        <MarkdownPanel 
          activeDocument={activeDocument}
          markdownContent={markdownContent} 
          setMarkdownContent={setMarkdownContent} 
        />
      </div>
    </div>
  );
}
