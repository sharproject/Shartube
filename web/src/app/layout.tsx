import './globals.css'
import { Roboto } from 'next/font/google'
import ApolloWrapper from '@/libs/apollo-wrapper'
import { SidebarNavbarProvider } from '../context/SidebarNavbar'
// import { Navbar } from '../components/Navbar/Navbar'

const roboto = Roboto({
	subsets: ['latin', 'vietnamese'],
	weight: '100',
})

export const metadata = {
	title: 'Shartube',
	description: 'Online sharing platform',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {

	return (
		<html lang='en' suppressHydrationWarning={true}>
			<body className={`${roboto.className}`} suppressHydrationWarning={true}>
				<ApolloWrapper>
					<SidebarNavbarProvider>
						{/* <Navbar key='shar-secure' /> */}
						{children}
					</SidebarNavbarProvider>
				</ApolloWrapper>
			</body>
		</html>
	)
}
