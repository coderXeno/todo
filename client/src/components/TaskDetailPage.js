import Container from "@mui/material/Container";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CancelIcon from '@mui/icons-material/Cancel';

export default function TaskDetail(){
    const params = useParams();
    const taskId = params.taskId;
    const [user, setUser] = useState();
    const [taskData, setTaskData] = useState();
    const [editFormOpened, setEditFormOpened] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState();
    const [pageChanged, setPageChanged] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = "https://tracko-we0x.onrender.com";

    useEffect(() => {
        const checkPrevLogin = localStorage.getItem("tracko-app");
        if(checkPrevLogin == null){
            navigate(`/`);
        } else {
            setUser(JSON.parse(checkPrevLogin));
        }

        fetch(`${BASE_URL}/api/task-detail/${taskId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            setTaskData(res.details);
        })
        .catch((err) => console.log(err));
    }, [pageChanged]);

    const handleEditTask = (event) => {
        event.preventDefault();
        const data = {
            userName: user.userName,
            taskName: newName, 
            taskDesc: newDesc,
            priority: newTaskPriority
        };

        axios.post(`${BASE_URL}/api/edit-task/${params.taskId}/${user.userId}/`, data)
            .then((res) => {
                setPageChanged((prev) => !prev);
                toast.success(res.data.message);
                setNewDesc((prev) => "");
                setNewName((prev) => "");
                setNewTaskPriority((prev) => "");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDelTask = (event) => {
        axios.post(`${BASE_URL}/api/delete-task/${taskId}/${user.userId}/`)
            .then((res) => {
                navigate(`/home/${user.userId}`)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return(
        <Container
            maxWidth = "xl"
            sx = {{ marginLeft: "400px", marginTop: "200px", width: "700px" }}
        >
            {taskData ? <Container>
                <Card sx = {{ backgroundColor: "#001e3c", color: "white" }}>
                    <CardHeader 
                        avatar = {
                            <Avatar sx={{ bgcolor: "black" }} aria-label="recipe">
                                {taskData.userName.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                        title = {<Typography>Task Name: {taskData.taskName.toUpperCase()}</Typography>}
                        subheader = {<Typography>Task Status: {taskData.completed ? "COMPLETED" : "PENDING"}</Typography>}
                        sx = {{ padding: "20px", color: 'white' }}
                    />
                    <CardContent sx = {{ marginLeft: "60px", color: "white" }}>
                        <Typography variant="body1" sx = {{ justifyContent: "center", alignItems: "center" }}>
                            Task Priority: {taskData.priority.toUpperCase()}
                        </Typography>
                        <Typography variant="body1" sx = {{ justifyContent: "center", alignItems: "center" }}>
                            Task Description: {taskData.taskDesc}
                        </Typography>

                        {editFormOpened &&
                            <form
                                style={{
                                    marginTop: "20px",
                                    marginRight: "40px"
                                }}
                            >
                                <TextField 
                                    fullWidth  
                                    value = {newName}
                                    id="outlined-basic" 
                                    label="Task Name" 
                                    variant="outlined" 
                                    sx = {{ marginBottom: "25px", marginRight: "30px", background: "white" }} 
                                    onChange = {(event) => setNewName(event.target.value)} 
                                />
                                <TextField 
                                    fullWidth
                                    id="outlined-basic" 
                                    label="Description" 
                                    variant="outlined" 
                                    value = {newDesc}
                                    sx = {{ marginBottom: "30px", background: "white" }} 
                                    onChange = {(event) => setNewDesc(event.target.value)} 
                                />

                                <TextField
                                    select
                                    label="Task Priority"
                                    value={newTaskPriority}
                                    onChange={(event) => setNewTaskPriority(event.target.value)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    sx = {{ width: "250px", background: "white" }}
                                >
                                    <option selected disabled></option>
                                    <option value={"low"}>Low</option>
                                    <option value={"medium"}>Medium</option>
                                    <option value={"high"}>High</option>
                                </TextField>
                            </form>}
                    </CardContent>
                    <CardActions sx = {{ marginLeft: "60px" }}>
                        {editFormOpened && <Button 
                            variant="contained" 
                            startIcon={<ModeEditIcon />} 
                            type="submit"
                            onClick={handleEditTask}
                        >
                            Save Changes
                        </Button>}
                        <IconButton aria-label="edit task">
                            <Fab size = "small" color="primary" aria-label="add"
                                onClick = {(event) => setEditFormOpened((prev) => !prev)}
                            >
                                {editFormOpened ? <CancelIcon /> : <ModeEditIcon />}
                            </Fab>
                        </IconButton>
                        <IconButton aria-label="delete task">
                            <Fab size = "small" color="primary" aria-label="add"
                                onClick = {handleDelTask}
                                disabled={editFormOpened}
                            >
                                <DeleteIcon />
                            </Fab>
                        </IconButton>
                    </CardActions>
                </Card>
            </Container> : <CircularProgress />}
            <ToastContainer />
        </Container>
    );
};