import express, { NextFunction, Request, Response } from 'express'
import * as http from 'http'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'

import { internalErrorMiddleware } from '@/handler/error'
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
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  console.log(req)
  return res.status(200).json({ message: 'success' })
})

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
