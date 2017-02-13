# unsigned-swarmlog

create a p2p webrtc swarm around a [hyperlog][4]

NOT cryptographically signed, as per [substack's](https://www.npmjs.com/~substack) original swarmlog. Intended to be used by trusted group.

# example

create a hyperlog publisher that will write a new message every second:

publish.js:

``` js
var swarmlog = require('unsigned-swarmlog')
var memdb = require('memdb')

var log = swarmlog({
  keys: require('./keys.json'),
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
```

and a follower that will consume the log:

```js
var swarmlog = require('unsigned-swarmlog')
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
```

# api

```
var swarmlog = require('unsigned-swarmlog')
```

## var log = swarmlog(opts)

Create a [hyperlog][4] instance `log` from:

* `opts.db` - a [leveldb][5] instance (use [level-browserify][6] in the browser)
* `opts.valueEncoding` - valueEncoding to use for the hyperlog
* `opts.hubs` - array of [signalhub][1] hubs to use
* `opts.peerStream(peer)` - optional function that should return the stream to
use for a peer swarm connection. Use this if you want to multiplex some other
protocols on the same swarm alongside the hyperlog replication.

Optionally provide a [wrtc][3] instance as `opts.wrtc` to create a swarmlog in
node.

## log.swarm

the underlying [webrtc-swarm][7] instance

## log.hub

the underlying [signalhub][1] instance

# p2p

Currently the swarm relies on [signalhub][1] to assist in the webrtc swarm
setup, but ideally in the future this could be replaced or augmented with a
[webrtc DHT][2].

# install

```
npm install unsigned-swarmlog
```

# license

BSD

[1]: https://npmjs.com/package/signalhub
[2]: https://github.com/feross/webtorrent/issues/288
[3]: https://npmjs.com/package/wrtc
[4]: https://npmjs.com/package/hyperlog
[5]: https://npmjs.com/package/levelup
[6]: https://npmjs.com/package/level-browserify
[7]: https://npmjs.com/package/webrtc-swarm
