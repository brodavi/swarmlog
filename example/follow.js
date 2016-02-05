var swarmlog = require('../')
var memdb = require('memdb')

var log = swarmlog({
  publicKey: require('./keys.json').public,
  sodium: require('chloride/browser'),
  db: memdb(),
  valueEncoding: 'json',
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

log.createReadStream({ live: true })
  .on('data', function (data) {
    console.log('RECEIVED', data)
  })
