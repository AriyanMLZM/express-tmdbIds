import { Response, Request } from 'express'
import { MoviesData } from '../models'

const apiMovieController = async (req: Request, res: Response) => {
	try {
		const name = req.query.name
		const year = req.query.year

		if (!name || !year) {
			res.status(400).send('name and year parameters are required')
			return
		}

		const resTmdb = await fetch(
			`${process.env.PROXY_API}https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}%26query=${name}%26primary_release_year=${year}`
		)
		const { results } = await resTmdb.json()
		const movie = results[0]
		if (movie) {
			const movieDoc = await MoviesData.findOne({ id: movie.id })
			if (movieDoc) {
				console.log(`${name} already added!`)
				res.status(409).send({ msg: `${name} already added!` })
				return
			}
			await MoviesData.create({
				title: movie.title,
				input_title: name,
				date: movie.release_date.split('-')[0],
				id: movie.id,
				poster: movie.poster_path,
				rate: movie.vote_average.toFixed(1),
			})
		} else {
			console.log(`${name} not found!`)
			res.status(404).send({ msg: `${name} not found!` })
			return
		}

		const movies = await MoviesData.find().sort({ title: 1 })
		await MoviesData.deleteMany({})
		await MoviesData.insertMany(movies)

		console.log(`title: ${movie.title}`)
		console.log(`year: ${year}`)
		console.log(`input: ${name}\n`)
		res.status(200).send({ msg: `${movie.title} movie data added!` })
	} catch (error: any) {
		res.status(500).send({ msg: error.message })
	}
}

export default apiMovieController
