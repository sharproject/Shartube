'use client'
import { useContext } from 'react'
import { SidebarNavbarContext } from '../../context/SidebarNavbar'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'

export const sidebarPathSupport = ['/edit/**/**']

export function CheckPathname(pathname: string) {
	const matchedKey = sidebarPathSupport.find((key) =>
		new RegExp(key.replace(/\*\*/g, '.*')).test(pathname)
	)
	return matchedKey
}

export function EditComicPageSidebar() {
	const { setSidebarOpen } = useContext(SidebarNavbarContext)
	return (
		<div className='relative z-20 h-full bg-[#16171a] shadow-sm max-w-52 text-white text-center border-r-2 border-[#2E2E2E] flex flex-col justify-between py-10 min-h-screen group'>
			<BsFillArrowLeftSquareFill
				className='absolute hidden text-3xl cursor-pointer -right-4 top-10 group-hover:block'
				onClick={() => setSidebarOpen(false)}
			/>
		</div>
	)
}
