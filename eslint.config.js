import globals from "globals";
import pluginJs from "@eslint/js";
import babelParser from "@babel/eslint-parser";

export default [
  {
    languageOptions: { 
      parser: babelParser,
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.es2024
      } 
    }
  },
  
  pluginJs.configs.recommended,
];