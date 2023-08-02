const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api', require("./routes/authRoute"));
app.use('/api', require("./routes/taskRoute"));

const port = 8000;
const mongoServer = process.env.MONGO_SERVER;
mongoose.connect(mongoServer, {
    useNewUrlParser: true
}).then((res) => console.log("Connected to DB"))
.catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`server running at ${port}`);
});