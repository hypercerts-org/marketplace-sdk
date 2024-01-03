import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import bundleSize from "rollup-plugin-bundle-size";
import dotenv from "rollup-plugin-dotenv";
import pkg from "./package.json";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
  ],
  plugins: [
    dotenv.default(),
    copy({
      targets: [{ src: "src/abis/**/*", dest: "dist/abis" }],
    }),
    json(),
    typescript({ tsconfig: "./tsconfig.build.json" }),
    bundleSize(),
  ],
};
