import { Response, Request } from 'express'
import { SeriesData } from '../models'
import fs from 'fs'

const apiTvDataController = async (req: Request, res: Response) => {
	try {
		const names = fs.readFileSync(`${process.cwd()}/data/tvs.txt`, 'utf-8')
		const linesArray = names.split('\n')

		await SeriesData.deleteMany({})

		let count = 0
		for (let line of linesArray) {
			const words = line.split(' ')
			const year = words[words.length - 1]
			words.pop()
			const name = words.join(' ')

			const resTmdb = await fetch(
				`${process.env.PROXY_API}https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}%26query=${name}%26year=${year}`
			)
			const { results } = await resTmdb.json()
			const tv = results[0]
			if (tv) {
				await SeriesData.create({
					title: tv.name,
					input_title: name,
					date: tv.first_air_date.split('-')[0],
					id: tv.id,
					poster: tv.poster_path,
					rate: tv.vote_average.toFixed(1),
				})
				console.log(`title: ${tv.name}`)
				console.log(`year: ${year}`)
				console.log(`input: ${name}\n`)
				count++
			} else {
				console.log(`${name} not found!`)
				res.status(404).send({ msg: `${name} not found!` })
				return
			}
		}

		const tvs = await SeriesData.find().sort({ title: 1 })
		await SeriesData.deleteMany({})
		await SeriesData.insertMany(tvs)

		console.log(`${count} tvs data added!`)
		res.status(200).send({ msg: `${count} tvs data added!` })
	} catch (error: any) {
		res.status(500).send({ msg: error.message })
	}
}

export default apiTvDataController
