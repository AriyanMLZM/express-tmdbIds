import { Response, Request } from 'express'
import { Series } from '../models'
import fs from 'fs'

const apiTvGetIdsController = async (req: Request, res: Response) => {
	try {
		const names = fs.readFileSync(`${process.cwd()}/data/tvs.txt`, 'utf-8')
		const linesArray = names.split('\n')

		await Series.deleteMany({})

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
				await Series.create({
					title: tv.name,
					input_title: name,
					year: tv.first_air_date.split('-')[0],
					id: tv.id,
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

		const movies = await Series.find().sort({ title: 1 })
		await Series.deleteMany({})
		await Series.insertMany(movies)

		console.log(`${count} tvs added!`)
		res.status(200).send({ msg: `${count} tvs added!` })
	} catch (error: any) {
		res.status(500).send({ msg: error.message })
	}
}

export default apiTvGetIdsController
