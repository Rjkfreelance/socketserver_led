var express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const path = require('path');
app.use(express.static('public'))

var flagLed = 0
var delay_blink = 1000

//const WPort = '4000'
const WPort = process.env.PORT || 4000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'public/index.html'))
});

http.listen(WPort, function() { //IP Server , Port
  console.log(`listening Web server on  port :${WPort}`)
});

function OnLed(cmd){
  io.sockets.emit('led',{done:cmd})
}

function OffLed(cmd){
  io.sockets.emit('led',{done:cmd})
}



io.on('connection', function(socket) {
  console.log('User connected: ' + socket.id)
  
  socket.emit('msg',{"From server clientID":socket.id})
  
  
  socket.on('disconnect', function(){
    console.log('User disconnected: ' + socket.id)
  });

  socket.on('join',(data)=>{
    console.log('JOIN => ' +data)
     io.sockets.emit('chipid',{cid:data})
   })

  socket.on('mcureset',(data)=>{
    console.log('RESET => ' +data)
     io.sockets.emit('staled',{'reset':data})
     io.sockets.emit('PReset',{prst:data})
   })

  socket.on('setTimeled',(data)=>{
    
    delay_blink = Number(data) //Set Time delay
    
  })

 io.sockets.emit('setalready',{seta:delay_blink})

/*-------------Send Toggle LED----------------*/

 setInterval(function(){
   if(flagLed == 0){
       OnLed('on')
       setTimeout(function(){
         flagLed = 1
       },delay_blink)
    }
 },delay_blink)

 setInterval(function(){
   if(flagLed == 1){
      OffLed('off')
      setTimeout(function(){
        flagLed = 0
      },delay_blink)
   } 
},delay_blink)
 

 socket.on('staled',function(sta){
   console.log(sta)
   
   io.sockets.emit('Lednow',{status:sta})
   
 })

  socket.on('rssi',function(sta){
   console.log(sta)
   
   io.sockets.emit('RSSI',{wifi:sta})
   
 })
 
})



