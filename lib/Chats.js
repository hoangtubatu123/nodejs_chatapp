var mongoose = require("mongoose");
var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})
module.exports = Chats