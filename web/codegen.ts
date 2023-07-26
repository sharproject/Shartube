
import type { CodegenConfig } from '@graphql-codegen/cli';
import { graphqlUrl } from './src/constant';


const config: CodegenConfig = {
  overwrite: true,
  schema: graphqlUrl,
  documents: "src/graphql-client/**/*.graphql",
  generates: {
    "src/generated/graphql/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
