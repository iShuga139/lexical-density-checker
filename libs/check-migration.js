'use strict'

const Promise = require('bluebird')

const getMongoConnection = require('../libs/mongodb-client')
const nonLexicalWords = require('../config/non-lexical-words')

module.exports = () => {
  return Promise.using(getMongoConnection(), (conn) => {
    return nonLexicalWords.forEach((word) => {
      return conn.db().collection('non-lexical-words')
        .updateOne({ word }, { $set: { word } }, { upsert: true })
    })
  })
}
