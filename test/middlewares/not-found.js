'use strict'

const notFound = require('../../middlewares/not-found')
const express = require('express')
const request = require('supertest')

describe('Not found', () => {
  it('returns a handle error', (done) => {
    const expectedError = {
      httpStatusCode: 404,
      httpStatusShortDescription: 'Not Found',
      message: 'The requested endpoint does not exists on this API'
    }

    const app = express()
    app.use(notFound())

    request(app)
      .get('/complex')
      .set('Accept', 'application/json')
      .expect(404, expectedError)
      .end(done)
  })
})
