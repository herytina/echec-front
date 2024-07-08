// .eslintrc.js
module.exports = {
  env: {
    node: true, // Ajoutez cette ligne pour définir l'environnement Node.js
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false, // Désactive la vérification du fichier de configuration
    ecmaVersion: 2020,
    sourceType: "module"
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended"
  ],
  rules: {
    // Ajoutez vos règles personnalisées ici
  }
};
