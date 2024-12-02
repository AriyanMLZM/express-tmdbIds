import { Response, Request } from 'express'
import { Movies } from '../models'
import fs from 'fs'

const apiMovieGetIdsController = async (req: Request, res: Response) => {
	try {
		const names = fs.readFileSync(`${process.cwd()}/data/movies.txt`, 'utf-8')
		const linesArray = names.split('\n')

		await Movies.deleteMany({})

		let count = 0
		for (let line of linesArray) {
			const words = line.split(' ')
			const year = words[words.length - 1]
			words.pop()
			const name = words.join(' ')

			const resTmdb = await fetch(
				`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${name}&primary_release_year=${year}`
			)
			const { results } = await resTmdb.json()
			const movie = results[0]
			if (movie) {
				await Movies.create({
					title: movie.title,
					input_title: name,
					year: movie.release_date,
					id: movie.id,
				})
				console.log(`title: ${movie.name}`)
				console.log(`input: ${name}\n`)
				count++
			} else {
				res.status(404).send({ msg: `${name} not found!` })
				return
			}
		}

		const movies = await Movies.find().sort({ title: 1 })
		await Movies.deleteMany({})
		await Movies.insertMany(movies)

		res.status(200).send({ msg: `${count} movies added!` })
	} catch (error: any) {
		res.status(500).send({ msg: error.message })
	}
}

export default apiMovieGetIdsController
