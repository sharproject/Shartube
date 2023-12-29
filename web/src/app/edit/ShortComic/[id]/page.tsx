'use client'
import { useQuery } from '@apollo/client'
import { EditPageShortComicByIDQueryDocument } from '../../../../util/rawSchemaDocument'
import { useRouter } from 'next/navigation'
import { useCheckAuth } from '../../../../hooks/useCheckAuth'
import { ComicCardDashboard } from '../../../../components/ComicCardDashboard'
import { LoadingScreen } from '../../../../components/LoadingScreen'

// list chap
export default function ShortComicEditPage({
	params,
}: {
	params: { id: string }
}) {
	const {
		data: ComicQueryResult,
		loading: ComicLoading,
		error,
	} = useQuery(EditPageShortComicByIDQueryDocument, {
		variables: {
			id: params.id,
		},
	})
	const { data: AuthUser } = useCheckAuth()
	const router = useRouter()
	if (error) {
		return <div>Error: {error.message}</div>
	}
	if (
		!ComicLoading &&
		(!ComicQueryResult?.ShortComicByID || !ComicQueryResult)
	) {
		return router.back()
	}
	if (
		!ComicLoading &&
		ComicQueryResult?.ShortComicByID?.CreatedByID != AuthUser?.Me._id
	) {
		return router.back()
	}
	const comic = ComicQueryResult?.ShortComicByID!
	console.log({ Comic: ComicQueryResult, AuthUser })
	return (
		<div>
			{ComicLoading ? (
				<LoadingScreen></LoadingScreen>
			) : (
				<div className='grid grid-cols-6 gap-1 pt-5'>
					<div className='col-span-4 p-4 rounded-lg'>
						{/* Accordion here */}
					</div>
					<div className='col-span-2 p-4 text-center rounded-lg '>
						<h1>Comic Card Show here</h1>
						<ComicCardDashboard
							useButton={false}
							comic={comic}
						></ComicCardDashboard>
					</div>
				</div>
			)}
		</div>
	)
}
