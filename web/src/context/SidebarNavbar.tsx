'use client'

import { createContext, useState } from 'react'
import { MeQuery } from '../generated/graphql/graphql'
import { useCheckAuth } from '../hooks/useCheckAuth'
import { LogoLoading } from '../components/logo'

export interface ISidebarNavbarContext {
	SidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
	createComicPopupOpen: boolean
	setCreateComicPopupOpen: (open: boolean) => void
	searchInput: boolean
	toggleSearchInput: (open: boolean) => void
	userInfo?: MeQuery | undefined
}

export const SidebarNavbarContext = createContext<ISidebarNavbarContext>({
	SidebarOpen: false,
	setSidebarOpen: (open: boolean) => {},
	createComicPopupOpen: false,
	setCreateComicPopupOpen: (open: boolean) => {},
	searchInput: false,
	toggleSearchInput: (open: boolean) => {},
	userInfo: undefined,
})

export function SidebarNavbarProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [SidebarOpen, setSidebarOpen] = useState(false)
	const [createComicPopupOpen, setCreateComicPopupOpen] = useState(false)
	const [searchInput, setSearchInput] = useState(false)
	const { data: AuthData, loading: AuthLoading } = useCheckAuth()

	const value = {
		SidebarOpen,
		setSidebarOpen,
		createComicPopupOpen,
		setCreateComicPopupOpen,
		searchInput,
		toggleSearchInput: (open: boolean) => setSearchInput(open),
		userInfo: AuthData,
	}
	return (
		<SidebarNavbarContext.Provider value={value}>
			{AuthLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				children
			)}
		</SidebarNavbarContext.Provider>
	)
}
