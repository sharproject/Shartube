'use client'
import { Navbar } from '@/components/Navbar/Navbar'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { LogoLoading } from '../components/logo'
import { useQuery } from '@apollo/client'
import {
	TopViewComicsQueryDocument,
	meQueryDocument,
} from '../util/rawSchemaDocument'
import { ComicCard } from '../components/ComicCard'
import { DefaultComicCard } from '../components/DefaultComicCard'
import { ComicCardDataInput } from '../types'
import MainWrapper from '../components/Wrapper'

export default function Home() {
	const { data: AuthData, loading: AuthLoading } = useQuery(meQueryDocument)
	const [heightContain, setHeightContain] = useState(0)
	const [comicCardPerLine, setComicCardPerLine] = useState(4)

	const { data: comics, loading: comicsLoading } = useQuery(
		TopViewComicsQueryDocument
	)
	const comicData = (
		comics ? [...comics.TopViewComic, ...comics.TopViewShortComics] : []
	).sort((a, b) => a?.createdAt - b?.createdAt)

	return (
		<div className={styles.container}>
			{AuthLoading || comicsLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				<MainWrapper>
					<Navbar key='shar-secure' userInfo={AuthData} search={true} />
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
