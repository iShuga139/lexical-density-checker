'use strict'

const cors = require('cors')
const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')

const notFound = require('../middlewares/not-found')
const validateText = require('../middlewares/validate-text')

const checkMigration = require('../libs/check-migration')

const getComplexity = require('../resources/get-complexity')
const createNonLexicalWords = require('../resources/create-non-lexical-words')

/**
 * Initialize the Express app
 *
 * @return {object} The initialized Express app
 * */
module.exports = function lexicalDensityApp () {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cors())

  app.use(validateText())

  app.get('/', (_req, res) => res.send('Welcome to Lexical Density Checker'))
  app.get('/complexity', getComplexity)
  app.post('/non-lexical-word', createNonLexicalWords)

  app.use(notFound())

  return new Promise((resolve) => {
    resolve(checkMigration())
  })
    .return(app)
}
