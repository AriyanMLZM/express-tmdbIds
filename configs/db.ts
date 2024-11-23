import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tmdb-ids'

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as mongoose.ConnectOptions)
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error)
	})
