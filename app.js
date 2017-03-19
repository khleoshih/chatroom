var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('username', function(name){
    socket.name = name;
    socket.join(name);
  });
  socket.on('chat message', function(msg){
    io.sockets.in(msg.obj).emit('chat', socket.name + ': ' + msg.msg);
    console.log('message: ' + msg + ' from ' + socket.name + ' to ' + msg.obj);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});