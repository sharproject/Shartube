import {
	ComicInfoFragment,
	EditPageComicInfoFragment,
	ShortComicInfoFragment,
} from '../generated/graphql/graphql'

export type ComicCardDataInput =
	| ComicInfoFragment
	| ShortComicInfoFragment
	| EditPageComicInfoFragment
