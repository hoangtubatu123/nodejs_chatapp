var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username : {type : String, unique : true},
    password : {type : String},
    email : String,
    phone : String
})
var User = mongoose.model("User", userSchema);
module.exports = User;