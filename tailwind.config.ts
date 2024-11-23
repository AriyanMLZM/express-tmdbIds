import { Config } from 'tailwindcss'

const config: Config = {
	content: ['./views/**/*.{ejs,js}'],
	theme: {
		extend: {
			colors: {
				primary: '#00a1b1',
			},
		},
	},
	plugins: [],
}

export default config
