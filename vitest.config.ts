import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // 啟用 global API (describe, test, expect)
    globals: true,
    // 使用 jsdom 模擬瀏覽器環境
    environment: "jsdom",
    // 設定檔案路徑
    setupFiles: "./src/test/setup.ts",
    // 啟用 css
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "*.config.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
