import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin'; // Corrigido para o plugin correto
import { eslintConfigPrettier } from 'eslint-config-prettier'; // Para desativar regras conflitantes com o Prettier
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Regras do Prettier
    plugins: ['prettier'],
    extends: [
      'plugin:prettier/recommended', // Usa a configuração recomendada do Prettier
      ...eslintConfigPrettier, // Desativa regras que podem entrar em conflito com o Prettier
    ],
    rules: {
      'prettier/prettier': 'error', // Ativa o Prettier como um erro de linting
    },
  },
];
