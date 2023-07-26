'use client';
import { ApolloLink, HttpLink } from '@apollo/client'
import {
	ApolloNextAppProvider,
	NextSSRApolloClient,
	NextSSRInMemoryCache,
	SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { graphqlUrl } from '@/constant';

function makeClient() {
	const httpLink = new HttpLink({
		// https://studio.apollographql.com/public/spacex-l4uc6p/
		uri: graphqlUrl,
	})

	return new NextSSRApolloClient({
		cache: new NextSSRInMemoryCache(),
		link:
			typeof window === 'undefined'
				? ApolloLink.from([
						new SSRMultipartLink({
							stripDefer: true,
						}),
						httpLink,
				  ])
				: httpLink,
	})
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	)
}
