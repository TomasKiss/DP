// rollup.config.js
import fs from "fs";
import path from "path";
import vue from "rollup-plugin-vue";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import PostCSS from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import minimist from "minimist";
import modify from "rollup-plugin-modify";
import copy from "rollup-plugin-copy-assets";
import css from "rollup-plugin-css-only";

// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs
  .readFileSync("./.browserslistrc")
  .toString()
  .split("\n")
  .filter((entry) => entry && entry.substring(0, 2) !== "ie");

// Extract babel preset-env config, to combine with esbrowserslist
const babelPresetEnvConfig = require("../babel.config").presets.filter(
  (entry) => entry[0] === "@babel/preset-env"
)[0][1];

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, "..");

const baseConfig = {
  input: "src/entry.js",
  plugins: {
    preVue: [
      alias({
        entries: [
          {
            find: "@",
            replacement: `${path.resolve(projectRoot, "src")}`,
          },
        ],
      }),
    ],
    replace: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    vue: {},
    postVue: [
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
      }),
      // Process only `<style module>` blocks.
      PostCSS({
        modules: {
          generateScopedName: "[local]___[hash:base64:5]",
        },
        include: /&module=.*\.css$/,
      }),
      // Process all `<style>` blocks except `<style module>`.
      PostCSS({ include: /(?<!&module=.*)\.css$/ }),
      commonjs(),
    ],
    babel: {
      exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
      babelHelpers: "bundled",
    },
  },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  "vue",
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: "Vue",
};

// Customize configs for individual targets
const buildFormats = [];
if (!argv.format || argv.format === "es") {
  const esConfig = {
    ...baseConfig,
    input: "src/entry.esm.js",
    external,
    output: {
      file: "dist/rdf-storage-browsing-web-interface.esm.js",
      format: "esm",
      exports: "named",
    },
    plugins: [
      modify({
        "require('../assets/hourglass.gif')":
          "require('./assets/hourglass.gif')",
      }),
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      css({ output: "bundle.css" }),
      copy({
        assets: [
          // You can include directories
          "src/assets",
        ],
      }),
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            "@babel/preset-env",
            {
              ...babelPresetEnvConfig,
              targets: esbrowserslist,
            },
          ],
        ],
      }),
    ],
  };
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === "cjs") {
  const umdConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: "dist/rdf-storage-browsing-web-interface.ssr.js",
      format: "cjs",
      name: "RdfStorageBrowsingWebInterface",
      exports: "auto",
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      css({ output: "bundle.css" }),
      copy({
        assets: [
          // You can include directories
          "src/assets",
        ],
      }),
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel(baseConfig.plugins.babel),
      modify({ "..assets/hourglass.gif": "./assets/hourglass.gif" }),
    ],
  };
  buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === "iife") {
  const unpkgConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: "dist/rdf-storage-browsing-web-interface.min.js",
      format: "iife",
      name: "RdfStorageBrowsingWebInterface",
      exports: "auto",
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      css({ output: "bundle.css" }),
      copy({
        assets: [
          // You can include directories
          "src/assets",
        ],
      }),
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel(baseConfig.plugins.babel),
      terser({
        output: {
          ecma: 5,
        },
      }),
      modify({ "..assets/hourglass.gif": "./assets/hourglass.gif" }),
    ],
  };
  buildFormats.push(unpkgConfig);
}

// Export config
export default buildFormats;
