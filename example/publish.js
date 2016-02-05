var peerlog = require('../')
var memdb = require('memdb')

var log = peerlog({
  keys: require('./keys.json'),
  sodium: require('chloride'),
  wrtc: require('wrtc'),
  db: memdb(),
  valueEncoding: 'json'
})

var msg = process.argv.slice(2).join(' ')
log.append({ time: Date.now(), msg: msg }, onpublish)

function onpublish (err, node) {
  if (err) console.error(err)
  else console.log(node.key)
}
