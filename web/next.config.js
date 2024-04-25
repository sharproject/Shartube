/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: {
		buildActivity: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.discordapp.com',
				pathname: '/**',
			},
		],
	},
}

module.exports = nextConfig
