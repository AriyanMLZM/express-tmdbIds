import { Schema, model } from 'mongoose'

const moviesSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	input_title: {
		type: String,
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
})

const Movies = model('movie', moviesSchema)

export default Movies
