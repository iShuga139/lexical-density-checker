'use strict'

/**
 * Middleware that validates the provided input text
 *
 * @param {Object} req  Instance of http.ServerRequest
 * @param {Object} res  Instance of http.ServerResponse
 * @param {Object} next The next function in the stack
 * */
function validateText (req, res, next) {
  const method = req.method.toUpperCase()
  const path = req.path

  if (method !== 'GET' ||
      (method === 'GET' && path !== '/complexity')) {
    return next()
  }

  const text = req.query.text || ''
  const words = text.split(' ')

  if (!text || text.length > 1000 || words.length > 100) {
    const newError = {
      error: 'Unprocessable Entity',
      message: 'Invalid text input'
    }

    return res.status(422).json(newError)
  }

  return next()
}

module.exports = () => validateText
