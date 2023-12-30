import {
	ComicInfoFragment,
	EditPageComicInfoFragment,
	EditPageShortComicInfoFragment,
	ShortComicInfoFragment,
} from '../generated/graphql/graphql'

export type ComicCardDataInput =
	| ComicInfoFragment
	| ShortComicInfoFragment
	| EditPageComicInfoFragment
	| EditPageShortComicInfoFragment
