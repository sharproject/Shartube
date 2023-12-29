'use client'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { ComicCardDashboard } from '../../../../components/ComicCardDashboard'
import { SidebarNavbarContext } from '../../../../context/SidebarNavbar'
import { EditPageComicByIDQueryDocument } from '../../../../util/rawSchemaDocument'

// list session vs chap
export default function ComicEditPage({ params }: { params: { id: string } }) {
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
	const router = useRouter()
	if (error) {
		return <div>Error: {error.message}</div>
	}
	if (!ComicLoading && (!ComicQueryResult?.ComicByID || !ComicQueryResult)) {
		return router.back()
	}
	const comic = ComicQueryResult?.ComicByID!
	console.log({ Comic: ComicQueryResult })
	return (
		<>
			<div className='m-4 rounded-lg '>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis odio
				expedita cum quasi neque eum veniam eaque corporis obcaecati eos
				asperiores ipsam voluptatum dolorem, nulla, amet praesentium. Magni,
				officiis quos.
			</div>
			<div className='m-4 text-center rounded-lg min-w-96'>
				<h1>Comic Card Show here</h1>
				<ComicCardDashboard
					useButton={false}
					comic={comic}
				></ComicCardDashboard>
			</div>
		</>
	)
}
