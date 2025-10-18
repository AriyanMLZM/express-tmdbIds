import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import('./configs/db')

import apiRouter from './routes/api'

dotenv.config()
const app = express()

const port = process.env.PORT || 4000
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

app.use('/api', apiRouter)

app.listen(port, () => console.log(`Server says Hi from ${port}.`))
