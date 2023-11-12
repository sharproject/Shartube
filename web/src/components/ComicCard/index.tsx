import Link from 'next/link'
import { useCheckAuth } from '../../hooks/useCheckAuth'
import { TopComicDataInput } from '../../types'
import styles from './styles.module.css'

export function ComicCard(props: { comic: TopComicDataInput }) {
	const { data: AuthData } = useCheckAuth()
	console.log({ comic: props.comic })
	return (
		<div
			style={{
				padding: '20px 25px',
				width: '100%',
				maxWidth: '450px',
				height: '140px',
				borderRadius: '10px',
				marginBottom: '19px',
				color: '#fff',
				margin: '0.25rem',
				background: `url(${props.comic.background}) repeat, no-repeat 0, 0`,
			}}
			className={styles.comicCard}
		>
			<h2>{props.comic.name}</h2>
			<span
				style={{
					color: '#A7ACC0',
				}}
			>
				{props.comic.description || 'No description'}
			</span>
			<div
				style={{
					display: 'flex',
				}}
			>
				<div
					style={{
						width: '100%',
					}}
				></div>
				<button
					style={{
						background: '#292B33',
						color: '#BBC1D6',
						padding: '5px 15px',
						borderRadius: '8px',
					}}
					className={
						'border-[#434754] border-solid border-[1px] hover:border-[#2F4DEE]'
					}
				>
					Read
				</button>
				{AuthData && AuthData.Me._id == props.comic.CreatedByID && (
					<Link href={`/edit/${props.comic.__typename}/${props.comic._id}`}>
						<button
							style={{
								background: '#292B33',
								color: '#BBC1D6',
								padding: '5px 15px',
								borderRadius: '8px',
							}}
							className={
								'border-[#434754] border-solid border-[1px] hover:border-[#2F4DEE] ml-2'
							}
						>
							Mange
						</button>
					</Link>
				)}
			</div>
		</div>
	)
}
