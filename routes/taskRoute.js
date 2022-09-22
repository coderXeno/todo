const express = require("express");
const router = express.Router();
const TaskModel = require("../models/taskModel");
const id = require("uuid");

router.post('/add-task/:userId/', (req, res) => {
    const userId = req.params.userId;
    const { endTimeStamp, priority, taskDesc, taskName, userName } = req.body;
    console.log(req.body);
    TaskModel.findOne({
        userId: userId,
        taskName: taskName,
    }, (error, prevTaskData) => {
        if(error){
            return res.send({
                success: false,
                message: `Internal Server Error while searching`,
                error: error
            });
        }

        console.log(prevTaskData);
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
        newModel.endTime = endTimeStamp;
        newModel.priority = priority;

        newModel.save((error, data) => {
            if(error){
                return res.send({
                    success: false,
                    message: `Internal Server Error while saving to db`,
                    error: error
                });
            }

            return res.status(200).send({
                success: "True",
                message: `Added task to db for user ${userName}`,
                data: data
            });
        });
    });
});

router.get('/get-tasks/:userId/', (req, res) => {
    const userId = req.params.userId;
    TaskModel.find({
        userId: userId
    }, (error, taskData) => {
        if(error){
            return res.send({
                success: false,
                message: `Internal Server Error while searching`,
                error: error
            });
        }

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
});

router.get('/task-detail/:taskId/', (req, res) => {
    const taskId = req.params.taskId;
    TaskModel.findOne({
        taskId: taskId
    }, (error, taskDetails) => {
        if(error){
            return res.send({
                success: false,
                message: `Internal Server Error while searching`,
                error: error
            });
        }

        console.log(taskId);
        console.log(taskDetails + "details");
        return res.status(200).send({
            success: 'True',
            details: taskDetails
        });
    });
});

module.exports = router;