'use client'
import { useQuery } from '@apollo/client'
import { EditPageComicByIDQueryDocument } from '../../../../util/rawSchemaDocument'
import { LogoLoading } from '../../../../components/logo'
import { useRouter } from 'next/navigation'
import { useCheckAuth } from '../../../../hooks/useCheckAuth'

// list session vs chap
export default function ShortComicEditPage({
	params,
}: {
	params: { id: string }
}) {
	const {
		data: Comic,
		loading: ComicLoading,
		error,
	} = useQuery(EditPageComicByIDQueryDocument, {
		variables: {
			id: params.id,
		},
	})
	const { data: AuthUser } = useCheckAuth()
	const router = useRouter()
	if (!ComicLoading && (!Comic?.ComicByID || !Comic)) {
		return router.back()
	}
	if (!ComicLoading && Comic?.ComicByID?.CreatedByID != AuthUser?.Me._id) {
		return router.back()
	}
	console.log({ Comic, AuthUser })
	return (
		<div>
			{ComicLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				<div>
					<h1>{Comic?.ComicByID?.name}</h1>
				</div>
			)}
		</div>
	)
}
