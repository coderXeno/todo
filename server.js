const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api', require("./routes/authRoute"));
app.use('/api', require("./routes/taskRoute"));

const port = 8000;
mongoose.connect('mongodb://localhost:27017/todo-db', {
    useNewUrlParser: true
}).then((res) => console.log("Connected to DB"))
.catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`server running at ${port}`);
});