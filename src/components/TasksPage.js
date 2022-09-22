import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import NewIcon from '@mui/icons-material/OpenInNew';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function TasksPage(){
    const [status, setStatus] = useState("all");
    const [delChecked, setDelChecked] = useState({});
    const [userDetails, setUserDetails] = useState();
    const [tasks, setTasks] = useState([]);
    const [delIds, setDelIds] = useState([]);
    const [userName, setUserName] = useState();
    const handleTabChange = (event, newVal) => {
        setStatus(newVal);
    };
    const navigate = useNavigate();

    //todo 1
    //define a useEffect here to get all tasks for a particular user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("tracko-app"));
        if(user){
            setUserDetails(user);
        } else {
            navigate("/");
        }

        fetch(`/api/get-tasks/${user.userId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((res) => res.json())
        .then(res => {
            console.log(res);
            setTasks(res.data);
            setUserName(res.data[0].userName);
        })
        .then((res) => {
            tasks.map((task) => {
                setDelChecked({...delChecked, [task._id]: false});
            });
        })
        .catch((err) => console.log(err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('tracko-app');
        navigate("/");
    };

    const handleDelChange = (event, id) => {
        setDelChecked({...delChecked, [id]: !delChecked[id]});
        console.log(delChecked);
        for(var id in delChecked){
            if(delChecked[id]){
                setDelIds([...delIds, id]);
            }
        }
    };

    return(
        <Container
            maxWidth = "xl"
        >
            <AppBar position="static"
                sx={{ bgcolor: "#001e3c" }}
            >
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <Fab size = "small" color="primary" aria-label="add"
                        onClick = {(event) => navigate(`/add-task/${userDetails.userId}`)}
                    >
                        <AddIcon />
                    </Fab>
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {userName && <Avatar>{userName.charAt(0).toUpperCase()}</Avatar>}
                </Typography>
                <Button variant="contained" startIcon={<LoginIcon />} onClick = {handleLogout} 
                >
                    Logout
                </Button>
                </Toolbar>
            </AppBar>
            <Container
                maxWidth = "xl"
                sx = {{
                    background: "#001e3c",
                    borderRadius: "10px",
                    marginTop: "20px"
                }}
            >
                <Tabs 
                    value = {status} 
                    onChange = {handleTabChange} 
                    centered
                >
                    <Tab label="All Tasks" value = "all"/>
                    <Tab label="Pending" value = "pending"/>
                    <Tab label="Completed" value = "completed"/>
                    <Tab label="Expired" value = "expired"/>
                </Tabs>
            </Container>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Task Name</TableCell>
                            <TableCell align = "left">Task Description</TableCell>
                            <TableCell align = "left">Priority</TableCell>
                            <TableCell align = "left">End Timestamp</TableCell>
                            <TableCell align = "left">Delete</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tasks.map((task, index) => {
                            return <TableRow
                                key = {index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component = "th" scope = "row">{task.taskName}</TableCell>
                                <TableCell align = "left">{(task.taskDesc).slice(0,20)} ...</TableCell>
                                <TableCell align = "left">{task.priority}</TableCell>
                                <TableCell align = "left">{(task.endTime).slice(11, task.endTime.length - 8) + " " + (task.endTime).slice(0, 10)}</TableCell>
                                <TableCell align = "left">
                                    <Checkbox
                                        checked = {delChecked[index]}
                                        onChange={(event) => handleDelChange(event, task._id)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                </TableCell>
                                <TableCell align = "left">
                                    <Fab
                                        size = "small"
                                        onClick = {(event) => navigate(`/task-detail/${task.taskId}`)}
                                    >
                                        <NewIcon />
                                    </Fab>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {delChecked.lengths > 0 ? 
                <Button 
                    variant="outlined" 
                    startIcon={<DeleteIcon />}
                >
                    Delete
                </Button> : null}
        </Container>
    );
};