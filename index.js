var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hsodium = require('hyperlog-sodium')
var defined = require('defined')

var defaultHubs = [
  'https://signalhub.mafintosh.com/',
  'https://instant.io:8080/',
  'https://signalhub.publicbits.org/'
]

module.exports = function (opts) {
  if (typeof opts === 'string') opts = { id: opts }
  if (!opts) opts = {}
  var kopts = {
    publicKey: normkey(defined(
      opts.publicKey, opts.public, opts.pub, opts.identity, opts.id
    )),
    secretKey: normkey(defined(opts.secretKey, opts.secret, opts.private))
  }
  var log = hyperlog(opts.db, hsodium(opts.sodium, kopts, opts))
  var hub = signalhub(pub, opts.hubs || defaultHubs)
  var sw = swarm(hub, opts)
  sw.on('peer', function (peer, id) {
    peer.pipe(log.replicate({ live: true })).pipe(peer)
  })
  return log
}

function normkey (id) {
  if (/\.ed25519$/.test(id)) {
    var b64 = id.replace(/\.ed25519$/,'').replace(/^@/,'')
    return Buffer(b64,'base64').toString('hex')
  } else return id
}
