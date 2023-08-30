'use client'
import React, { useEffect, useState } from 'react'
import { useCheckAuth } from '../../hooks/useCheckAuth'
import { Navbar } from '../../components/Navbar/Navbar'
import { LogoLoading } from '../../components/logo'
import styles from './page.module.css'
import { ComicCardDashboard } from '../../components/ComicCardDashboard'
export default function MainDashboard() {
	const { data: AuthData, loading: AuthLoading } = useCheckAuth({
		unAuthRedirectTo: '/login',
	})
	const [height, setHeight] = useState(0)
	const [heightContain, setHeightContain] = useState(0)
	const [comicCardPerLine, setComicCardPerLine] = useState(4)

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
				<main className={styles.main}>
					<Navbar
						height={height}
						key='shar-secure'
						userInfo={AuthData}
						search={false}
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
							data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
							comicCardPerLine={comicCardPerLine}
						></ListComicDashboard>
					</div>
				</main>
			)}
		</div>
	)
}

export function ListComicDashboard(props: {
	data: any[]
	comicCardPerLine: number
}) {
	let result = [] as JSX.Element[][]
	let current: JSX.Element[] = []
	props.data.map((value, index) => {
		current.push(<ComicCardDashboard></ComicCardDashboard>)
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
