'use strict'

const Promise = require('bluebird')
const getMongoConnection = require('../libs/mongodb-client')

/**
 * Controller to store new non lexical words on DB
 *
 * @param {Object} req  Instance of http.ServerRequest
 * @param {Object} res  Instance of http.ServerResponse
 * @returns
 */
module.exports = function createNonLexicalWords (req, res) {
  const { word } = req.body

  if (!word) {
    const newError = {
      error: 'Unprocessable Entity',
      message: 'word key is required on body'
    }
    return res.status(422).json(newError)
  }

  return Promise.using(getMongoConnection(), (conn) => {
    return conn.db().collection('non-lexical-words')
      .updateOne({ word }, { $set: { word } }, { upsert: true })
  })
    .then(() => {
      return res
        .status(200)
        .json({ message: 'The word was saved successfully' })
    })
}
