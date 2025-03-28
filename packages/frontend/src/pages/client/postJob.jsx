import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, TextField, Paper, Box } from "@mui/material";
import axios from "axios";

const PostJob = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const token = location.state?.token;
    
    const [jobData, setJobData] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        clientId: user.id
    });

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/jobs", jobData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/home", { state: { user, token } });
        } catch (err) {
            console.error("Error posting job:", err);
        }
    };

    return (
        <>
            {/* Navigation Bar */}
            <AppBar position="static" sx={{ backgroundColor: "#1976D2" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        WorkHive
                    </Typography>
                    <Button color="inherit" onClick={() => navigate("/home", { state: { user, token } })}>Jobs</Button>
                    <Button color="inherit" onClick={() => navigate("/bids", { state: { user, token } })}>Bids</Button>
                    <Button color="inherit" onClick={() => navigate("/contracts", { state: { user, token } })}>Contracts</Button>
                    <Button color="inherit" onClick={() => navigate("/payments", { state: { user, token } })}>Payments</Button>
                    <Button color="inherit" onClick={() => navigate("/reviews", { state: { user, token } })}>Reviews</Button>
                    <Button color="inherit" onClick={() => navigate("/account", { state: { user, token } })}>Account</Button>
                </Toolbar>
            </AppBar>

            {/* Form Container */}
            <Box sx={{ maxWidth: 600, margin: "auto", padding: 3, marginTop: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                    Post a New Job
                </Typography>
                <Paper sx={{ padding: 3, background: "#f9f9f9" }}>
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Title" name="title" variant="outlined" margin="normal" onChange={handleChange} required />
                        <TextField fullWidth label="Description" name="description" variant="outlined" margin="normal" multiline rows={4} onChange={handleChange} required />
                        <TextField fullWidth label="Budget (PKR)" name="budget" type="number" variant="outlined" margin="normal" onChange={handleChange} required />
                        <TextField fullWidth label="Deadline" name="deadline" type="date" variant="outlined" margin="normal" InputLabelProps={{ shrink: true }} onChange={handleChange} required />
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                            <Button variant="outlined" color="error" onClick={() => navigate("/home", { state: { user, token } })}>Return</Button>
                            <Button variant="contained" color="primary" type="submit">Post Job</Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </>
    );
};

export default PostJob;
