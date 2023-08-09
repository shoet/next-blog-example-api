import * as http from 'http'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'

import { tryWrapAPI, internalErrorMiddleware } from '@/handlers/error'
import { getUserHandler } from '@/handlers/user'
import { morgan } from '@/lib/morgan'

import { getEnvConfig } from '@/util/config'

dotenv.config()

const envConfig = getEnvConfig(process.env.NODE_ENV)
const app = express()
const server = http.createServer(app)

// Utility Middleware ---------------------------------------------
app.use(cookieParser())
const corsOptions = {
  ...(process.env.CLIENT_URL ? { origin: process.env.CLIENT_URL } : {}),
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan)
app.use(helmet())

// app.use(session()) // express-session

// Route Handler --------------------------------------------------
app.get('/user/:id', tryWrapAPI(getUserHandler))

// blog crud
app.get('/blog/:id', tryWrapAPI())
app.post('/blog/new')
app.post('/blog/delete/:id')
app.post('/blog/update/:id')

// Error Middleware ----------------------------------------------------
app.use(internalErrorMiddleware)

// Server Setting -----------------------------------------------------
app
  .listen(envConfig.app.port, () =>
    console.log(`Start listening port ${envConfig.app.port}`),
  )
  .on('error', (err) => {
    console.error(err)
    process.exit()
  })

const timeout = 30 * 1000
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('closing server')
  })
  const timer = setTimeout(() => {
    process.exit(1)
  }, timeout)
  timer.unref()
})
