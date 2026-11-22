import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default [
  {
    input: "src/rotel-amplifier-card.ts",
    output: {
      file: "rotel-card.js",
      format: "es",
      inlineDynamicImports: true
    },
    plugins: [resolve(), json(), typescript({ tsconfig: "./tsconfig.json" })],
  },
  {
    input: "src/rotel-card-editor.ts",
    output: {
      file: "rotel-card-editor.js",
      format: "es",
      inlineDynamicImports: true
    },
    plugins: [resolve(), json(), typescript({ tsconfig: "./tsconfig.json" })],
  },
];
