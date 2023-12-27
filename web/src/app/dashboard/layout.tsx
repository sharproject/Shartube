import { CreateComicPopup } from '../../components/CreateComicPopup'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			{children}
			<CreateComicPopup></CreateComicPopup>
		</>
	)
}
