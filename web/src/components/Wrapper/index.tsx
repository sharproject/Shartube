export default function MainWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	return <main className='bg-[#141518] text-white'>{children}</main>
}
