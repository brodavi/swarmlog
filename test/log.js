var swarmlog = require('../')
var memdb = require('memdb')
var test = require('tape')
var sodium = require('sodium')
var signalhub = require('signalhub/server')
var wrtc = require('wrtc')

test('log', function (t) {
  t.plan(3)
  var hub = signalhub()
  hub.listen(0, function () {
    var href = 'http://localhost:' + hub.address().port
    var publisher = swarmlog({
      keys: require('./keys.json'),
      sodium: sodium,
      wrtc: wrtc,
      db: memdb(),
      valueEncoding: 'json',
      hubs: [ href ]
    })
    var follower = swarmlog({
      publicKey: require('./keys.json').public,
      sodium: sodium,
      wrtc: wrtc,
      db: memdb(),
      valueEncoding: 'json',
      hubs: [ href ]
    })
    publisher.append({ x: 'HELLO-0' })
    publisher.append({ x: 'HELLO-1' })
    publisher.append({ x: 'HELLO-2' })

    var expected = [
      { x: 'HELLO-0' },
      { x: 'HELLO-1' },
      { x: 'HELLO-2' }
    ]
    follower.createReadStream({ live: true })
      .on('data', function (data) {
        t.deepEqual(data.value, expected.shift())
      })

    t.once('end', function () {
      hub.close()
    })
  })
})

test(function (t) {
  t.end()
  process.exit(0)
})
