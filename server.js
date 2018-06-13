// import mongoose from "mongoose";
var express = require('express')
var mongoose = require("mongoose")
mongoose.Promise = Promise;
// socket.io

var io      = require('socket.io')(server);
// var conString = "mongodb://cuong:123456a@ds159020.mlab.com:59020/chatfriend";
var conString = "mongodb://localhost/test"

var bodyParser = require("body-parser")
var app = express()
var server  = require('http').createServer(app);
// sửa lỗi cannot get
app.use(express.static(__dirname))
// để sửa lỗi  getting undefined at the place var chat = new Chats(req.body) -> parse dữ liệu
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


//set up database

// tao model
var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})
mongoose.connect(conString, { useMongoClient: true }, (err) => {
    console.log("Database connection", err)
})
// app.listen(3020, () => {
//     console.log("Well done, now I am listening...")
// })
// connection socket
io.on("connection", (socket) => {
    console.log("Socket is connected...")
})
// Now that we have a new HTTP server, and we should change our listen code to our new HTTP.

// var server = http.listen(3020, () => {
//     console.log("Well done, now I am listening on ", server.address().port)
// })

// truyền message lên serve
app.post("/chats", async (req, res) => {
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
        //emit event
        io.emit("chat", req.body)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})
// get các collections từ model Chats
app.get("/chats", (req, res) => {
    // res.send("dsads");
    Chats.find({}, (error, chats) => {
        res.send(chats)
    })
})
server.listen(3020, function(){
    console.log('listening on *:3020');
});

