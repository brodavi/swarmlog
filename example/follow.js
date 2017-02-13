var swarmlog = require('../')
var memdb = require('memdb')

var log = swarmlog({
  db: memdb(),
  topic: 'mytopic',
  valueEncoding: 'json',
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

log.createReadStream({ live: true })
  .on('data', function (data) {
    console.log('RECEIVED', data)
  })
