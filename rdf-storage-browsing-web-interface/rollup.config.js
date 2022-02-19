import vue from "rollup-plugin-vue";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import modify from "rollup-plugin-modify";
import copy from "rollup-plugin-copy-assets";
import css from "rollup-plugin-css-only";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/index.js",
    output: [
      {
        format: "esm",
        file: "dist/library.mjs",
        sourcemap: true,
      },
      {
        format: "cjs",
        file: "dist/library.js",
        sourcemap: true,
      },
    ],
    plugins: [
      vue({ css: true, compileTemplate: true }),
      resolve(),
      peerDepsExternal(),
      modify({ "..assets/hourglass.gif": "./assets/hourglass.gif" }),
      commonjs(),
      css({ output: "bundle.css" }),
      copy({
        assets: [
          // You can include directories
          "src/assets",
        ],
      }),
    ],
  },
];
