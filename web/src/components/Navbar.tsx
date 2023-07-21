import { AiOutlineSearch } from 'react-icons/ai'
import * as React from 'react'
import { MeQuery } from '@/generated/graphql/graphql'
import { Logo } from './logo'
import Link from 'next/link'

type Props = {
	styles: any
	height: string | number
	userInfo: MeQuery | undefined
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			sharinput: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>
		}
	}
}
export const Navbar = ({ styles, height, userInfo }: Props) => {
	return (
		<div
			className={`w-[100%] h-[${height}px] bg-[#18191D] flex`}
			style={{
				width: '100%',
				height: `${height}px`,
				backgroundColor: '#18191D',
				borderBottom: '1px solid #2E2E2E',
				justifyContent: 'space-between',
				// alignItems: 'center',
				minHeight: '50px',
			}}
		>
			<p className='ml-2 flex' style={{ alignItems: 'center' }}>
				<Logo height={75} width={75}></Logo>
			</p>
			<div
				style={{
					padding: '8.5px 8px',
				}}
			>
				<div
					style={{
						display: 'flex',
						height: '100%',
						alignItems: 'center',
					}}
					className={styles.inputSearchContainer}
				>
					<input placeholder='Search' className={styles.inputSearch} />
					<span
						style={{
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '0px 9px',
							borderRadius: '0px 8px 8px 0px',
							borderLeft: '1px solid #3D3D3D',
							textAlign: 'center',
						}}
						className={styles.inputSearchIconContainer}
					>
						<AiOutlineSearch className={styles.inputSearchIcon} />
					</span>
				</div>
			</div>
			<div
				style={{
					padding: '8px',
				}}
			>
				{userInfo ? (
					<div
						style={{
							height: '100%',
							aspectRatio: '1',
							borderRadius: '50%',
							background: '#25272E',
						}}
					></div>
				) : (
					<p>
						<Link href={'/login'}>
							<button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-1'>
								Login
							</button>
						</Link>
						<Link href={'/register'}>
							<button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
								Register
							</button>
						</Link>
					</p>
				)}
			</div>
		</div>
	)
}
