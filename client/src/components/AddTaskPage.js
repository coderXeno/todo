import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useNavigate, useParams } from "react-router-dom";

export default function AddTaskPage(){
    const [user, setUser] = useState();
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("None");
    // const [taskEndDate, setTaskEndDate] = useState();
    // const [taskEndTime, setTaskEndTime] = useState();
    const [taskPriority, setTaskPriority] = useState();
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const checkPrevLogin = localStorage.getItem("tracko-app");

        if(checkPrevLogin == null){
            navigate(`/`);
        } else {
            setUser(JSON.parse(checkPrevLogin));
        }
        //to prevent url manipulation
        if(params.userId !== JSON.parse(checkPrevLogin).userId){
            navigate('/');
        }
    }, []);

    const notifyAddSuccess = () => {
        toast.success("Success adding new task!", {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    const notifyRedirect = () => {
        toast.warning("You will now be redirected back to the tasks page!", {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    async function handleAddTask(event){
        event.preventDefault();
        // let endTimeStamp = taskEndDate.$y + '-' + 
        // (((parseInt(taskEndDate.$M) + 1).toString().length === 2) ? 
        // (parseInt(taskEndDate.$M) + 1).toString() : 
        // ("0" + (parseInt(taskEndDate.$M) + 1).toString())) 
        // + '-' + taskEndDate.$D 
        // + "T" + taskEndTime.$H 
        // + ":" + taskEndTime.$m;

        // let finalTimeStamp = new Date(endTimeStamp);
        const data = {
            userName: user.userName,
            taskName: taskName, 
            taskDesc: taskDesc,
            // endTimeStamp: endTimeStamp,
            priority: taskPriority
        }

        fetch(`/api/add-task/${user.userId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then(res => {
            console.log(res);
            if(res.success === "True"){
                setSuccess(true);
                notifyAddSuccess();
                callSleep();
                notifyRedirect();
                navigate('/');
            }
        })
        .catch((err) => console.log(err));
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function callSleep(){
        await sleep(7000);
    }

    return(
        <Container
            maxWidth = "sm"
            sx = {{
                background: "#003a75",
                borderRadius: "10px",
                marginBottom: "20px",
                padding: "30px",
                marginTop: "100px"
            }}
        >
            <form style = {{ display: "flex", flexDirection: "column" }}>
                <h3 style = {{ marginBottom: "20px", color: "white", marginTop: "-10px", textAlign: "center" }} >Add Task</h3>
                <TextField 
                    fullWidth 
                    required 
                    value = {taskName}
                    id="outlined-basic" 
                    label="Task Name" 
                    variant="outlined" 
                    sx = {{ marginBottom: "30px" }} 
                    onChange = {(event) => setTaskName(event.target.value)} 
                />
                <TextField 
                    fullWidth
                    id="outlined-basic" 
                    label="Description (Optional)" 
                    variant="outlined" 
                    sx = {{ marginBottom: "30px" }} 
                    onChange = {(event) => setTaskDesc(event.target.value)} 
                />

                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3} sx = {{ marginBottom: "30px" }}>
                        <DesktopDatePicker
                            label="End Date"
                            inputFormat="DD/MM/YYYY"
                            value={taskEndDate}
                            onChange={(value) => setTaskEndDate(value)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TimePicker
                            label="End Time"
                            value={taskEndTime}
                            onChange={(value) => setTaskEndTime(value)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>
                </LocalizationProvider> */}
                <TextField
                    select
                    label="Task Priority"
                    value={taskPriority}
                    onChange={(event) => setTaskPriority(event.target.value)}
                    SelectProps={{
                        native: true,
                    }}
                    sx = {{ marginBottom: "30px" }}
                >
                    <option selected disabled></option>
                    <option value={"low"}>Low</option>
                    <option value={"medium"}>Medium</option>
                    <option value={"high"}>High</option>
                </TextField>
                <Button variant="contained" startIcon={<AddIcon />} onClick = {handleAddTask}>
                    Add Task
                </Button>
            </form>
            <ToastContainer />
        </Container>
    );
};