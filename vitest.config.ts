import svgr from "@svgr/rollup";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    // SVGO is disabled because it messes up with some icons by removing intermediate tags.
    svgr({ icon: true, svgo: false }),
    tsConfigPaths(),
  ],

  build: {
    minify: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    alias: {
      "~": "/src",
      "#": "/__test__",
    },
    server: {
      deps: {
        // Mock the tolgee instance used by the UI components.
        inline: ["@a-novel/package-ui", "@a-novel/nodelib"],
      },
    },
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
