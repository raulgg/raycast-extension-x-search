import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubGlobals: true,
    setupFiles: ["./tests/console.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/**/*.test.{ts,tsx}"],
          environment: "node",
          env: { TZ: "America/Los_Angeles" },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./extension/src"),
    },
  },
});
