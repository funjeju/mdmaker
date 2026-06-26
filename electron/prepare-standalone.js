// 패키징 전: Next standalone 빌드에 static·public·.env.local 복사 (standalone은 기본 미포함)
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const sa = path.join(root, ".next", "standalone");

if (!fs.existsSync(path.join(sa, "server.js"))) {
  console.error("[prepare-standalone] .next/standalone/server.js 가 없습니다. 먼저 next build 를 실행하세요.");
  process.exit(1);
}

function copy(src, dst) {
  if (fs.existsSync(src)) {
    fs.cpSync(src, dst, { recursive: true });
    console.log(`[prepare-standalone] 복사: ${path.relative(root, src)} → ${path.relative(root, dst)}`);
  }
}

copy(path.join(root, ".next", "static"), path.join(sa, ".next", "static"));
copy(path.join(root, "public"), path.join(sa, "public"));
copy(path.join(root, ".env.local"), path.join(sa, ".env.local"));

console.log("[prepare-standalone] 완료");
