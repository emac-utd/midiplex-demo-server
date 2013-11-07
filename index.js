var Midiplex = require('midiplex')
var midi = require('midi')
var through = require('through')
var net = require('net')

var mp = new Midiplex()

function controlServer(controlNum) {
  return net.createServer(function(stream) {
    mp.addControllerStream(stream, {maxVal: 127, controller: controlNum})
  })
}

var serverX = controlServer(1)
var serverY = controlServer(2)

serverX.listen(9001)
serverY.listen(9002)

var output = new midi.output()
console.log(output.getPortName(0))
output.openPort(0)
var midiStream = midi.createWriteStream(output)

mp.on('readable', function(){
  mp.getReadableStream().pipe(midiStream)
})
