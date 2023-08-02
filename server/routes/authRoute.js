const express = require("express");
const router = express.Router();
const AuthModel = require("../models/authModel");
const uuid = require("uuid");

router.post("/register/", async (req, res) => {
    const { userName, email, password } = req.body;

    const loginData = await AuthModel.findOne({
        userName: userName,
        email: email
    });

    if(loginData !== null){
        return res.status(200).send({
            message: "An account with the given credentials already exists!"
        });
    } 

    const newModel = new AuthModel;
    newModel.userId = uuid.v4();
    newModel.userName = userName;
    newModel.email = email;
    newModel.password = password;
    newModel.createdAt = Date.now();

    const saveData = await newModel.save();
    if(saveData){
        return res.status(200).send({
            success: true,
            message: "Added user to db",
            data: {
                userName: saveData.userName,
                userId: saveData.userId,
                createdAt: saveData.createdAt,
                email: saveData.email
            }
        });
    } else {
        return res.status(500).send({
            success: false,
            message: `Save Internal Server Error ${error}`
        });
    }
});

router.post("/login/", async (req, res) => {
    const { userName, password } = req.body;

    const loginData = await AuthModel.findOne({
        userName: userName,
        password: password
    });

    if(loginData === null){
        res.status(404).send({
            message: "No User Found with given credentials"
        });
    } else {
        res.status(200).send({
            success: true,
            message: "Logged in successfully",
            data: {
                userName: loginData.userName,
                userId: loginData.userId,
                createdAt: loginData.createdAt,
                email: loginData.email
            }
            //data: loginData
        });
    }
});

module.exports = router;