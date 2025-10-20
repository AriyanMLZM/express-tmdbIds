import { Response, Request } from 'express'
import { SeriesData } from '../models'

const apiTvController = async (req: Request, res: Response) => {
	try {
		const name = req.query.name
		const year = req.query.year

		if (!name || !year) {
			res.status(400).send('name and year parameters are required')
			return
		}

		const resTmdb = await fetch(
			`${process.env.PROXY_API}https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}%26query=${name}%26year=${year}`
		)
		const { results } = await resTmdb.json()
		const tv = results[0]
		if (tv) {
			const tvDoc = await SeriesData.findOne({ id: tv.id })
			if (tvDoc) {
				console.log(`${name} already added!`)
				res.status(409).send({ msg: `${name} already added!` })
				return
			}
			await SeriesData.create({
				title: tv.name,
				input_title: name,
				date: tv.first_air_date,
				id: tv.id,
				poster: tv.poster_path,
				rate: tv.vote_average.toFixed(1),
			})
		} else {
			console.log(`${name} not found!`)
			res.status(404).send({ msg: `${name} not found!` })
			return
		}

		const tvs = await SeriesData.find().sort({ title: 1 })
		await SeriesData.deleteMany({})
		await SeriesData.insertMany(tvs)

		console.log(`title: ${tv.name}`)
		console.log(`year: ${year}`)
		console.log(`input: ${name}\n`)
		res.status(200).send({ msg: `${tv.name} tv data added!` })
	} catch (error: any) {
		res.status(500).send({ msg: error.message })
	}
}

export default apiTvController
