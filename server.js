import 'dotenv/config.js'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import formData from 'express-form-data'

import { router as profilesRouter } from './routes/profiles.js'
import { router as authRouter } from './routes/auth.js'
import { router as questionsRouter } from './routes/questions.js'
import { router as birdsRouter } from './routes/birds.js'
import { router as eventsRouter } from './routes/events.js'
import { router as supplylistRouter } from './routes/supplylists.js'

import './config/database.js'

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(formData.parse())

app.use('/api/profiles', profilesRouter)
app.use('/api/auth', authRouter)
app.use('/api/questions/', questionsRouter)
app.use('/api/birds', birdsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/supplylists', supplylistRouter)

app.use(function (req, res, next) {
  res.status(404).json({ err: 'Not found' })
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ err: err.message })
})

export { app }
