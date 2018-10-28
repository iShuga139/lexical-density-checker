'use strict'

const sinon = require('sinon')
const { expect } = require('chai')
const sandbox = sinon.createSandbox()

const validaText = require('../../middlewares/validate-text')()
const text = require('../fixtures/text-1000')

describe('Validate text options middleware', () => {
  describe('when request is valid', () => {
    it('should call `next` for POST request', (done) => {
      const req = {
        method: 'POST',
        path: '/non-exical-word'
      }
      validaText(req, undefined, done)
    })

    it('should call `next` when path is `/`', (done) => {
      const req = {
        method: 'GET',
        path: '/'
      }
      validaText(req, undefined, done)
    })

    it('should call `next` when text has less than 100 words', (done) => {
      const req = {
        method: 'GET',
        path: '/complexity',
        query: { text: 'Kim loves going  to the  cinema' }
      }
      validaText(req, undefined, done)
    })
  })

  describe('when request is invalid', () => {
    it('should return an invalid input error', (done) => {
      const req = {
        method: 'GET',
        path: '/complexity',
        query: {}
      }
      const jsonSpy = sandbox.spy()
      const statusStub = sandbox.stub().returns({ json: jsonSpy })
      const resStub = { status: statusStub }

      const outputError = {
        error: 'Unprocessable Entity',
        message: 'Invalid text input'
      }

      validaText(req, resStub, undefined)
      expect(statusStub.firstCall.args[0]).to.deep.equal(422)
      expect(jsonSpy.firstCall.args[0]).to.deep.equal(outputError)
      done()
    })

    it('should return a response with an Error', (done) => {
      const req = {
        method: 'GET',
        path: '/complexity',
        query: { text }
      }
      const jsonSpy = sandbox.spy()
      const statusStub = sandbox.stub().returns({ json: jsonSpy })
      const resStub = { status: statusStub }

      const outputError = {
        error: 'Unprocessable Entity',
        message: 'Invalid text input'
      }

      validaText(req, resStub, undefined)
      expect(statusStub.firstCall.args[0]).to.deep.equal(422)
      expect(jsonSpy.firstCall.args[0]).to.deep.equal(outputError)
      done()
    })
  })
})
