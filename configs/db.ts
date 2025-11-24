import { connect } from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tmdb-ids'

connect(MONGO_URI)
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error)
	})
