import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This app's data-fetching pattern is the standard "set loading, fetch
      // in an effect, set data on resolve" pattern used throughout every
      // dashboard/list page. The React Compiler-era set-state-in-effect rule
      // flags that pattern universally; we deliberately keep it as a warning
      // rather than rewriting ~20 pages onto a different data-fetching
      // strategy for a non-blocking style preference.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
