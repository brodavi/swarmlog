var swarmlog = require('../')
var memdb = require('memdb')

var log = swarmlog({
  db: memdb(),
  topic: 'mytopic',
  valueEncoding: 'json',
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

var times = 0
setInterval(function () {
  log.append({ time: Date.now(), msg: 'HELLO!x' + times })
  times++
}, 1000)
