import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";
import boundaries, {
  type Config,
  type Rules,
  type Settings,
} from "eslint-plugin-boundaries";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },

    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts}"],
    plugins: {
      boundaries,
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      "boundaries/dependencies": [
        2,
        {
          default: "disallow",
          rules: [
            {
              from: { type: "controller" },
              allow: [{ type: "model" }, { type: "view" }],
            },
            {
              from: { type: "view" },
              allow: [{ type: "model" }],
            },
            {
              from: { type: "model" },
              disallow: [{ type: "*" }],
            },
          ],
        },
      ],
    } satisfies Rules,
    settings: {
      "boundaries/elements": [
        { type: "controller", pattern: "controllers/*" },
        { type: "model", pattern: "models/*" },
        { type: "view", pattern: "views/*" },
      ],
    } satisfies Settings,
  } satisfies Config,
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/commonmark",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
]);
