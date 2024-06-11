import { HttpLink } from "@apollo/client";
import {
    NextSSRInMemoryCache,
    NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { graphqlUrl } from "@/constant";

// use like getClient().query
export const { getClient } = registerApolloClient(() => {
    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link: new HttpLink({
            // https://studio.apollographql.com/public/spacex-l4uc6p/
            uri: graphqlUrl,
            // you can disable result caching here if you want to
            // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
            // fetchOptions: { cache: "no-store" },
            headers: {
                ...(localStorage.getItem("token") ? {
                    "Authorization": localStorage.getItem("token")!
                } : {})
            }
        }),
    });
});