import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Paper, Box, Divider } from "@mui/material";
import axios from "axios";

// Function to format "time ago"
const timeAgo = (datetime) => {
    const now = new Date();
    const postedDate = new Date(datetime);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
};

// Function to truncate text
const truncateText = (text, maxLength = 120) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Contracts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user;
    const job = location.state?.job;
    const token = location.state?.token;

    const [Contracts, setContracts] = useState([]);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {    
        const fetchContracts = async () => {
            try {
                const ContractsResponse = (user.user_type === "Freelancer") ? await axios.get(`http://localhost:5000/Contracts/freelancer/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }) : await axios.get(`http://localhost:5000/Contracts/job/${job.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setContracts(ContractsResponse.data.sort());

                if (user.user_type === "Freelancer") {
                    const joContracts = ContractsResponse.data.map((bid) => bid.job_id);
                    const jobsResponse = await axios.post("http://localhost:5000/jobs/byids",
                        {joContracts}, 
                        {headers: { Authorization: `Bearer ${token}` }}
                    );
                    
                    setJobs(jobsResponse.data); 
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
    
        fetchContracts();
    }, [token, user]); 
    
    const handleDeleteBid = async (bidId) => {
        try {
            await axios.delete(`http://localhost:5000/Contracts/${bidId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContracts(Contracts.filter((bid) => bid.id !== bidId));
        } catch (err) {
            console.error("Error deleting bid:", err);
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
                    <Button color="inherit" onClick={() => navigate("/Contracts", { state: { user, token } })}>Contracts</Button>
                    <Button color="inherit" onClick={() => navigate("/contracts", { state: { user, token } })}>Contracts</Button>
                    <Button color="inherit" onClick={() => navigate("/payments", { state: { user, token } })}>Payments</Button>
                    <Button color="inherit" onClick={() => navigate("/reviews", { state: { user, token } })}>Reviews</Button>
                    <Button color="inherit" onClick={() => navigate("/account", { state: { user, token } })}>Account</Button>
                </Toolbar>
            </AppBar>

            {/* Contracts List */}
            <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                    {user.user_type === "Freelancer" ? "My Contracts" : "Job Contracts"}
                </Typography>
                <Paper sx={{ padding: 2, background: "#f9f9f9" }}>
                    <List>
                        {Contracts.length === 0 ? (
                            <Typography variant="body1" sx={{ textAlign: "center", padding: 2 }}>
                                No Contracts placed yet.
                            </Typography>
                        ) : (
                            Contracts.map((bid, index) => (
                                <div key={bid.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                user.user_type === "Freelancer" ? (
                                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                        {jobs[index]?.title}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                        {job.title} 
                                                    </Typography>
                                                )
                                            }
                                            secondary={
                                                <>
                                                    {user.user_type === "Freelancer" ? (
                                                        <>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Budget: PKR {jobs[index]?.budget}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Bid Amount: PKR {bid.bid_amount}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Deadline: {new Date(jobs[index]?.deadline).toLocaleDateString()}
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                                                                {jobs[index]?.description}
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {timeAgo(bid.bid_at)}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Budget: PKR {job.budget}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Bid Amount: PKR {bid.bid_amount}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Cover Letter: {truncateText(bid.cover_letter)}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </>
                                            }
                                        />
                                        {user.user_type === "Freelancer" ? (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDeleteBid(bid.id)}
                                                sx={{ marginLeft: 2 }}
                                            >
                                                Delete
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => navigate(`/bidDetails/${bid.id}`, { state: { user, bid, job, token } })}
                                                sx={{ marginLeft: 2 }}
                                            >
                                                View
                                            </Button>
                                        )}
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))
                        )}
                    </List>
                </Paper>
            </Box>

        </>
    );
};

export default Contracts;
