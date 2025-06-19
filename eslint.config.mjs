import { FlatCompat } from '@eslint/eslintrc'
import eslintConfigPrettier from 'eslint-config-prettier'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // Extend recommended configs
  ...compat.extends(
    'next/core-web-vitals', // Next.js rules
    'next/typescript', // Next.js TypeScript rules
    'plugin:react/recommended', // React best practices
    'plugin:react-hooks/recommended', // React hooks rules
    'plugin:@typescript-eslint/recommended' // TypeScript rules
  ),

  // Disable ESLint formatting rules that conflict with Prettier
  eslintConfigPrettier,

  {
    // File patterns and ignores
    ignores: [
      'node_modules/**/*',
      '.next/**/*',
      'out/**/*',
      'generated/**/*', // Prisma generated files
      '*.config.js', // Config files
      '*.config.mjs',
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],

    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js 13+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // General rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'error',
      'no-debugger': 'error',

      // Import rules
      'no-duplicate-imports': 'error',

      // Next.js specific
      '@next/next/no-img-element': 'error',
    },
  },
]

export default config
