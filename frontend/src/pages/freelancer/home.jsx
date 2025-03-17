import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, TextField, List, ListItem, ListItemText, Paper, Box, Divider } from "@mui/material";
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

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user // || JSON.parse(localStorage.getItem("user"));
    const token = location.state?.token // || localStorage.getItem("token");

    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = (user.user_type === "Freelancer") ?
                    await axios.get("http://localhost:5000/jobs", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }) :
                    await axios.get(`http://localhost:5000/jobs/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                console.log(response.data);
                setJobs(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJobs();
    }, [token]);

    const filteredJobs = (user.user_type === "Freelancer") ? jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : jobs;

    const deleteJob = async (jobId) => {
        try {
            await axios.delete(`http://localhost:5000/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setJobs(jobs.filter(job => job.id !== jobId));
        } catch (err) {
            console.error(err);
        }
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

            {/* Main Content */}
            <Box sx={{ maxWidth: 1080, margin: "auto", padding: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                {user.user_type === "Freelancer" ? "Available Jobs" : "Posted Jobs"}
                </Typography> 

                {user.user_type === "Freelancer" && (
                    <TextField
                    fullWidth
                    label="Search Jobs"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    /> 
                )}

                <Paper sx={{ padding: 2, background: "#f9f9f9" }}>
                    <List>
                        {filteredJobs.length === 0 ? (
                            <Typography variant="body1" sx={{ textAlign: "center", padding: 2 }}>
                                {user.user_type === "Freelancer" ? "No jobs found." : "No jobs posted."}
                            </Typography>
                        ) : (
                            filteredJobs.map((job) => (
                                <div key={job.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px 16px" }}>
                                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{job.title}</Typography>
                                                    {user.user_type === "Freelancer" ? (
                                                        <Button color="error" onClick={() => navigate("/jobDetails", { state: { user, job, token } })}>Details</Button>
                                                    ) : (
                                                        <Button color="error" onClick={() => deleteJob(job.id)}>Delete</Button>
                                                    )}        
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="textSecondary">{timeAgo(job.posted_at)}</Typography>
                                                    <Typography variant="body1" sx={{ marginTop: 1 }}>{truncateText(job.description)}</Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px 16px" }}>
                                        <Typography variant="subtitle2" color="textSecondary"><b>Budget:</b> PKR {job.budget}</Typography>
                                        <Typography variant="subtitle2" color="textSecondary"><b>Deadline:</b> {new Date(job.deadline).toLocaleDateString()}</Typography>
                                    </Box>
                                    <Divider />
                                </div>
                            ))
                        )}
                    </List>
                </Paper>
            </Box>

            {/* Floating Action Button (FAB) for Clients to Post Jobs */}
            {user.user_type !== "Freelancer" && (
                <Fab 
                    color="primary" 
                    sx={{ position: "fixed", bottom: 20, right: 20 }} 
                    onClick={() => navigate("/postJob", { state: { user, token } })}
                >
                    <AddIcon />
                </Fab>
            )}
        </>
    );
};

export default Home;

