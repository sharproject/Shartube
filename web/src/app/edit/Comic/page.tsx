'use client'
import { ComicCardDashboard } from '@/components/ComicCardDashboard'
import { useCheckAuth } from '@/hooks/useCheckAuth'
import { ComicCardDataInput } from '@/types'
import { useEffect, useState } from 'react'
export default function ShortComic() {
	const { data: AuthData } = useCheckAuth({
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
	const comicData = AuthData?.Me.profile ? [...AuthData?.Me.profile.comics] : []
	return (
		<>
			<h1 className='mb-4 text-3xl text-white'>Comic edit page</h1>

			<ListComicDashboard
				data={comicData}
				comicCardPerLine={comicCardPerLine}
			></ListComicDashboard>
		</>
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
		<>
			{result.map((value, key) => {
				return (
					<div className='' key={key}>
						{' '}
						{/** flex content-center justify-center*/}
						{value}
					</div>
				)
			})}
		</>
	)
}
