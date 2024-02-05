const express =  require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan =  require("morgan")
const rfs = require('rotating-file-stream')
const path = require('path')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./utils/errorController')
const testRouter = require('./routes/testRoutes')

const app = express()
// Implement CORS
app.use(cors())
app.options("*", cors())

// set security HTTP headers
app.use(helmet())

// development logging
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs/access'),
})

const errorLogStream = rfs.createStream('error.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs/error'),
})

morgan.token('error', (req, res) => `${res.message} - ${res.stack}`)
const getCustomErrorMorganFormat = () =>
  JSON.stringify({
    method: ':method',
    url: ':url',
    response_time: ':response-time',
    status: ':status',
    timestamp: ':date[iso]',
    headers_count: 'req-headers-length',
    error: ':error',
  })

app.use(
  morgan(getCustomErrorMorganFormat(), {
    skip: (req, res) => res.statusCode < 400,
    stream: errorLogStream,
  }),
)

app.use(
  morgan('combined', {
    stream: accessLogStream,
  }),
)


// body parsing
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.use("/", testRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find  ${req.originalUrl} on this server!`, 404))
})
app.use(globalErrorHandler)

module.exports = app
