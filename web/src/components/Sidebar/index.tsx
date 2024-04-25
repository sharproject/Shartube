'use client'
import { useContext } from 'react'
import { SidebarNavbarContext } from '../../context/SidebarNavbar'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { IoArrowBackOutline } from 'react-icons/io5'
import Link from 'next/link'
import Image from 'next/image'
import { ComicCardDataInput } from '../../types'

export const sidebarPathSupport = ['/edit/**/**']

export function CheckPathname(pathname: string) {
	const matchedKey = sidebarPathSupport.find((key) =>
		new RegExp(key.replace(/\*\*/g, '.*')).test(pathname)
	)
	return matchedKey
}

export function EditComicPageSidebar({ comic }: { comic: ComicCardDataInput }) {
	const { setSidebarOpen } = useContext(SidebarNavbarContext)
	return (
		<div className='relative z-20 h-full bg-[#16171a] shadow-sm text-white text-center border-r-2 border-[#2E2E2E] flex flex-col justify-between py-2 min-h-screen group transition-all'>
			{/* <BsFillArrowLeftSquareFill
				className='absolute hidden text-3xl cursor-pointer -right-4 top-10 group-hover:block'
				onClick={() => setSidebarOpen(false)}
			/> */}
			<div>
				<Link
					href='/dashboard'
					className='mb-2 flex items-center content-center justify-center hover:text-[#6E6E6E] hover:bg-[#2E2E2E] p-2 rounded-lg w-full'
				>
					<IoArrowBackOutline className='text-3xl' />{' '}
					<span className='ml-2 sm:hidden lg:block'>Back to Dashboard</span>
				</Link>
				{comic.thumbnail && (
					<div>
						<Image
							src={comic.thumbnail}
							alt='thumbnail'
							width={200}
							height={200}
							className='object-contain max-w-full m-auto sm:px-1 max-h-50'
						/>
					</div>
				)}
			</div>
		</div>
	)
}
