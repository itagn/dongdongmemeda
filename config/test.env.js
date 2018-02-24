var merge = require('webpack-merge')
var devEnv = require('./dev.env')
var info = require('./info')
module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  mongodb: info.mongodb.url

})
