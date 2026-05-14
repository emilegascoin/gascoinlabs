import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Node-side code (serverless API + provider libs + a few server-side imports)
    files: ['api/**/*.js', 'src/lib/aiProvider.js', 'src/lib/aiProvider.test.js', 'src/lib/claudeContext.js', 'src/lib/providers/**/*.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
])
