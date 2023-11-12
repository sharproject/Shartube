import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	Fragment,
	JSX,
	SVGProps,
	SetStateAction,
	useRef,
} from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { useState } from 'react'
import { MdOutlineClear } from 'react-icons/md'
interface CreateComicPopupProps {
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
}
const plans = [
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
]

export function CreateComicPopup(props: CreateComicPopupProps) {
	const { isOpen, setIsOpen } = props
	const [comicTypeSelect, setComicTypeSelect] = useState(plans[0])
	const thumbnail = useRef<HTMLInputElement>(null)
	const background = useRef<HTMLInputElement>(null)
	const [errors, setErrors] = useState<
		{
			name: string
			msg: string
		}[]
		>([])
	const [clientError,setClientError] = useState({})

	function closeModal() {
		setIsOpen(false)
	}
	const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log({ background, thumbnail })
	}
	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.name)
	}

	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
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
															onChange={onInputChange}
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

export function CreateComicPopupChooseComicType(props: {
	comicTypeSelect: {
		name: string
		description: string
		id: string
	}
	setComicTypeSelect: Dispatch<
		SetStateAction<{
			name: string
			description: string
			id: string
		}>
	>
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
						{plans.map((plan) => (
							<RadioGroup.Option
								key={plan.name}
								value={plan}
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
														{plan.name}
													</RadioGroup.Label>
													<RadioGroup.Description
														as='span'
														className={`inline ${
															checked ? 'text-sky-100' : 'text-gray-400'
														}`}
													>
														<span>{plan.description}</span>{' '}
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
