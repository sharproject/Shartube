'use client'
import * as React from 'react'

import { useQuery } from '@apollo/client'
import { meQueryDocument } from '@/util/rawSchemaDocument'

export function NavBar() {
	const {} = useQuery(meQueryDocument)
	return <></>
}
