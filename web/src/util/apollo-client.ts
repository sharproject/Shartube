import { ApolloClient, InMemoryCache } from "@apollo/client";
import { graphqlUrl } from "../../codegen"

const client = new ApolloClient({
    uri: graphqlUrl,
    cache: new InMemoryCache(),
});

export default client;