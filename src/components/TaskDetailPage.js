import Container from "@mui/material/Container";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function TaskDetail(){
    const params = useParams();
    const taskId = params.taskId;
    const [taskData, setTaskData] = useState();
    const [editFormOpened, setEditFormOpened] = useState(false);

    useEffect(() => {
        fetch(`/api/task-detail/${taskId}/`, {
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
    }, []);

    return(
        <Container
            maxWidth = "xl"
            sx = {{ marginLeft: "500px", marginTop: "200px" }}
        >
            {taskData ? <Container>
                <Card sx = {{ maxWidth: 550, backgroundColor: "#001e3c" }}>
                    <CardHeader 
                        avatar = {
                            <Avatar sx={{ bgcolor: "black" }} aria-label="recipe">
                                {taskData.userName.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                        title = {taskData.taskName.toUpperCase()}
                        subheader = {`Ending at ${(taskData.endTime).slice(11, taskData.endTime.length - 8) + " " + (taskData.endTime).slice(0, 10)}`}
                        sx = {{ padding: "20px" }}
                    />
                    <CardContent sx = {{ marginLeft: "60px" }}>
                        <Typography variant="body2" color="text.secondary" sx = {{ justifyContent: "center", alignItems: "center" }}>
                            {taskData.taskDesc}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing sx = {{ marginLeft: "60px" }}>
                        <IconButton aria-label="edit task" sx = {{ marginRight: "20px" }}>
                            <Fab size = "small" color="primary" aria-label="add"
                            >
                                <ModeEditIcon />
                            </Fab>
                        </IconButton>
                        <IconButton aria-label="delete task">
                            <Fab size = "small" color="primary" aria-label="add"
                            >
                                <DeleteIcon />
                            </Fab>
                        </IconButton>
                    </CardActions>
                </Card>
            </Container> : <CircularProgress />}
        </Container>
    );
};