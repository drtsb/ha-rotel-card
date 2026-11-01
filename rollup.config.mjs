import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
  { input: "src/rotel-amplifier-card.ts", output: { file: "dist/rotel-amplifier-card.js", format: "es" }, plugins: [resolve(), typescript()] },
  { input: "src/rotel-amplifier-card-editor.ts", output: { file: "dist/rotel-amplifier-card-editor.js", format: "es" }, plugins: [resolve(), typescript()] },
];
