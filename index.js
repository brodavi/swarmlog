var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hyperlog = require('hyperlog')
var defined = require('defined')
var through = require('through2')
var pump = require('pump')

module.exports = function (opts) {
  if (!opts) opts = {}
  var topic = opts.topic || 'default-topic'
  var log = hyperlog(opts.db, opts)
  var hub = signalhub('unsigned-swarmlog.' + topic, opts.hubs)
  var sw = swarm(hub, opts)
  var peerStream = opts.peerStream || function (peer) { return peer }

  sw.on('peer', function (peer, id) {
    var stream = peerStream(peer)
    pump(stream, toBuffer(), log.replicate({ live: true }), stream)
  })
  log.swarm = sw
  log.hub = hub
  return log
}

function toBuffer () {
  return through.obj(function (buf, enc, next) {
    next(null, Buffer.isBuffer(buf) ? buf : Buffer(buf))
  })
}
