var peerlog = require('../')
var memdb = require('memdb')

var log = peerlog({
  id: '@xHanYy2j0Sm58YVEt9k1COWuec5GDke93P2GhIVCyGM=.ed25519',
  //id: process.argv[2],
  sodium: require('chloride/browser'),
  //wrtc: require('wrtc'),
  db: memdb(),
  valueEncoding: 'json',
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

log.createReadStream({ live: true })
  .on('data', function (data) {
    console.log('RECEIVED', data)
  })
