const express = require("express");
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users=[];

app.use(express.static("../chatroom")); 

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('allusers', users);
  socket.on('disconnect', function(){
    console.log('user disconnected: ' + socket.name);
    let off_name_id = users.indexOf(socket.name);
    users.splice(off_name_id,1);
    socket.broadcast.emit('offline', socket.name);
  });
  socket.on('username', function(name){
    socket.name = name;
    socket.join(name);
    users.push(name);
    io.emit('online', socket.name);
    console.log("online setting done: " + name);
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
    console.log('message: ' + msg.msg + ' from ' + socket.name + ' to ' + msg.obj);
  });
});
http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});