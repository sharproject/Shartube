'use client'
import { useQuery } from '@apollo/client'
import { EditPageComicByIDQueryDocument } from '../../../../util/rawSchemaDocument'
import { useRouter } from 'next/navigation'
import { useCheckAuth } from '../../../../hooks/useCheckAuth'
import { LoadingScreen } from '../../../../components/LoadingScreen'
import { useContext } from 'react'
import { SidebarNavbarContext } from '../../../../context/SidebarNavbar'
import { EditComicPageSidebar } from '../../../../components/Sidebar'

// list session vs chap
export default function ComicEditPage({
	params,
	children,
}: {
	params: { id: string }
	children: React.ReactNode
}) {
	const { SidebarOpen } = useContext(SidebarNavbarContext)
	const {
		data: ComicQueryResult,
		loading: ComicLoading,
		error,
	} = useQuery(EditPageComicByIDQueryDocument, {
		variables: {
			id: params.id,
		},
	})
	const { data: AuthUser } = useCheckAuth()
	const router = useRouter()
	if (error) {
		return <div>Error: {error.message}</div>
	}
	if (!ComicLoading && (!ComicQueryResult?.ComicByID || !ComicQueryResult)) {
		return router.back()
	}
	if (
		!ComicLoading &&
		ComicQueryResult?.ComicByID?.CreatedByID != AuthUser?.Me._id
	) {
		return router.back()
	}
	const comic = ComicQueryResult?.ComicByID!
	return (
		<div>
			{ComicLoading ? (
				<LoadingScreen></LoadingScreen>
			) : (
				<div className='flex justify-center pt-5'>
					{SidebarOpen && (
						<div className='max-w-72 md:min-w-16 lg:min-w-72'>
							<EditComicPageSidebar comic={comic}></EditComicPageSidebar>
						</div>
					)}
					{children}
				</div>
			)}
		</div>
	)
}
