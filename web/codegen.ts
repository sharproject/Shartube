
import type { CodegenConfig } from '@graphql-codegen/cli';

export const graphqlUrl = "http://localhost:8080/api/graphql" // "http://172.22.184.129:8081/api/graphql"

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
