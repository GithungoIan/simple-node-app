const log = require('signale')
require('dotenv').config({ path: '.env' })
process.on('uncaughtException', (err) => {
 log.error('UNCAUGHT EXCEPTION! 🔥  shutting down ...')
  log.error(err.name, err.message)
  log.error(err.stack)
  process.exit(1)
})

const app = require('./app')

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  log.info(`App is running on port: ${port}`)
})

process.on('unhandledRejection', (err) => {
  log.error('UNHANDLED REJECTION 🔥 shutting down ... ')
  log.error(err.name, err.message)
  log.error(err.stack)
  server.close(() => {
    process.exit(1)
  })
})
