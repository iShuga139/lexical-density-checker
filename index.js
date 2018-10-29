'use strict'

const fs = require('fs')
const http = require('http')
const https = require('https')
const winston = require('winston')

const config = require('./config/defaults')
const initializeApp = require('./src/app')

initializeApp()
  .then((app) => {
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    })
    let server

    if (config.tls.enabled) {
      const tlsOptions = {
        key: fs.readFileSync(config.tls.keyPath),
        cert: fs.readFileSync(config.tls.certPath)
      }

      server = https.createServer(tlsOptions, app)
    } else {
      server = http.createServer(app)
    }

    server.listen(config.server.port, () => {
      logger.info(`Listening on port ${server.address().port}`)
    })

    const emitShutdown = () => {
      logger.info(`Closing port ${server.address().port}`)
      server.close()

      logger.info('Shuting down ...')
      process.exit(0)
    }

    process.once('SIGINT', emitShutdown)
    process.once('SIGTERM', emitShutdown)

    process.on('uncaughtException', emitShutdown)
  })
  .catch((error) => {
    const logger = winston.createLogger({
      level: 'error',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    })

    logger.error('An error occurred, could not initialize the app')
    logger.error(error.stack)

    process.exit(1)
  })
