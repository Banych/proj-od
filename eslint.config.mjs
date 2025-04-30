import { FlatCompat } from '@eslint/eslintrc'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintCssPlugin from 'eslint-plugin-css'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier/prettier',
    'plugin:react/recommended',
    'plugin:css/standard',
    'plugin:prettier/recommended',
    'plugin:@next/next/recommended'
  ),
  eslintCssPlugin.configs['flat/standard'],
  eslintConfigPrettier,
  {
    ignores: ['node_modules/**/*', '.next/**/*', 'out/**/*'],
    files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
]

export default config
