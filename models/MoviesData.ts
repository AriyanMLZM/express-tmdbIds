import { Schema, model } from 'mongoose'

const moviesDataSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	input_title: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	poster: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
	rate: {
		type: Number,
		required: true,
	},
})

const MoviesData = model('movies-data', moviesDataSchema)

export default MoviesData
