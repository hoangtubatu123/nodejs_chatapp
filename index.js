var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('join', function(name){
        socket.name = name;
    })

    socket.on('chat', function(message) {
        io.emit('chat', message);
    });

    socket.on('disconnect', function() {
        io.emit('chat', {name : socket.name, chat : "disconected" });
    });
});