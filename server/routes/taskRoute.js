const express = require("express");
const router = express.Router();
const TaskModel = require("../models/taskModel");
const id = require("uuid");

router.post('/add-task/:userId/', async (req, res) => {
    const userId = req.params.userId;
    const { endTimeStamp, priority, taskDesc, taskName, userName } = req.body;
    
    const prevTaskData = await TaskModel.findOne({
        userId: userId,
        taskName: taskName,
    });

    if(prevTaskData !== null){
        return res.status(200).send({
            message: `A task with the same name already exists for ${userName}! Please change task name`
        });
    }

    const newModel = new TaskModel;
    newModel.taskId = id.v4();
    newModel.userId = userId;
    newModel.userName = userName;
    newModel.taskName = taskName;
    newModel.taskDesc = taskDesc;
    newModel.createdAt = Date.now();
    // newModel.endTime = endTimeStamp;
    newModel.priority = priority;

    const saveData = await newModel.save();
    return res.status(200).send({
        success: "True",
        message: `Added task to db for user ${userName}`,
        data: saveData
    });
});

router.get('/get-tasks/:userId/', async (req, res) => {
    const userId = req.params.userId;
    const taskData = await TaskModel.find({
        userId: userId
    });

    if(taskData === null){
        return res.status(200).send({
            message: `No tasks found for ${dsg} with id - ${userId}`
        });
    }

    return res.status(200).send({
        success: 'True',
        data: taskData
    });
});

router.get('/task-detail/:taskId/', async (req, res) => {
    const taskId = req.params.taskId;
    const taskDetails = await TaskModel.findOne({
        taskId: taskId
    });

    return res.status(200).send({
        success: 'True',
        details: taskDetails
    });
});

router.post('/edit-task/:taskId/:userId/', async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const { userName, taskName, taskDesc, priority } = req.body;

    const newTaskData = await TaskModel.findOneAndUpdate({
        taskId: taskId,
        userId: userId
    }, {
        $set: {
            taskName: taskName,
            taskDesc: taskDesc,
            priority: priority
        }
    });

    if(newTaskData !== null){
        return res.status(200).send({
            success: true,
            message: "Changes Saved Successfully!"
        });
    } else {
        return res.status(500).send({
            success: false,
            message: "Some error occur!"
        });
    }
});

router.post('/delete-task/:taskId/:userId/', async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.params.userId;

    const deleteData = await TaskModel.findOneAndDelete({
        taskId: taskId,
        userId: userId
    });

    return res.status(200).send({
        success: true,
        message: "Task successfully deleted!"
    });
});

router.post('/complete-task/:taskId/:userId/', async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.params.userId;

    const updateData = await TaskModel.findOneAndUpdate({
        taskId: taskId,
        userId: userId,
        completed: false
    }, {
        $set: {
            completed: true
        }
    });

    return res.status(200).send({
        success: true,
        message: "Task successfully completed!"
    });
});

module.exports = router;