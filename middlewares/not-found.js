'use strict'

/**
 * Middleware to handle not found endpoints
 *
 * @param  {Object}   req Instance of http.ServerRequest
 * @param  {Object}   res Instance of http.ServerResponse
 * @return {Function}     The Not Found middleware
 * */
function notFoundHandler (_req, res) {
  return res.status(404)
    .json({
      httpStatusCode: 404,
      httpStatusShortDescription: 'Not Found',
      message: 'The requested endpoint does not exists on this API'
    })
}

module.exports = () => notFoundHandler
