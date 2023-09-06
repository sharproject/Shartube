'use client';
import { ApolloLink, HttpLink, SuspenseCache } from '@apollo/client'
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
		headers: {
			...(localStorage?.getItem('token')
				? {
						Authorization: localStorage.getItem('token')!,
				  }
				: {}),
		},
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

function makeSuspenseCache() {
	return new SuspenseCache()
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
	return (
		<ApolloNextAppProvider
			makeClient={makeClient}
		>
			{children}
		</ApolloNextAppProvider>
	)
}
