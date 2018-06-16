var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require("mongoose");
var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
var Chats  = require("./lib/Chats")
var User = require("./lib/User")
//set up database
const conString = "mongodb://cuong:123456a@ds159020.mlab.com:59020/chatfriend"
// const conString = "mongodb://localhost/test"



mongoose.connect(conString, { useMongoClient: true }, (err) => {
    console.log("Database connection", err)
})

server.listen(3000);



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

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/login.html")
})
app.get('/register.html', (req, res) => {
    res.sendFile(__dirname + "/views/register.html")
})
app.get('/index.html/:username', (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})


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
// login 
app.post("/login", (req, res)=> {
   User.findOne({username : req.body.username, password : req.body.password}, (err, user)=>{
       if(err){
           return res.status(500).send("Lỗi server")
       }
       if(!user){
           return res.status(404).send("Không tồn tại người này");
       }
       return res.status(200).send(user)
   })
})

// register
app.post("/register", (req, res)=>{
    try {
        User.findOne({username : req.body.username}, async (err, user)=> {
            if(err){
                return res.status(500).send("Lỗi server");
            }
            if(user){
                return res.status(404).send("Người này đã tồn tại")
            }
            var user = new User(req.body)
            await user.save()
            res.sendStatus(200);
            res.send(user)
        })
    }
    catch (err){
        res.sendStatus(500);
        res.send("Kiểm tra đường truyền")
    }
})
