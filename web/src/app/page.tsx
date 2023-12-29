'use client'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { TopViewComicsQueryDocument } from '../util/rawSchemaDocument'
import { ComicCard } from '../components/ComicCard'
import { DefaultComicCard } from '../components/DefaultComicCard'
import { ComicCardDataInput } from '../types'
import MainWrapper from '../components/Wrapper'
import { LoadingScreen } from '../components/LoadingScreen'

export default function Home() {
	const [comicCardPerLine, setComicCardPerLine] = useState(4)
	// calculate comic card per line by screen width
	useEffect(() => {
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

	const { data: comics, loading: comicsLoading } = useQuery(
		TopViewComicsQueryDocument
	)
	const comicData = (
		comics ? [...comics.TopViewComic, ...comics.TopViewShortComics] : []
	).sort((a, b) => a?.createdAt - b?.createdAt)

	return (
		<div>
			{comicsLoading ? (
				<LoadingScreen></LoadingScreen>
			) : (
				<MainWrapper>
					<div
					// style={{
					// 	overflowY: 'auto',
					// 	padding: '20px',
					// }}
					>
						{/* <div className='flex content-center justify-center'>
							<DefaultComicCard></DefaultComicCard>
							<DefaultComicCard></DefaultComicCard>
							<DefaultComicCard></DefaultComicCard>
							<DefaultComicCard></DefaultComicCard>
						</div> */}
						<ListComic
							data={comicData}
							comicCardPerLine={comicCardPerLine}
						></ListComic>
					</div>
				</MainWrapper>
			)}
		</div>
	)
}

function ListComic(props: {
	data: (ComicCardDataInput | null)[]
	comicCardPerLine: number
}) {
	let result = [] as JSX.Element[][]
	let current: JSX.Element[] = []
	props.data.map((value, index) => {
		if (!value) return
		current.push(<ComicCard comic={value} key={index}></ComicCard>)
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
					<div className='flex items-center justify-center' key={key}>
						{value}
					</div>
				)
			})}
		</div>
	)
}
