var mongoose = require("mongoose");

const profileModel = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: true,
        unique: true
    },
    profilePic: {

    }
});

