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

const apiEndpointPath = '/non-lexical-word'
let app

let updateOneStub
let mongoDBClientMock

describe(`POST ${apiEndpointPath}`, () => {
  before((done) => {
    updateOneStub = sandbox.stub()
    mongoDBClientMock = {
      db: sandbox.spy(() => mongoDBClientMock),
      collection: sandbox.spy(() => mongoDBClientMock),
      updateOne: updateOneStub
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

  it('returns a 422 response', (done) => {
    const errorResponse = {
      error: 'Unprocessable Entity',
      message: 'word key is required on body'
    }

    request(app)
      .post(apiEndpointPath)
      .set('Accept', 'application/json')
      .expect(422, errorResponse)
      .end((err) => {
        if (err) {
          return done(err)
        }

        updateOneStub.calledOnce.should.be.false
        return done()
      })
  })

  it('returns a 200 response and inserts to database', (done) => {
    const expectedResponse = { message: 'The word was saved successfully' }

    request(app)
      .post(apiEndpointPath)
      .set('Accept', 'application/json')
      .send({
        word: 'bla'
      })
      .expect(200, expectedResponse)
      .end((err) => {
        if (err) {
          return done(err)
        }

        updateOneStub.calledOnce.should.be.true
        return done()
      })
  })
})
