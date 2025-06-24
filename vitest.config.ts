import svgr from "@svgr/rollup";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    // SVGO is disabled because it messes up with some icons by removing intermediate tags.
    svgr({ icon: true, svgo: false }),
  ],

  build: {
    minify: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      enabled: true,
      clean: true,
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
    },
  },
});
