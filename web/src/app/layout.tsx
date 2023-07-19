'use client'
import './globals.css'
import { Inter, Roboto } from 'next/font/google'
import { ApolloProvider } from '@apollo/client'
import client from '@/util/apollo-client'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })
const roboto = Roboto({
	subsets: ['latin', 'vietnamese'],
	weight: '100',
})

export const metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body className={`${inter.className} ${roboto.className}`}>
				<ApolloProvider client={client}>{children}</ApolloProvider>
			</body>
		</html>
	)
}