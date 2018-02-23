var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  mongodb: 'mongodb://localhost:27017/dongdongmemeda'
})
