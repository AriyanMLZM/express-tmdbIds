import { Schema, model } from 'mongoose'

const seriesDataSchema = new Schema({
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

const SeriesData = model('series-data', seriesDataSchema)

export default SeriesData
