'use client'
import { useQuery } from '@apollo/client'
import { EditPageComicByIDQueryDocument } from '../../../../util/rawSchemaDocument'
import { LogoLoading } from '../../../../components/logo'
import { notFound, useRouter } from 'next/navigation'
import { useCheckAuth } from '../../../../hooks/useCheckAuth'
import { ComicCardDashboard } from '../../../../components/ComicCardDashboard'

// list session vs chap
export default function ComicEditPage({ params }: { params: { id: string } }) {
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
	console.log({ Comic: ComicQueryResult, AuthUser })
	return (
		<div>
			{ComicLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
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

