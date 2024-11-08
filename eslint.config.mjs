import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier'; // Importa o plugin prettier
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
  eslintConfigPrettier, // Desativa regras que podem entrar em conflito com o Prettier
  {
    plugins: {
      prettier: prettierPlugin, // Configuração do plugin prettier no formato plano
    },
    rules: {
      'prettier/prettier': 'error', // Ativa o Prettier como um erro de linting
    },
  },
];
