import React, { useEffect, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';
import Container from "@mui/material/Container";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [signInStatus, setSignInStatus] = useState(false);
    const [height, setHeight] = useState(signInStatus === "true" ? "300px" : "450px");
    const [userEmail, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [pwd, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Stuff");
        const checkPrevLogin = localStorage.getItem("tracko-app");

        if (checkPrevLogin) {
            const user = JSON.parse(checkPrevLogin);
            setSignInStatus(true);
            navigate(`/home/${user.userId}`);
        }
    }, []);

    const handleLogin = (event) => {
        event.preventDefault();
        const data = {
            userName: username,
            password: pwd
        }
        console.log(data);

        fetch(`/api/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(res => {
                console.log(res);
                localStorage.setItem("tracko-app", JSON.stringify(res.data));
                navigate(`/home/${res.data.userId}`);
            })
            .catch((err) => console.log(err));
    }

    const handleRegister = (event) => {
        event.preventDefault();
        const data = {
            userName: username,
            email: userEmail,
            password: pwd
        }

        fetch(`/api/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(res => {
                console.log(res);
                localStorage.setItem("tracko-app", JSON.stringify(res.data));
                navigate(`/home/${res.data.userId}`);
            })
            .catch((err) => console.log(err));
    }

    return (
        <Container
            display="flex"
            justifyContent="center"
            alignItems="center"
            maxWidth="xs"
            sx={{
                backgroundColor: "#001e3c",
                marginTop: "170px",
                borderRadius: "20px",
                height: signInStatus? "350px": "438px"
            }}
        >
            {
                signInStatus ?
                    <form style={{ display: "flex", flexDirection: "column" }}>
                        <h3 style={{ marginBottom: "20px", color: "white", textAlign: "center" }} >Login to Tracko</h3>
                        <TextField required id="outlined-basic" label="Username" variant="outlined" sx={{ marginBottom: "30px" }} onChange={(event) => setUserName(event.target.value)} />
                        <TextField required id="outlined-basic" label="Password" variant="outlined" sx={{ marginBottom: "30px" }} onChange={(event) => setPassword(event.target.value)} />
                        <Button variant="contained" startIcon={<LoginIcon />} onClick={handleLogin} disabled = { username.length > 0 && pwd.length > 0 ? false : true }>
                            Login
                        </Button>
                        <Button variant="contained" onClick={(event) => setSignInStatus(false)} sx={{ marginTop: "20px" }}>
                            Register
                        </Button>
                    </form> :
                    <form style={{ display: "flex", flexDirection: "column" }}>
                        <h3 style={{ marginBottom: "20px", color: "white", textAlign: "center" }} >Sign Up</h3>
                        <TextField required id="outlined-basic" label="Email" variant="outlined" sx={{ marginBottom: "30px" }} onChange={(event) => setEmail(event.target.value)} />
                        <TextField required id="outlined-basic" label="Username" variant="outlined" sx={{ marginBottom: "30px" }} onChange={(event) => setUserName(event.target.value)} />
                        <TextField required id="outlined-basic" label="Password" variant="outlined" sx={{ marginBottom: "30px" }} onChange={(event) => setPassword(event.target.value)} />
                        <Button variant="contained" startIcon={<LoginIcon />} onClick={handleRegister} disabled = { userEmail.length > 0 && username.length > 0 && pwd.length > 0 ? false : true } >
                            Register For Tracko
                        </Button>
                        <Button variant="contained" startIcon={<LoginIcon />} onClick={(event) => setSignInStatus(true)} sx={{ marginTop: "20px" }}>
                            Already Registered? Login
                        </Button>
                    </form>
            }
        </Container>
    );
};