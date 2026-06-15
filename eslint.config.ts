/// <reference types="node" />

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import css from "@eslint/css";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import boundaries, {
  type Config,
  type Rules,
  type Settings,
} from "eslint-plugin-boundaries";
import globals from "globals";
import tseslint from "typescript-eslint";

const rootPath = dirname(fileURLToPath(import.meta.url));

const boundariesSettings = {
  "boundaries/root-path": rootPath,
  "boundaries/include": ["src/**/*.ts"],
  "boundaries/elements": [
    {
      type: "test",
      pattern: ["src/test/**/*.ts", "src/**/*.test.ts"],
      mode: "full",
    },
    {
      type: "generated-prisma",
      pattern: "src/generated/prisma/**/*.ts",
      mode: "full",
    },
    { type: "types", pattern: "src/@types/**/*.ts", mode: "full" },
    { type: "core", pattern: "src/core/**/*.ts", mode: "full" },
    {
      type: "enterprise",
      pattern: "src/domain/*/enterprise/**/*.ts",
      mode: "full",
      capture: ["context"],
    },
    {
      type: "application",
      pattern: "src/domain/*/application/**/*.ts",
      mode: "full",
      capture: ["context"],
    },
    { type: "presentation", pattern: "src/http/**/*.ts", mode: "full" },
    {
      type: "infrastructure",
      pattern: ["src/lib/**/*.ts", "src/env/**/*.ts"],
      mode: "full",
    },
  ],
} satisfies Settings;

const resolverSettings = {
  "import/resolver": {
    typescript: {
      project: "./tsconfig.json",
      alwaysTryTypes: true,
    },
  },
};

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },

    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: {
      boundaries,
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      "boundaries/dependencies": [
        "warn",
        {
          default: "disallow",
          checkAllOrigins: true,
          checkUnknownLocals: true,
          rules: [
            {
              allow: [{ to: { origin: "external" } }],
            },
            {
              allow: [{ to: { origin: "core" } }],
            },
            {
              from: { type: "enterprise" },
              disallow: [
                {
                  to: { origin: "external" },
                  dependency: {
                    module: [
                      "fastify",
                      "@prisma/client",
                      "@prisma/adapter-pg",
                      "dotenv",
                    ],
                  },
                },
              ],
            },
            {
              from: { type: "core" },
              allow: [{ to: { type: "core" } }, { to: { type: "types" } }],
            },
            {
              from: { type: "enterprise" },
              allow: [
                {
                  to: {
                    type: "enterprise",
                    captured: { context: "{{ from.captured.context }}" },
                  },
                },
                { to: { type: "core" } },
                { to: { type: "types" } },
                { to: { type: "generated-prisma" } },
              ],
            },
            {
              from: { type: "application" },
              allow: [
                {
                  to: {
                    type: "application",
                    captured: { context: "{{ from.captured.context }}" },
                  },
                },
                {
                  to: {
                    type: "enterprise",
                    captured: { context: "{{ from.captured.context }}" },
                  },
                },
                { to: { type: "core" } },
                { to: { type: "types" } },
                { to: { type: "generated-prisma" } },
              ],
            },
            {
              from: { type: "presentation" },
              allow: [
                { to: { type: "application" } },
                { to: { type: "enterprise" } },
                { to: { type: "core" } },
                { to: { type: "types" } },
                { to: { type: "generated-prisma" } },
              ],
            },
            {
              from: { type: "infrastructure" },
              allow: [
                { to: { type: "application" } },
                { to: { type: "enterprise" } },
                { to: { type: "core" } },
                { to: { type: "types" } },
                { to: { type: "infrastructure" } },
                { to: { type: "generated-prisma" } },
              ],
            },
            {
              from: { type: "test" },
              allow: [
                { to: { type: "application" } },
                { to: { type: "enterprise" } },
                { to: { type: "core" } },
                { to: { type: "types" } },
                { to: { type: "infrastructure" } },
                { to: { type: "presentation" } },
                { to: { type: "test" } },
                { to: { type: "generated-prisma" } },
              ],
            },
          ],
        },
      ],
    } satisfies Rules,
    settings: {
      ...boundariesSettings,
      ...resolverSettings,
    },
  } satisfies Config,
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
]);
