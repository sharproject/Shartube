'use client'
import { AiOutlineSearch, AiOutlineFileAdd } from 'react-icons/ai'
import { SiReasonstudios } from 'react-icons/si'
import * as React from 'react'
import { MeQuery } from '@/generated/graphql/graphql'
import { Logo } from '../logo'
import Link from 'next/link'
import styles from './page.module.css'
import { usePathname } from 'next/navigation'
import { AiOutlineMenu } from 'react-icons/ai'
import { SidebarNavbarContext } from '../../context/SidebarNavbar'
import { CheckPathname } from '../Sidebar'

export const Navbar = () => {
	const pathname = usePathname()
	const {
		setCreateComicPopupOpen,
		setSidebarOpen,
		userInfo,
		searchInput,
		SidebarOpen,
	} = React.useContext(SidebarNavbarContext)
	return (
		<div
			className={`bg-[#18191D] flex min-w-full h-16 items-center text-white`}
			style={{
				// backgroundColor: '#18191D',
				borderBottom: '1px solid #2E2E2E',
				justifyContent: 'space-between',
				// alignItems: 'center',
				minHeight: '50px',
			}}
		>
			<div className='flex items-center content-center justify-center h-full ml-4 '>
				{/* side bar toggle */}
				{CheckPathname(pathname) ? (
					<div className='mx-2 mr-4 text-2xl text-white cursor-pointer'>
						<AiOutlineMenu
							onClick={(e) => {
								e.stopPropagation()
								setSidebarOpen(!SidebarOpen)
							}}
						/>
					</div>
				) : (
					<></>
				)}

				{/* logo */}
				<Link
					href={'/'}
					className='flex items-center content-center justify-center h-4/5 min-w-16'
				>
					<Logo></Logo>
				</Link>
			</div>

			<div
				style={{
					padding: '8.5px 8px',
				}}
				className='h-full'
			>
				{searchInput && (
					<div
						// style={{
						// 	display: 'flex',
						// 	height: '100%',
						// 	alignItems: 'center',
						// }}
						className={`flex h-full items-center ${styles.inputSearchContainer}`}
					>
						<input placeholder='Search' className={styles.inputSearch} />
						<span
							style={{
								// height: '100%',
								// display: 'flex',
								// alignItems: 'center',
								// justifyContent: 'center',
								padding: '0px 9px',
								borderRadius: '0px 8px 8px 0px',
								borderLeft: '1px solid #3D3D3D',
								// textAlign: 'center',
								width: '40vw',
							}}
							className={`h-full flex justify-center items-center text-center max-w-2xl ${styles.inputSearchIconContainer}`}
						>
							<AiOutlineSearch className={styles.inputSearchIcon} />
						</span>
					</div>
				)}
			</div>
			<div
				// style={{
				// 	padding: '8px',
				// }}
				className='h-full p-2'
			>
				{userInfo ? (
					<div className='flex items-center justify-center h-full'>
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
									onClick={(e) => {
										e.stopPropagation()
										setCreateComicPopupOpen(true)
									}}
								>
									<AiOutlineFileAdd size={28}></AiOutlineFileAdd>
								</button>
							</>
						)}
						<div
							style={
								{
									// height: '100%',
									// aspectRatio: '1',
									// borderRadius: '50%',
									// background: '#25272E',
								}
							}
							className='m-3 h-full bg-[#25272E] aspect-square rounded-full flex items-center justify-center min-w-10'
						>
							{userInfo.Me.name && userInfo.Me.name.slice(0, 1).toUpperCase()}
						</div>
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
