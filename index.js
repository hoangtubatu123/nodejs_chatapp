var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require("mongoose")
//set up database
const conString = "mongodb://cuong:123456a@ds159020.mlab.com:59020/chatfriend"
var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})

mongoose.connect(conString, { useMongoClient: true }, (err) => {
    console.log("Database connection", err)
})

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

//database
app.post("/chat",  async(req, res) =>{
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
        io.emit('chat', req.body)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})
app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        res.send(chats)
    })
})

