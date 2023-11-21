'use client'
import React, { useEffect, useState } from 'react'
import { useCheckAuth } from '../../hooks/useCheckAuth'
import { Navbar } from '../../components/Navbar/Navbar'
import { LogoLoading } from '../../components/logo'
import styles from './page.module.css'
import { ComicCardDashboard } from '../../components/ComicCardDashboard'
import { CreateComicPopup } from '../../components/CreateComicPopup'
import { TopComicDataInput } from '../../types'
export default function MainDashboard() {
	const { data: AuthData, loading: AuthLoading } = useCheckAuth({
		unAuthRedirectTo: '/login',
	})
	const [height, setHeight] = useState(0)
	const [heightContain, setHeightContain] = useState(0)
	const [comicCardPerLine, setComicCardPerLine] = useState(4)
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
	const comicData = AuthData?.Me.profile
		? [...AuthData?.Me.profile.comics, ...AuthData?.Me.profile.ShortComics]
		: []
	return (
		<div>
			{AuthLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				<main className={styles.main}>
					<Navbar
						height={height}
						key='shar-secure'
						userInfo={AuthData}
						search={false}
						handleCreateComicButton={() => setPopupOpen(true)}
					/>
					<div
						className={styles.mainContainer}
						style={{
							width: '100%',
							height: `calc(100vh - ${height}px)`,
							maxHeight: `${heightContain}px`,
							overflowY: 'auto',
							padding: '20px',
						}}
					>
						<ListComicDashboard
							data={comicData}
							comicCardPerLine={comicCardPerLine}
						></ListComicDashboard>
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

export function ListComicDashboard(props: {
	data: (TopComicDataInput | null)[]
	comicCardPerLine: number
}) {
	let result = [] as JSX.Element[][]
	let current: JSX.Element[] = []
	props.data.map((value, index) => {
		if (!value) return
		current.push(
			<ComicCardDashboard comic={value} key={index}></ComicCardDashboard>
		)
		if ((index + 1) % props.comicCardPerLine == 0) {
			result.push([...current])
			current = []
			return
		}
		if (index + 1 == props.data.length) {
			result.push([...current])
			current = []
		}
	})
	return (
		<>
			{result.map((value, key) => {
				return (
					<div className='flex content-center justify-center' key={key}>
						{value}
					</div>
				)
			})}
		</>
	)
}
