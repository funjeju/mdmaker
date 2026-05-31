"use client";

import { FileText, ChevronRight, Folder } from "lucide-react";

const DOCUMENTS = [
  { id: "CORE.md", title: "CORE.md", status: "completed" },
  { id: "PRODUCT.md", title: "PRODUCT.md", status: "in-progress" },
  { id: "USER_FLOW.md", title: "USER_FLOW.md", status: "waiting" },
  { id: "IA_SCREEN.md", title: "IA_SCREEN.md", status: "waiting" },
  { id: "FEATURE_SPEC.md", title: "FEATURE_SPEC.md", status: "waiting" },
  { id: "DB_API.md", title: "DB_API.md", status: "waiting" },
  { id: "ARCHITECTURE.md", title: "ARCHITECTURE.md", status: "waiting" },
  { id: "DESIGN_SYSTEM.md", title: "DESIGN_SYSTEM.md", status: "waiting" },
  { id: "DEV_RULE.md", title: "DEV_RULE.md", status: "waiting" },
];

interface SidebarProps {
  activeDocument: string;
  setActiveDocument: (id: string) => void;
}

export default function Sidebar({ activeDocument, setActiveDocument }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-800 flex items-center gap-2 text-gray-300">
        <Folder className="w-4 h-4 text-indigo-400" />
        <span className="font-semibold text-sm">프로젝트 문서 구조</span>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {DOCUMENTS.map((doc) => {
          const isActive = activeDocument === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => setActiveDocument(doc.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive 
                  ? "bg-gray-800/50 text-indigo-400 border-r-2 border-indigo-500" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              <FileText className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-gray-500"}`} />
              <span className="flex-1 text-left">{doc.title}</span>
              {doc.status === "completed" && (
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              )}
              {doc.status === "in-progress" && (
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse"></div>
              )}
              {doc.status === "waiting" && (
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              )}
            </button>
          );
        })}
      </div>
      <div className="p-4 bg-gray-900 border-t border-gray-800 text-xs text-gray-500">
        문서 생성 순서는 품질을 위해 위에서 아래로 강제됩니다. (8단계)
      </div>
    </aside>
  );
}
