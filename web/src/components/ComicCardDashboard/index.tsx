import Link from 'next/link'
import { ComicCardDataInput } from '../../types'
import styles from './styles.module.css'

export function ComicCardDashboard({
	comic,
	useButton = true,
}: {
	comic: ComicCardDataInput
	useButton?: boolean
}) {
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
				background: `url(${comic.background}) repeat, no-repeat 0, 0`,
			}}
			className={styles.comicCard}
		>
			<h2>{comic.name}</h2>
			<span
				style={{
					color: '#A7ACC0',
				}}
			>
				{comic.description || 'No description'}
			</span>
			{useButton && (
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
					<Link href={`/edit/${comic.__typename}/${comic._id}`}>
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
							Mange
						</button>
					</Link>
				</div>
			)}
		</div>
	)
}
