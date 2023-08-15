import * as http from 'http'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import * as authHandler from '@/handlers/auth'
import * as blogHandler from '@/handlers/blog'
import * as categoryHandler from '@/handlers/category'
import { tryWrapAPI, internalErrorMiddleware } from '@/handlers/error'
import * as userHandler from '@/handlers/user'
import { morgan } from '@/lib/morgan'
import { NotFound } from '@/type/error'
import { envVarNotSetMessage } from '@/util/error'

dotenv.config()

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
app.get('/user/:id', tryWrapAPI(userHandler.getUserHandler))

// blog crud
app.get('/blog/ids', tryWrapAPI(blogHandler.getBlogIdsHandler))
app.get('/blog/:id', tryWrapAPI(blogHandler.getBlogHandler))
app.post('/blog/new', tryWrapAPI(blogHandler.addBlogHandler))
app.post('/blog/delete/:id')
app.post('/blog/update/:id')

app.get('/category', tryWrapAPI(categoryHandler.getCategoryHandler))

// public
app.post('/image/new')
app.get('/image/public/:id')
app.get('/image/private/:id')
app.post('/image/delete/:id')

// TODO: lite stream

// auth
app.post('/auth/signin', tryWrapAPI(authHandler.signInHandler))
app.post('/auth/signup', tryWrapAPI(authHandler.signUpHandler))

// NotFound wrapper
app.get(
  '*',
  tryWrapAPI(() => {
    throw new NotFound()
  }),
)

// Error Middleware ----------------------------------------------------
app.use(internalErrorMiddleware)

// Server Setting -----------------------------------------------------
if (!process.env.APP_PORT) {
  console.log(envVarNotSetMessage('APP_PORT'))
  process.exit(1)
}
app
  .listen(process.env.APP_PORT, () =>
    console.log(`Start listening port ${process.env.APP_PORT}`),
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
