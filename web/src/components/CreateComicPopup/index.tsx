import { Dispatch, Fragment, SetStateAction } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsChevronExpand } from 'react-icons/bs'
interface CreateComicPopupProps {
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function CreateComicPopup(props: CreateComicPopupProps) {
	let { isOpen, setIsOpen } = props

	function closeModal() {
		setIsOpen(false)
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
						<div className='flex min-h-full items-center justify-center p-4 text-center '>
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
									<div className='flex min-h-full flex-col justify-center px-3 py-6 lg:px-4'>
										<div className='mt-1 sm:mx-auto sm:w-full sm:max-w-sm'>
											<form className='space-y-6'>
												<div>
													<label
														htmlFor='comic-name'
														className='block text-sm font-medium leading-6 '
													>
														Comic name
													</label>
													<div className='mt-2'>
														<input
															id='comic-name'
															name='comic-name'
															type='text'
															required
															className='block w-full rounded-md border-0 py-1.5 px-1 bg-[#000000] ring-blue-950 ring-2 text-white  focus:outline-none focus:ring focus:border-blue-500 shadow-sm sm:text-sm sm:leading-6'
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
														/>
													</div>
												</div>

												<div>
													<label
														className='block text-sm font-medium leading-6'
														htmlFor='comic-short-comic-type'
													>
														Type Of Comic:{' '}
													</label>
													<CreateComicPopupChoose id='comic-short-comic-type' />
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

const people = [
	{ name: 'Wade Cooper', unavailable: false, id: 1 },
	{ name: 'Arlene Mccoy', unavailable: false, id: 2 },
]

export function CreateComicPopupChoose(props: { id: string }) {
	const [selectedPerson, setSelectedPerson] = useState(people[0])

	return (
		<div className='px-2 text-center'>
			<Listbox
				value={selectedPerson}
				onChange={setSelectedPerson}
				by={compareChoose}
			>
				<Listbox.Button className='mt-3 bg-stone-600 w-full' id={props.id}>
					{selectedPerson.name}
				</Listbox.Button>
				<Listbox.Options id={props.id}>
					{people.map((person) => (
						<Listbox.Option
							key={person.id}
							value={person}
							disabled={person.unavailable}
							className='mt-3 ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black'
						>
							<AiOutlineCheck className='hidden ui-selected:block' />
							{person.name}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Listbox>
		</div>
	)
}
function compareChoose(a: any, b: any) {
	return a.name.toLowerCase() === b.name.toLowerCase()
}
