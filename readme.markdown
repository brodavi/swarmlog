# swarmlog

create a p2p swarm around a [hyperlog][4]

# example

first generate some ed25519 keys:

```
$ node -pe "JSON.stringify(require('ssb-keys').generate())" > keys.json
```

now create a hyperlog publisher that will write a new message every second:

publish.js:

``` js
var swarmlog = require('swarmlog')
var memdb = require('memdb')

var log = swarmlog({
  keys: require('./keys.json'),
  sodium: require('chloride/browser'),
  db: memdb(),
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

# api

```
var swarmlog = require('swarmlog')
```

## var log = swarmlog(opts)

Create a [hyperlog][4] instance `log` from:

* `opts.sodium` - a sodium instance: `require('sodium')` in node or
`require('chloride/browser')` in the browser
* `opts.db` - a [leveldb][5] instance (use [level-browserify][6] in the browser)
* `opts.valueEncoding` - valueEncoding to use for the hyperlog
* `opts.hubs` - array of [signalhub][1] hubs to use
* `opts.publicKey` - (or `opts.public`) - ed25519 public key
* `opts.secretKey` - (or `opts.private`) - ed25519 private key
* `opts.keys` - object, another place to put `publicKey/public` and
`secretKey/privateKey/private`

Public and private keys are either a hex string, a binary `Buffer`, or a
base64-encoded string ending with `'.ed25519'` (ssb-keys style).

If `opts` is a string it will be interpreted as the `opts.publicKey` for easier
following.

Optionally provide a [wrtc][3] instance as `opts.wrtc` to create a swarmlog in
node.

# p2p

Currently the swarm relies on [signalhub][1] to assist in the webrtc swarm
setup, but ideally in the future this could be replaced or augmented with a
[webrtc DHT][2].

# install

```
npm install swarmlog
```

# license

BSD

[1]: https://npmjs.com/package/signalhub
[2]: https://github.com/feross/webtorrent/issues/288
[3]: https://npmjs.com/package/wrtc
[4]: https://npmjs.com/package/hyperlog
[5]: https://npmjs.com/package/levelup
[6]: https://npmjs.com/package/level-browserify
