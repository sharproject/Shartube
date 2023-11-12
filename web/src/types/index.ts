import {
	ComicInfoFragment,
	ShortComicInfoFragment,
} from '../generated/graphql/graphql'

export type TopComicDataInput =
	| ComicInfoFragment
	| ShortComicInfoFragment
