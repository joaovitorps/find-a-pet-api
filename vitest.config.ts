import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, "./dist"],
    dir: "src",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["**/*.unit.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          include: ["**/*.e2e.test.ts"],
          fileParallelism: false,
        },
      },
    ],
  },
});
