var mongoose = require("mongoose");

const taskModel = new mongoose.Schema({
    taskId: {
        type: String,
        unique: true,
        required: true
    }, 
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    taskName: {
        type: String,
        required: true
    },
    taskDesc: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("taskModel", taskModel);