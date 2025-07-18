// eslint.config.mjs
import globals from 'globals';
import js from '@eslint/js';

export default [
  // Aplica as configurações recomendadas para JavaScript
  js.configs.recommended,

  {
    languageOptions: {
      globals: {
        // Define que as variáveis globais do Node.js são permitidas
        ...globals.node,
      },
      ecmaVersion: 'latest', // Habilita a sintaxe mais recente do JavaScript
      sourceType: 'module', // Indica que você está usando import/export
    },
    rules: {
      // Você pode desligar ou modificar regras aqui, se quiser.
      // Exemplo: para permitir o uso de console.log sem avisos
      "no-console": "off",
    },
  },
];