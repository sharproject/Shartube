import { LogoLoading } from '../logo'

export function LoadingScreen() {
	return (
		<div className='w-[100vw] h-[100vh] flex justify-center items-center bg-[#141518] absolute top-0 left-0'>
			<LogoLoading />
		</div>
	)
}
