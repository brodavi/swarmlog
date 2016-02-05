var peerlog = require('../')
var memdb = require('memdb')

var log = peerlog({
  id: process.argv[2],
  sodium: require('chloride'),
  wrtc: require('wrtc'),
  db: memdb(),
  valueEncoding: 'json'
})

log.createReadStream({ live: true })
  .on('data', console.log)
