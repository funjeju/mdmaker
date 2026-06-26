import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Electron 패키징용 자체 포함 서버 빌드 (.next/standalone/server.js)
  output: "standalone",
};

export default nextConfig;
