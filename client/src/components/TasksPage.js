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
import { useNavigate, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import NewIcon from '@mui/icons-material/OpenInNew';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import SortIcon from '@mui/icons-material/Sort';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import _ from "lodash";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function TasksPage(){
    const [status, setStatus] = useState("all");
    const [delChecked, setDelChecked] = useState({});
    const [userDetails, setUserDetails] = useState();
    const [tasks, setTasks] = useState([]);
    const [prioritySortedTasks, setPrioritySortedTasks] = useState([]);
    const [prioritySort, setPrioritySort] = useState(false);
    const [delIds, setDelIds] = useState([]);
    const [userName, setUserName] = useState();
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currPage, setCurrPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [pageChanged, setPageChanged] = useState(false);
    const handleTabChange = (event, newVal) => {
        setStatus(newVal);
    };
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("tracko-app"));
    const params = useParams();

    useEffect(() => {
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
            let pageNos = [];
            for(let i = 0; i < Math.ceil(tasks.length/itemsPerPage); i++){
                pageNos.push(i + 1);
            }
            setPageNumbers(pageNos);
        })
        .catch((err) => console.log(err));
    }, [pageChanged]);

    const handleLogout = () => {
        localStorage.removeItem('tracko-app');
        navigate("/");
    };

    const handleDeleteTask = (event, taskId) => {
        axios.post(`/api/delete-task/${taskId}/${params.userId}/`)
            .then((res) => {
                setPageChanged((prev) => !prev);
                toast.success("Task Deleted Successfully!");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePrioritySort = (event) => {
        let newTaskSet = _.cloneDeep(tasks);
        
        newTaskSet.sort((a, b) => {
            const priorityOrder = { "low": 1, "medium": 2, "high": 3 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        setTasks((prev) => newTaskSet);
        setPrioritySort((prev) => !prev);
    };

    const handleCompletionSort = (event) => {
        let newTaskSet = _.cloneDeep(tasks);
        
        newTaskSet.sort((a, b) => {
            return a.completed - b.completed;
          });

        setTasks((prev) => newTaskSet);
        setPrioritySort((prev) => !prev);
    };

    const handleCompleteTask = (event, taskId) => {
        axios.post(`/api/complete-task/${taskId}/${params.userId}/`)
            .then((res) => {
                setPageChanged((prev) => !prev);
                toast.success("Task Completed Successfully!");
            })
            .catch((err) => {
                console.log(err);
            });
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
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: "20px" }}>
                    T R A C K O
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
                    <Tab label="All Tasks" value = "all" sx={{ }} />
                </Tabs>
            </Container>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align = "left">Task Name</TableCell>
                            <TableCell align = "left">Task Description</TableCell>
                            <TableCell align = "left">
                                Priority
                                <IconButton 
                                    aria-label="delete" 
                                    onClick = {handlePrioritySort}
                                >
                                    <FilterListIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell align = "left">
                                Completed?
                                <IconButton 
                                    aria-label="delete" 
                                    onClick = {handleCompletionSort}
                                >
                                    <FilterListIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell align = "left">Delete</TableCell>
                            <TableCell align = "left">Details</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tasks
                            .map((task, index) => {
                                return <TableRow
                                    key = {index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component = "th" scope = "row">{index + 1}</TableCell>
                                    <TableCell align = "left">{task.taskName}</TableCell>
                                    <TableCell align = "left">{(task.taskDesc).slice(0,20)} ...</TableCell>
                                    <TableCell align = "left">{task.priority.toUpperCase()}</TableCell>
                                    {/* <TableCell align = "left">{(task.endTime).slice(11, task.endTime.length - 8) + " " + (task.endTime).slice(0, 10)}</TableCell> */}
                                    <TableCell align = "left">
                                        <Fab
                                            size = "small"
                                            disabled={task.completed}
                                            onClick = {(event) => handleCompleteTask(event, task.taskId)}
                                        >
                                            <TaskAltIcon />
                                        </Fab>
                                    </TableCell>
                                    <TableCell align = "left">
                                        <Fab
                                            size = "small"
                                            onClick = {(event) => handleDeleteTask(event, task.taskId)}
                                        >
                                            <DeleteIcon />
                                        </Fab>
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
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <div
                style = {{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    marginTop: "10px" 
                }}
            >
                {pageNumbers.map((number) => {
                    return(
                        <button
                            style={{ 
                                color: "white", 
                                border: "none", 
                                width: "10px", 
                                height: "10px" 
                            }}
                        >
                            {number}
                        </button>
                    );
                })}
            </div>
            <ToastContainer />
        </Container>
    );
};