'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { meQueryDocument } from '@/util/rawSchemaDocument'
import { useQuery } from '@apollo/client'

/**
 *
 * @returns
 */

export const useCheckAuth = ({
	unAuthRedirectTo,
	authRedirectTo,
}: { unAuthRedirectTo?: string; authRedirectTo?: string } = {}) => {
	const router = useRouter()
	const pathname = usePathname()
	const { data, loading, error } = useQuery(meQueryDocument, {
		partialRefetch: true
	})

	useEffect(() => {
		if (error != null || error != undefined) {
			if (window) {
				window.localStorage.removeItem('token')
			}
		}
		// console.log({ pathname, data, loading, error })

		if (!loading && !data?.Me && unAuthRedirectTo) {
			router.replace(unAuthRedirectTo)
		}
		if (!loading && data?.Me && authRedirectTo) {
			router.replace(authRedirectTo)
		}
	}, [data, loading, router, error, pathname, unAuthRedirectTo, authRedirectTo])
	return {
		data,
		loading,
		error,
	}
}
