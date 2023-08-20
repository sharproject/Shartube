'use client'
import { Navbar } from '@/components/Navbar'
import styles from './page.module.css'
import { useCheckAuth } from '@/hooks/useCheckAuth'
import { useEffect, useState } from 'react'
import { LogoLoading } from '../components/logo'
import { useQuery } from '@apollo/client'
import { TopViewComicsQueryDocument } from '../util/rawSchemaDocument'

export const metadata = {
	title: 'Shartube',
	description: 'Online sharing platform',
}

export default function Home() {
	const { data, loading } = useCheckAuth()
	const [height, setHeight] = useState(0)
	const [heightContain, setHeightContain] = useState(0)

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

	const { data: comics, loading: comicsLoading } = useQuery(
		TopViewComicsQueryDocument
	)

	return (
		<div className={styles.container}>
			{loading || (!loading && data?.Me) || comicsLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				<main className={styles.main}>
					<Navbar
						height={height}
						styles={styles}
						key='shar-secure'
						userInfo={data}
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
					></div>
				</main>
			)}
		</div>
	)
}
