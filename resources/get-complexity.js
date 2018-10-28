'use strict'

const Promise = require('bluebird')
const { reject } = require('lodash')
const Tokenizer = require('sentence-tokenizer')
const tokenizer = new Tokenizer('Chuck')

const getMongoConnection = require('../libs/mongodb-client')

function buildResponse (isVerbose, overalLexicalDensity, sentencesLexicalDensity) {
  const response = {
    data: {
      overall_ld: overalLexicalDensity
    }
  }

  if (isVerbose) {
    Object.assign(response.data, { sentence_ld: sentencesLexicalDensity })
  }

  return response
}

function calculateLexicalDensity (lexicalWords, totalWords) {
  return (lexicalWords / totalWords).toFixed(2)
}

function getLexicalDensity (text, nonLexicalWords, mode) {
  tokenizer.setEntry(text)

  let sentence
  let newSent
  let lexicalWords = 0
  let totalWords = 0
  let lexicalDensityBySentece = 0
  let lexicalDensityOfSentences = []

  const isVerbose = mode === 'verbose'
  const totalSent = tokenizer.getSentences().length

  for (let count = 0; count < totalSent; count++) {
    sentence = tokenizer.getTokens(count)
    newSent = reject(sentence, (word) => {
      return nonLexicalWords.includes(word.toLowerCase())
    })

    if (isVerbose) {
      lexicalDensityBySentece = calculateLexicalDensity(newSent.length, sentence.length)
      lexicalDensityOfSentences.push(lexicalDensityBySentece)
    }

    lexicalWords += newSent.length
    totalWords += sentence.length
  }

  const lexicalDensity = calculateLexicalDensity(lexicalWords, totalWords)

  return buildResponse(isVerbose, lexicalDensity, lexicalDensityOfSentences)
}

/**
 * Returns the lexical density
 *
 * @param {Object} req  Instance of http.ServerRequest
 * @param {Object} res  Instance of http.ServerResponse
 * @returns
 */
module.exports = function getComplexity (req, res) {
  const { mode, text } = req.query

  return Promise.using(getMongoConnection(), (conn) => {
    return conn
      .db()
      .collection('non-lexical-words')
      .find()
      .toArray((err, nonLexicalWords) => {
        if (err) throw err

        const lowCaseWords = nonLexicalWords.map((word) => word.toLowerCase())
        const lexicalDensity = getLexicalDensity(text, lowCaseWords, mode)

        return res
          .status(200)
          .json(lexicalDensity)
      })
  })
    .catch((err) => {
      const newError = {
        message: 'Internal Server Error',
        error: err.message
      }
      return res
        .status(500)
        .json(newError)
    })
}
