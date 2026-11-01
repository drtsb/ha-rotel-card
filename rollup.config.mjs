import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/rotel-amplifier-card.ts",
    output: {
      file: "rotel-card.js",
      format: "es",
      inlineDynamicImports: true
    },
    plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json" })],
  },
  {
    input: "src/rotel-amplifier-card-editor.ts",
    output: {
      file: "rotel-card-editor.js",
      format: "es",
      inlineDynamicImports: true
    },
    plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json" })],
  },
];
