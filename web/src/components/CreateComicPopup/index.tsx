'use client'
import { useMutation } from '@apollo/client'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import React, {
	Dispatch,
	FormEvent,
	Fragment,
	JSX,
	SVGProps,
	SetStateAction,
	useRef,
	useState,
} from 'react'
import { MdOutlineClear } from 'react-icons/md'
import {
	CreateComicMutationDocument,
	CreateShortComicMutationDocument,
	meQueryDocument,
} from '../../util/rawSchemaDocument'
import { MeQuery } from '../../generated/graphql/graphql'
import { UploadUrl } from '../../constant'
import { useRouter } from 'next/navigation'
import { SidebarNavbarContext } from '../../context/SidebarNavbar'

const comicType = [
	{
		name: 'Comic',
		description: 'the comic have lot of session',
		id: 'Comic',
	},
	{
		name: 'Short Comic',
		description: 'comic have one session',
		id: 'ShortComic',
	},
] as {
	name: string
	description: string
	id: 'Comic' | 'ShortComic'
}[]

export function CreateComicPopup() {
	const { createComicPopupOpen, setCreateComicPopupOpen } =
		React.useContext(SidebarNavbarContext)
	const [comicTypeSelect, setComicTypeSelect] = useState(comicType[0])
	const thumbnail = useRef<HTMLInputElement>(null)
	const background = useRef<HTMLInputElement>(null)
	const comicName = useRef<HTMLInputElement>(null)
	const comicDescription = useRef<HTMLInputElement>(null)
	const router = useRouter()
	const [errors, setErrors] = useState<
		{
			name: string
			msg: string
		}[]
	>([])

	function closeModal() {
		setCreateComicPopupOpen(false)
	}

	const [createComic] = useMutation(CreateComicMutationDocument)
	const [createShortComic] = useMutation(CreateShortComicMutationDocument)

	const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const response =
			comicTypeSelect.id == 'Comic'
				? await createComic({
						variables: {
							input: {
								name: comicName.current?.value || '',
								description: comicDescription.current?.value,
								background: background.current?.files?.length
									? background.current?.files?.length > 0
									: false,
								thumbnail: thumbnail.current?.files
									? thumbnail.current?.files?.length > 0
									: false,
							},
						},
						update(cache, { data }) {
							const comic = data?.createComic.comic
							if (!comic) return
							const AuthData = cache.readQuery<MeQuery>({
								query: meQueryDocument,
							})
							if (!AuthData) return
							if (!AuthData?.Me.profile) return
							// add comic to profile.comics
							cache.writeQuery<MeQuery>({
								query: meQueryDocument,
								data: {
									Me: {
										...AuthData.Me,
										profile: {
											...AuthData.Me.profile,
											comics: [...AuthData.Me.profile.comics, comic],
										},
									},
								},
							})
						},
						onError(error, clientOptions) {
							if (error.message.includes('Access Denied')) {
								console.log(clientOptions?.client)
								router.push('/login')
							}
						},
				  })
				: await createShortComic({
						variables: {
							input: {
								name: comicName.current?.value || '',
								description: comicDescription.current?.value,
								background: background.current?.files?.length
									? background.current?.files?.length > 0
									: false,
								thumbnail: thumbnail.current?.files
									? thumbnail.current?.files?.length > 0
									: false,
							},
						},
						update(cache, { data }) {
							const comic = data?.createShortComic.ShortComic
							if (!comic) return
							const AuthData = cache.readQuery<MeQuery>({
								query: meQueryDocument,
							})
							if (!AuthData) return
							if (!AuthData?.Me.profile) return
							// add comic to profile.comics
							cache.writeQuery<MeQuery>({
								query: meQueryDocument,
								data: {
									Me: {
										...AuthData.Me,
										profile: {
											...AuthData.Me.profile,
											ShortComics: [...AuthData.Me.profile.ShortComics, comic],
										},
									},
								},
							})
						},
						onError(error, clientOptions) {
							if (error.message.includes('Access Denied')) {
								router.push('/login')
							}
						},
				  })

		if (response.data) {
			const UploadToken = {
				thumbnail: {
					token: '',
					element: thumbnail.current?.files && thumbnail.current?.files[0],
				},
				background: {
					token: '',
					element: background.current?.files && background.current?.files[0],
				},
			}
			if ('createComic' in response.data) {
				const UploadTokens = response.data.createComic.UploadToken
				if (UploadTokens) {
					UploadToken.thumbnail.token = UploadTokens[1] || ''
					UploadToken.background.token = UploadTokens[3] || ''
				}
			} else {
				const UploadTokens = response.data.createShortComic.UploadToken
				if (UploadTokens) {
					UploadToken.thumbnail.token = UploadTokens[1] || ''
					UploadToken.background.token = UploadTokens[3] || ''
				}
			}
			for (const [key, value] of Object.entries(UploadToken)) {
				if (value.element) {
					const requestHeaders = new Headers()
					requestHeaders.append('upload_token', value.token)
					requestHeaders.append('remove_token', 'true')
					const body = new FormData()
					body.append('file', value.element, value.element.name)
					while (true) {
						const result = await fetch(UploadUrl, {
							body,
							headers: requestHeaders,
							method: 'POST',
							cache: 'no-cache',
							mode: 'no-cors',
						})
						if (result.ok) break
						await new Promise((resolve) => setTimeout(resolve, 1000))
					}
				}
			}
			closeModal()
		}
	}

	return (
		<>
			<Transition appear show={createComicPopupOpen} as={Fragment}>
				<Dialog as='div' className='relative z-10' onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto text-white'>
						<div className='flex items-center justify-center min-h-full p-4 text-center '>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-[#141518] p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										// as='h3'
										className='text-lg font-medium leading-6 text-white'
									>
										Create Comic/Short Comic
									</Dialog.Title>
									<div className='flex flex-col justify-center min-h-full px-3 py-6 lg:px-4'>
										<div className='mt-1 sm:mx-auto sm:w-full sm:max-w-sm'>
											{errors.map((e, i) => (
												<div className='text-white bg-red-400' key={i}>
													{e.name}:{e.msg}
												</div>
											))}
											<form className='space-y-6' onSubmit={onFormSubmit}>
												<div>
													<label
														htmlFor='comicName'
														className='block text-sm font-medium leading-6 '
													>
														Comic name
													</label>
													<div className='mt-2'>
														<input
															id='comicName'
															name='comicName'
															type='text'
															required
															className='block w-full rounded-md border-0 py-1.5 px-1 bg-[#000000] ring-blue-950 ring-2 text-white  focus:outline-none focus:ring focus:border-blue-500 shadow-sm sm:text-sm sm:leading-6'
															ref={comicName}
														/>
													</div>
												</div>

												<div>
													<label
														htmlFor='comicDescription'
														className='block text-sm font-medium leading-6 '
													>
														Comic description
													</label>
													<div className='mt-2'>
														<input
															id='comicDescription'
															name='comicDescription'
															type='text'
															className='block w-full rounded-md border-0 py-1.5 px-1 bg-[#000000] ring-blue-950 ring-2 text-white  focus:outline-none focus:ring focus:border-blue-500 shadow-sm sm:text-sm sm:leading-6'
															ref={comicDescription}
														/>
													</div>
												</div>

												<div>
													<div className='flex items-center justify-between'>
														<label
															htmlFor='Thumbnail'
															className='block text-sm font-medium leading-6 '
														>
															Thumbnail
														</label>
													</div>
													<div className='mt-2'>
														<input
															id='Thumbnail'
															name='Thumbnail'
															type='file'
															className='block w-full rounded-md border-0 py-1.5 bg-inherit shadow-sm sm:text-sm sm:leading-6'
															ref={thumbnail}
														/>
														<MdOutlineClear
															className='w-6 h-6 text-white'
															onClick={() => {
																thumbnail.current &&
																	((thumbnail.current.value as string | null) =
																		null)
															}}
														/>
													</div>
												</div>

												<div>
													<div className='flex items-center justify-between'>
														<label
															htmlFor='Background'
															className='block text-sm font-medium leading-6'
														>
															Background
														</label>
													</div>
													<div className='mt-2'>
														<input
															id='Background'
															name='Background'
															type='file'
															className='block w-full rounded-md border-0 py-1.5  shadow-sm sm:text-sm sm:leading-6'
															ref={background}
														/>
														<MdOutlineClear
															className='w-6 h-6 text-white'
															onClick={() => {
																background.current &&
																	((background.current.value as string | null) =
																		null)
															}}
														/>
													</div>
												</div>

												<div>
													<label className='block text-sm font-medium leading-6'>
														Type Of Comic:{' '}
													</label>
													<CreateComicPopupChooseComicType
														comicTypeSelect={comicTypeSelect}
														setComicTypeSelect={setComicTypeSelect}
													/>
												</div>

												<div>
													<button
														type='submit'
														className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
													>
														Create comic
													</button>
												</div>
											</form>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export function CreateComicPopupChooseComicType<T>(props: {
	comicTypeSelect: T
	setComicTypeSelect: Dispatch<SetStateAction<T>>
}) {
	return (
		<div className='w-full py-1'>
			<div className='w-full max-w-md mx-auto'>
				<RadioGroup
					value={props.comicTypeSelect}
					onChange={props.setComicTypeSelect}
				>
					<RadioGroup.Label className='sr-only'>Type Of Comic</RadioGroup.Label>
					<div className='space-y-2'>
						{comicType.map((cType) => (
							<RadioGroup.Option
								key={cType.name}
								value={cType}
								className={({ active, checked }) =>
									`${
										active
											? 'ring-2 ring-white ring-opacity-60 text-white ring-offset-2 ring-offset-sky-300'
											: ''
									}
                  ${
										checked
											? 'bg-sky-900 bg-opacity-75 text-white'
											: 'bg-[#111]'
									}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
								}
							>
								{({ active, checked }) => (
									<>
										<div className='flex items-center justify-between w-full'>
											<div className='flex items-center'>
												<div className='text-sm'>
													<RadioGroup.Label
														as='p'
														className={`font-medium text-white`}
													>
														{cType.name}
													</RadioGroup.Label>
													<RadioGroup.Description
														as='span'
														className={`inline ${
															checked ? 'text-sky-100' : 'text-gray-400'
														}`}
													>
														<span>{cType.description}</span>{' '}
													</RadioGroup.Description>
												</div>
											</div>
											{checked && (
												<div className='text-white shrink-0'>
													<CheckIcon className='w-6 h-6' />
												</div>
											)}
										</div>
									</>
								)}
							</RadioGroup.Option>
						))}
					</div>
				</RadioGroup>
			</div>
		</div>
	)
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox='0 0 24 24' fill='none' {...props}>
			<circle cx={12} cy={12} r={12} fill='#fff' opacity='0.2' />
			<path
				d='M7 13l3 3 7-7'
				stroke='#fff'
				strokeWidth={1.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
