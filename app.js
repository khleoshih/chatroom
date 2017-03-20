const express = require("express");
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users=[];

/*app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});*/

app.use(express.static("../chatroom")); 

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    let off_name_id = users.indexOf(socket.name);
    users.splice(off_name_id,1);
    socket.broadcast.emit('offline', socket.name);
    console.log('user disconnected');
  });
  socket.on('username', function(name){
    socket.name = name;
    socket.join(name);
    io.sockets.in(name).emit('allusers', users);
    users.push(name);
    io.emit('online', socket.name);
  });
  socket.on('chat message', function(msg){
    let m = {
      head: socket.name,
      message: msg.msg,
      to: msg.obj
    }
    if (msg.obj === "public"){
      io.emit('chat', m);
    }
    else{
      io.sockets.in(msg.obj).emit('chat', m);
    }
    console.log('message: ' + msg + ' from ' + socket.name + ' to ' + msg.obj);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});