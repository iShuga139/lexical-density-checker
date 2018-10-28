'use strict'

require('chai').should()
const sinon = require('sinon')
const request = require('supertest')
const Fraudster = require('fraudster')

const sandbox = sinon.createSandbox()
const fraudster = new Fraudster({
  warnOnUnregistered: false,
  cleanCacheOnDisable: true
})

const apiEndpointPath = '/complexity'
let app

let results
let errorStub
let toArrayStub
let mongoDBClientMock

describe(`GET ${apiEndpointPath}`, () => {
  before((done) => {
    toArrayStub = (callback) => {
      callback(errorStub, results)
    }
    mongoDBClientMock = {
      db: sandbox.spy(() => mongoDBClientMock),
      collection: sandbox.spy(() => mongoDBClientMock),
      find: sandbox.spy(() => mongoDBClientMock),
      toArray: toArrayStub
    }

    fraudster.registerMock('../libs/mongodb-client', () => mongoDBClientMock)
    fraudster.registerMock('../libs/check-migration', () => sandbox.stub())
    fraudster.enable()

    require('../../src/app')()
      .then((result) => {
        app = result
      })
      .then(done)
  })

  after(() => {
    fraudster.disable()
  })

  afterEach(() => {
    sandbox.resetHistory()
  })

  it('should return a HTTP 422 response', (done) => {
    const exprectedError = {
      error: 'Unprocessable Entity',
      message: 'Invalid text input'
    }

    request(app)
      .get(apiEndpointPath)
      .set('Accept', 'application/json')
      .expect(422, exprectedError)
      .end((err) => {
        if (err) {
          return done(err)
        }

        return done()
      })
  })

  it('should return a response with lexical density', (done) => {
    results = ['to', 'the']

    const queryString = '?text=Kim loves going  to the  cinema'
    const url = `${apiEndpointPath + queryString}`

    const expectedResponse = {
      data: {
        overall_ld: '0.67'
      }
    }

    request(app)
      .get(url)
      .set('Accept', 'application/json')
      .expect(200, expectedResponse)
      .end((err) => {
        if (err) {
          return done(err)
        }

        return done()
      })
  })

  it('should return a response with lexical density and for each sentence', (done) => {
    results = ['to', 'the']

    const queryString = '?mode=verbose&text=Kim loves going  to the  cinema'
    const url = `${apiEndpointPath + queryString}`

    const expectedResponse = {
      data: {
        sentence_ld: ['0.67'],
        overall_ld: '0.67'
      }
    }

    request(app)
      .get(url)
      .set('Accept', 'application/json')
      .expect(200, expectedResponse)
      .end((err) => {
        if (err) {
          return done(err)
        }

        return done()
      })
  })

  it('should return a Internal Server Error', (done) => {
    errorStub = new Error('Error on MongoDB')

    const exprectedError = {
      error: 'Error on MongoDB',
      message: 'Internal Server Error'
    }

    const queryString = '?mode=verbose&text=Kim loves going  to the  cinema'
    const url = `${apiEndpointPath + queryString}`

    request(app)
      .get(url)
      .set('Accept', 'application/json')
      .expect(500, exprectedError)
      .end((err) => {
        if (err) {
          return done(err)
        }

        return done()
      })
  })
})
