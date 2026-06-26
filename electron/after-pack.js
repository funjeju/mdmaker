// electron-builder afterPack 훅: standalone의 node_modules를 패키지에 직접 복사
// (electron-builder가 extraResources에서 node_modules를 누락하는 문제 대비)
const fs = require("fs");
const path = require("path");

exports.default = async function afterPack(context) {
  const root = process.cwd();
  const src = path.join(root, ".next", "standalone", "node_modules");
  const dst = path.join(context.appOutDir, "resources", "standalone", "node_modules");

  if (!fs.existsSync(src)) {
    console.warn("[afterPack] 원본 standalone/node_modules 없음 — 건너뜀");
    return;
  }
  fs.cpSync(src, dst, { recursive: true });
  const count = fs.readdirSync(dst).length;
  console.log(`[afterPack] node_modules 복사 완료 (${count}개) → ${dst}`);
};
