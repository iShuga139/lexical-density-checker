'use strict'

const sinon = require('sinon')
const { expect } = require('chai')
const Fraudster = require('fraudster')

const sandbox = sinon.createSandbox()
const fraudster = new Fraudster({
  warnOnUnregistered: false,
  cleanCacheOnDisable: true
})

let createApp

describe('Application loads successfully', () => {
  before((done) => {
    fraudster.registerMock('../libs/check-migration', () => sandbox.stub())
    fraudster.enable()

    createApp = require('../../src/app')
    done()
  })

  after(() => {
    fraudster.disable()
  })

  it('should mount all routes', () => {
    return createApp()
      .then(app => {
        const routeOne = app._router.stack[6]
        const routeTwo = app._router.stack[7]
        const routeThree = app._router.stack[8]

        expect(routeOne.route.path).to.be.equal('/')
        expect(routeTwo.route.path).to.be.equal('/complexity')
        expect(routeThree.route.path).to.be.equal('/non-lexical-word')
      })
  })
})
