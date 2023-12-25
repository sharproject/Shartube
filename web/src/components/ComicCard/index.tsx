import Link from 'next/link'
import { useCheckAuth } from '../../hooks/useCheckAuth'
import { ComicCardDataInput } from '../../types'
import styles from './styles.module.css'

export function ComicCard(props: { comic: ComicCardDataInput }) {
	const { data: AuthData } = useCheckAuth()
	return (
		<div
			style={{
				// padding: '20px 25px',
				// width: '100%',
				// maxWidth: '450px',
				// height: '140px',
				// borderRadius: '10px',
				// marginBottom: '19px',
				// color: '#fff',
				// margin: '0.25rem',
				background: `url(${props.comic.background}) repeat, no-repeat 0, 0`,
			}}
			className={`p-5 w-full max-w-md h-40 rounded-2xl mb-5 text-white m-1 ${styles.comicCard}`}
		>
			<h2>{props.comic.name}</h2>
			<span
				// style={{
				// 	color: '#A7ACC0',
				// }}
				className='text-[#A7ACC0]'
			>
				{props.comic.description || 'No description'}
			</span>
			<div
				// style={{
				// 	display: 'flex',
				// }}
				className='flex'
			>
				<div
					// style={{
					// 	width: '100%',
					// }}
					className='w-full'
				></div>
				<button
					style={{
						// background: '#292B33',
						// color: '#BBC1D6',
						// borderRadius: '8px',
						padding: '5px 15px',
					}}
					className={
						'border-[#434754] border-solid border-[1px] hover:border-[#2F4DEE] bg-[#292B33] text-[#BBC1D6] rounded-md'
					}
				>
					Read
				</button>
				{AuthData && AuthData.Me._id == props.comic.CreatedByID && (
					<Link href={`/edit/${props.comic.__typename}/${props.comic._id}`}>
						<button
							style={{
								// background: '#292B33',
								// color: '#BBC1D6',
								// borderRadius: '8px',
								padding: '5px 15px',
							}}
							className={
								'border-[#434754] border-solid border-[1px] hover:border-[#2F4DEE] ml-2 bg-[#292B33] text-[#BBC1D6] rounded-md'
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
