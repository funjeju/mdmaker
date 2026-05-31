"use client";

import { CheckCircle2, UserCircle } from "lucide-react";

export default function TopBar({ progress }: { progress: number }) {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          MD Maker
        </h1>
        <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400 border border-gray-700 ml-2">
          MVP Prototype
        </span>
      </div>

      {/* Progress Bar Area (Step 5) */}
      <div className="flex-1 max-w-xl mx-8 hidden md:flex flex-col gap-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>명세 완성도 (질문 공정률)</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-300 hover:text-white transition-colors">
          프로젝트 저장
        </button>
        <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700">
          <UserCircle className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </header>
  );
}
