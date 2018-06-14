var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require("mongoose");
var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
//set up database
const conString = "mongodb://cuong:123456a@ds159020.mlab.com:59020/chatfriend"
// const conString = "mongodb://localhost/test"
var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})

mongoose.connect(conString, { useMongoClient: true }, (err) => {
    console.log("Database connection", err)
})

server.listen(3000);
// app.get('/', function(request, response) {
//     axios.get("https://www.facebook.com/nguyenhung.cuong.3532").then((res)=>{
//         response.send(res.data);
//     }).catch((error)=>{
//         response.send(error);
//     })
//     // response.sendFile(__dirname + '/index.html');
// });
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on('connection', function(socket) {
    socket.on('join', function(name){
        socket.name = name;
        io.emit('chat', {name : name, chat : "Đã vào phòng chat"})
    })
    socket.on('chat', function(message) {
        io.emit('chat', message);
    });

    socket.on('disconnect', function() {
        io.emit('chat', {name : socket.name, chat : "disconected" });
    });
});

//database
app.post("/chats",  async(req, res) =>{
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
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

