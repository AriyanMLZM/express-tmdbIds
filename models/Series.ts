import { Schema, model } from 'mongoose'

const seriesSchema = new Schema({
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

const Series = model('serie', seriesSchema)

export default Series
