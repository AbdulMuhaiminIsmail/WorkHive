import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, TextField, List, ListItem, ListItemText, Paper, Box, Divider } from "@mui/material";

const JobDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = location.state?.token;
    const user = location.state?.user;
    const job = location.state?.job;

    const placeBid = () => {
        navigate("/bid", { state: { user, token, job } });
    }

    const returnToHome = () => {
        navigate("/home", { state: { user, token } });
    }

    return (
        <>
            {/* Navigation Bar */}
            <AppBar position="static" sx={{ backgroundColor: "#1976D2" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        WorkHive
                    </Typography>
                    <Button color="inherit" onClick={() => navigate("/home", { state: { user, token } })}>Jobs</Button>
                    <Button color="inherit" onClick={() => navigate("/bids", { state: {user, token} })}>Bids</Button>
                    <Button color="inherit" onClick={() => navigate("/contracts", { state: {user, token} })}>Contracts</Button>
                    <Button color="inherit" onClick={() => navigate("/payments", { state: {user, token} })}>Payments</Button>
                    <Button color="inherit" onClick={() => navigate("/reviews", { state: {user, token} })}>Reviews</Button>
                    <Button color="inherit" onClick={() => navigate("/account", { state: {user, token} })}>Account</Button>
                </Toolbar>
            </AppBar>
            
            {/* Job Details Section */}
            <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
                <Paper sx={{ padding: 3, background: "#f9f9f9" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976D2", marginBottom: 2 }}>
                        {job.title}
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Budget:</Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>PKR {job.budget}</Typography>
                    
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Deadline:</Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>{new Date(job.deadline).toLocaleDateString()}</Typography>

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Description:</Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>{job.description}</Typography>

                    {job.skills && job.skills.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Required Skills:</Typography>
                            <Stack direction="row" spacing={1} sx={{ marginBottom: 2, flexWrap: "wrap" }}>
                                {job.skills.map((skill, index) => (
                                    <Chip key={index} label={skill} color="primary" />
                                ))}
                            </Stack>
                        </>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <Button 
                            variant="contained" 
                            color="error" 
                            sx={{ flex: 1, marginRight: 1 }}
                            onClick={returnToHome}
                        >
                            Return
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ flex: 1, marginLeft: 1 }}
                            onClick={placeBid}
                        >
                            Place Bid
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

export default JobDetails;