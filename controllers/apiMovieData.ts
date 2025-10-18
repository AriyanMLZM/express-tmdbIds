import { Response, Request } from 'express'
import { MoviesData } from '../models'
import fs from 'fs'

const apiMovieDataController = async (req: Request, res: Response) => {
	try {
		const names = fs.readFileSync(`${process.cwd()}/data/movies.txt`, 'utf-8')
		const linesArray = names.split('\n')

		await MoviesData.deleteMany({})

		let count = 0
		for (let line of linesArray) {
			const words = line.split(' ')
			const year = words[words.length - 1]
			words.pop()
			const name = words.join(' ')

			const resTmdb = await fetch(
				`${process.env.PROXY_API}https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}%26query=${name}%26primary_release_year=${year}`
			)
			const { results } = await resTmdb.json()
			const movie = results[0]
			if (movie) {
				await MoviesData.create({
					title: movie.title,
					input_title: name,
					date: movie.release_date.split('-')[0],
					id: movie.id,
					poster: movie.poster_path,
					rate: movie.vote_average.toFixed(1),
				})
				console.log(`title: ${movie.title}`)
				console.log(`year: ${year}`)
				console.log(`input: ${name}\n`)
				count++
			} else {
				console.log(`${name} not found!`)
				res.status(404).send({ msg: `${name} not found!` })
				return
			}
		}

		const movies = await MoviesData.find().sort({ title: 1 })
		await MoviesData.deleteMany({})
		await MoviesData.insertMany(movies)

		console.log(`${count} movies data added!`)
		res.status(200).send({ msg: `${count} movies data added!` })
	} catch (error: any) {
		res.status(500).send({ msg: error.message })
	}
}

export default apiMovieDataController
