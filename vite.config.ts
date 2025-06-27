import { peerDependencies, name } from "./package.json";

import { defineConfig } from "vite";

import svgr from "@svgr/rollup";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // SVGO is disabled because it messes up with some icons by removing intermediate tags.
    svgr({ icon: true, svgo: false }),
    tsConfigPaths(),
  ],

  build: {
    lib: {
      entry: {
        index: "src/index.tsx",
      },
      name,
      formats: ["es"],
      fileName: (format, entryName) =>
        entryName === "index" ? `${entryName}.${format}.js` : `${entryName}/${entryName}.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: Object.keys(peerDependencies),
    },
  },
});
