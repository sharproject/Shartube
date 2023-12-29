'use client'
import { CreateComicPopup } from '../../components/CreateComicPopup'
import MainWrapper from '../../components/Wrapper'
import { LogoLoading } from '../../components/logo'
import { useCheckAuth } from '../../hooks/useCheckAuth'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { data: AuthData, loading: AuthLoading } = useCheckAuth({
		unAuthRedirectTo: '/login',
	})

	return (
		<div>
			{AuthLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				<MainWrapper>
					{children}
					<CreateComicPopup></CreateComicPopup>
				</MainWrapper>
			)}
		</div>
	)
}
