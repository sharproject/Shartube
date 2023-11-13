'use client'
import { useEffect, useState } from 'react'
import { CreateComicPopup } from '../../components/CreateComicPopup'
import { Navbar } from '../../components/Navbar/Navbar'
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
	const [height, setHeight] = useState(0)
	const [heightContain, setHeightContain] = useState(0)
	const [isPopupOpen, setPopupOpen] = useState(false)

	useEffect(() => {
		if (window !== undefined) {
			window.addEventListener('resize', () => {
				setHeight((window.innerHeight * 1) / 11.5)
				setHeightContain(window.innerHeight - height)
			})
			setHeight((window.innerHeight * 1) / 11.5)
			setHeightContain(window.innerHeight - height)
		}
	}, [height])

	return (
		<div>
			{AuthLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				<main className='bg-[#141518]'>
					<Navbar
						height={height}
						key='shar-secure'
						userInfo={AuthData}
						search={false}
						handleCreateComicButton={() => setPopupOpen(true)}
					/>
					<div
						style={{
							width: '100%',
							height: `calc(100vh - ${height}px)`,
							maxHeight: `${heightContain}px`,
							overflowY: 'auto',
							padding: '20px',
						}}
					>
						{children}
						<CreateComicPopup
							isOpen={isPopupOpen}
							setIsOpen={setPopupOpen}
						></CreateComicPopup>
					</div>
				</main>
			)}
		</div>
	)
}
