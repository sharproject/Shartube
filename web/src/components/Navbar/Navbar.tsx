import { AiOutlineSearch, AiOutlineFileAdd } from 'react-icons/ai'
import { SiReasonstudios } from 'react-icons/si'
import * as React from 'react'
import { MeQuery } from '@/generated/graphql/graphql'
import { Logo } from '../logo'
import Link from 'next/link'
import styles from './page.module.css'
import { usePathname } from 'next/navigation'

type Props = {
	height: string | number
	userInfo: MeQuery | undefined
	search?: boolean
	handleCreateComicButton?: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => any
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			sharinput: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>
		}
	}
}
export const Navbar = ({
	height,
	userInfo,
	search = true,
	handleCreateComicButton,
}: Props) => {
	const pathname = usePathname()
	return (
		<div
			className={`w-[100%] h-[${height}px] bg-[#18191D] flex`}
			style={{
				width: '100%',
				height: `${height}px`,
				backgroundColor: '#18191D',
				borderBottom: '1px solid #2E2E2E',
				justifyContent: 'space-between',
				// alignItems: 'center',
				minHeight: '50px',
			}}
		>
			<p className='flex ml-2' style={{ alignItems: 'center' }}>
				<Logo height={75} width={75}></Logo>
			</p>
			<div
				style={{
					padding: '8.5px 8px',
				}}
			>
				{search && (
					<div
						style={{
							display: 'flex',
							height: '100%',
							alignItems: 'center',
						}}
						className={styles.inputSearchContainer}
					>
						<input placeholder='Search' className={styles.inputSearch} />
						<span
							style={{
								height: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '0px 9px',
								borderRadius: '0px 8px 8px 0px',
								borderLeft: '1px solid #3D3D3D',
								textAlign: 'center',
								width: '40vw',
							}}
							className={styles.inputSearchIconContainer}
						>
							<AiOutlineSearch className={styles.inputSearchIcon} />
						</span>
					</div>
				)}
			</div>
			<div
				style={{
					padding: '8px',
				}}
			>
				{userInfo ? (
					<div className='flex justify-center content-center h-full'>
						{pathname != '/dashboard' ? (
							<div className='m-3'>
								<Link href={'/dashboard'}>
									<button className='text-white'>
										<SiReasonstudios size={28}></SiReasonstudios>
									</button>
								</Link>
							</div>
						) : (
							<>
								<button
									className='text-white hover:bg-slate-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
									type='button'
									onClick={(e) =>
										handleCreateComicButton && handleCreateComicButton(e)
									}
								>
									<AiOutlineFileAdd size={28}></AiOutlineFileAdd>
								</button>
							</>
						)}
						<div
							style={{
								height: '100%',
								aspectRatio: '1',
								borderRadius: '50%',
								background: '#25272E',
							}}
						></div>
					</div>
				) : (
					<p>
						<Link href={'/login'}>
							<button className='px-4 py-2 mr-1 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent'>
								Login
							</button>
						</Link>
						<Link href={'/register'}>
							<button className='px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent'>
								Register
							</button>
						</Link>
					</p>
				)}
			</div>
		</div>
	)
}
