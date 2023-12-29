
import { Navbar } from '../Navbar/Navbar'

export default function MainWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className='bg-[#141518] text-white'>
			<Navbar key='shar-secure' />
			{children}
		</main>
	)
}
