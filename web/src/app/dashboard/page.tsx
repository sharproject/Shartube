'use client'
import React, { useEffect, useState } from 'react'
import { useCheckAuth } from '../../hooks/useCheckAuth'
import { ComicCardDashboard } from '../../components/ComicCardDashboard'
import { ComicCardDataInput } from '../../types'
import MainWrapper from '../../components/Wrapper'
import { LoadingScreen } from '../../components/LoadingScreen'
export default function MainDashboard() {
	const { data: AuthData, loading: AuthLoading } = useCheckAuth({
		unAuthRedirectTo: '/login',
		authRedirectTo: '/dashboard',
	})
	const [comicCardPerLine, setComicCardPerLine] = useState(4)

	// calculate comic card per line by screen width
	useEffect(() => {
		// remove all event listener
		window.removeEventListener

		// on change screen width
		// set comic card per line
		// 1, 2, 3, 4
		// 768, 1024, 1280, 1536
		window.addEventListener('resize', () => {
			const screenWidth = window.innerWidth
			if (screenWidth <= 768) {
				setComicCardPerLine(1)
			} else if (screenWidth <= 1024) {
				setComicCardPerLine(2)
			} else if (screenWidth <= 1280) {
				setComicCardPerLine(3)
			} else if (screenWidth <= 1536) {
				setComicCardPerLine(4)
			}
		})
	}, [])
	console.log(comicCardPerLine)

	const comicData = (
		AuthData?.Me.profile
			? [...AuthData?.Me.profile.comics, ...AuthData?.Me.profile.ShortComics]
			: []
	).sort((a, b) => a?.createdAt - b?.createdAt)
	return (
		<div>
			{AuthLoading ? (
				<LoadingScreen></LoadingScreen>
			) : (
				<MainWrapper>
					<div
					// className={`overflow-y-auto p-5`}
					>
						<ListComicDashboard
							data={comicData}
							comicCardPerLine={comicCardPerLine}
						></ListComicDashboard>
					</div>
				</MainWrapper>
			)}
		</div>
	)
}

function ListComicDashboard(props: {
	data: (ComicCardDataInput | null)[]
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
		<div className='mt-4'>
			{result.map((value, key) => {
				return (
					<div className='flex content-center justify-center' key={key}>
						{value}
					</div>
				)
			})}
		</div>
	)
}
