var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var info = require('./info')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  mongodb: info.mongodb.url
})
