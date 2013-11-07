var Midiplex = require('midiplex')
var es = require('event-stream')
var dgram = require('dgram')
var midi = require('midi')
var through = require('through')

function udpSocket() { return new dgram.createSocket('udp4') }

function udpStream(socket) {
  return es.readable(function(count, callback) {
    var self = this
    socket.on('message', function(buf){
      self.emit('data', buf)
      callback()
    })
  })
}
var mp = new Midiplex()

var modSocketX = udpSocket()
var velSocket = udpSocket()
var modSocketY = udpSocket()

var modXStream = udpStream(modSocketX)
var velStream = udpStream(velSocket)
var modYStream = udpStream(modSocketY)

mp.addControllerStream(modXStream, {maxVal: 127, controller: 1})
//mp.setVelocityStream(velStream, {maxVal: 200})
mp.addControllerStream(modYStream, {maxVal: 127, controller: 2})

modSocketX.bind(9001)
modSocketY.bind(9002)

var output = new midi.output()
console.log(output.getPortName(1))
output.openPort(1)
var midiStream = midi.createWriteStream(output)
mp.getReadableStream().pipe(midiStream)
