'use strict'

const Promise = require('bluebird')
const { MongoClient } = require('mongodb')
const url = require('../config/defaults').database.url

/**
 * Get a MongoDB connection with a disposer to use with
 * Bluebird's Promise.using
 *
 * @param  {Object} opts Connection parameter for MongoDB
 * @return {Object}      MongoDB connection with a disposer
 */
function getConnectionWithDisposer () {
  return MongoClient.connect(url, {
    useNewUrlParser: true,
    promiseLibrary: Promise
  })
    .disposer(conn => conn.close())
}

module.exports = getConnectionWithDisposer
