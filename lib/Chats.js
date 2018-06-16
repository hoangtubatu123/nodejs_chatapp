var mongoose = require("mongoose");
var Chats = mongoose.model("Chats", {
    receiver : String,
    sender: String,
    chat: String,
})
module.exports = Chats