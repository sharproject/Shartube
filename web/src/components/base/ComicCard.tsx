import Link from 'next/link'
import { useCheckAuth } from '../../hooks/useCheckAuth'
import { ComicCardDataInput } from '../../types'
import styles from './ComicCard.styles.module.css'
export function BaseComicCard(name: 'ComicCard' | 'ComicCardDashboard') {
	return function ComicCard({
		comic,
		useButton = true,
	}: {
		comic: ComicCardDataInput
		useButton?: boolean
	}) {
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
					background: `url(${comic.background}) repeat, no-repeat 0, 0`,
				}}
				className={`p-5 w-full max-w-md h-40 rounded-2xl mb-5 text-white m-1 ${styles.comicCard}`}
			>
				<h2>{comic.name}</h2>
				<span
					// style={{
					// 	color: '#A7ACC0',
					// }}
					className='text-[#A7ACC0]'
				>
					{comic.description || 'No description'}
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
					{name == 'ComicCard' ? (
						<>
							<button
								// style={{
								// 	// background: '#292B33',
								// 	// color: '#BBC1D6',
								// 	// borderRadius: '8px',
								// 	padding: '5px 15px',
								// }}
								className='border-[#434754] border-solid border-[1px] hover:border-[#2F4DEE] bg-[#292B33] text-[#BBC1D6] rounded-md px-4 py-1.5'
							>
								Read
							</button>
							{AuthData && AuthData.Me._id == comic.CreatedByID && (
								<Link href={`/edit/${comic.__typename}/${comic._id}`}>
									<button
										// style={{
										// 	// background: '#292B33',
										// 	// color: '#BBC1D6',
										// 	// borderRadius: '8px',
										// 	padding: '5px 15px',
										// }}
										className='border-[#434754] border-solid border-[1px] hover:border-[#2F4DEE] ml-2 bg-[#292B33] text-[#BBC1D6] rounded-md px-4 py-1.5'
									>
										Mange
									</button>
								</Link>
							)}
						</>
					) : (
						<>
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
						</>
					)}
				</div>
			</div>
		)
	}
}
