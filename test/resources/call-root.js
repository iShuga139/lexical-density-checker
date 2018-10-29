'use strict'

const sinon = require('sinon')
const request = require('supertest')
const Fraudster = require('fraudster')

const sandbox = sinon.createSandbox()
const fraudster = new Fraudster({
  warnOnUnregistered: false,
  cleanCacheOnDisable: true
})

const apiEndpointPath = '/'
let app

describe(`GET ${apiEndpointPath}`, () => {
  before((done) => {
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

  it('should return a friendly message', (done) => {
    const friendlyMessage = 'Welcome to Lexical Density Checker'

    request(app)
      .get(apiEndpointPath)
      .set('Accept', 'application/json')
      .expect(200, friendlyMessage)
      .end((err) => {
        if (err) {
          return done(err)
        }

        return done()
      })
  })
})
