"use client";

import { Edit3, Download, Save, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MarkdownPanelProps {
  activeDocument: string;
  markdownContent: string;
  setMarkdownContent: (val: string) => void;
}

export default function MarkdownPanel({ activeDocument, markdownContent, setMarkdownContent }: MarkdownPanelProps) {
  return (
    <div className="w-[450px] bg-gray-950 border-l border-gray-800 flex flex-col shrink-0 shadow-2xl z-20">
      {/* Header */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <h3 className="font-medium text-sm text-gray-200">{activeDocument}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="AI 재생성">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="저장">
            <Save className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="다운로드">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Real-time Preview */}
        <div className="flex-1 p-6 overflow-y-auto prose prose-invert prose-indigo max-w-none text-sm bg-gray-950">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
        
        {/* Manual Editor (Optional in MVP, but shown for step 7) */}
        <div className="h-1/3 border-t border-gray-800 bg-gray-900 flex flex-col">
          <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 bg-gray-900 flex justify-between">
            <span>수동 편집기</span>
            <span className="text-[10px]">MD 문법 지원</span>
          </div>
          <textarea
            className="flex-1 bg-transparent p-4 text-sm text-gray-300 focus:outline-none resize-none font-mono"
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
