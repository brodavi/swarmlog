var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hsodium = require('hyperlog-sodium')
var hyperlog = require('hyperlog')
var defined = require('defined')
var pump = require('pump')
var through = require('through2')

var defaultHubs = [
  'https://signalhub.mafintosh.com',
  'https://instant.io:8080',
  'https://signalhub.publicbits.org'
]

module.exports = function (opts) {
  if (typeof opts === 'string') opts = { id: opts }
  if (!opts) opts = {}
  var keys = opts.keys || {}
  var kopts = {
    publicKey: normkey(defined(
      opts.publicKey, opts.public, opts.pub, opts.identity, opts.id,
      keys.publicKey, keys.public, keys.pub, keys.identity, keys.id
    )),
    secretKey: normkey(defined(
      opts.secretKey, opts.secret, opts.private, opts.priv,
      keys.secretKey, keys.secret, keys.private, keys.priv
    ))
  }
  var topic = kopts.publicKey.toString('hex')
  var log = hyperlog(opts.db, hsodium(opts.sodium, kopts, opts))
  var hub = signalhub('peerlog.' + topic, opts.hubs || defaultHubs)
  var sw = swarm(hub, opts)
  sw.on('peer', function (peer, id) {
    console.log('PEER!')
    pump(peer, toBuffer(), log.replicate({ live: true }), peer)
  })
  return log
}

function normkey (id) {
  if (/\.ed25519$/.test(id)) {
    var b64 = id.replace(/\.ed25519$/,'').replace(/^@/,'')
    return Buffer(b64,'base64')
  } else if (Buffer.isBuffer(id)) {
    return id
  } else if (id) return Buffer(id, 'hex')
}

function toBuffer () {
  return through.obj(function (buf, enc, next) {
    next(null, Buffer.isBuffer(buf) ? buf : Buffer(buf))
  })
}
