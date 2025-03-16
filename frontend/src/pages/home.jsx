import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Paper, Typography, Box, Divider } from "@mui/material";
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
    const location = useLocation();
    const user = location.state?.user;
    const token = location.state?.token;
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/jobs", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJobs(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJobs();
    }, [token]);

    return (
        <Paper sx={{ padding: 3, maxWidth: 1080, margin: "auto", background: "#f8f9fa" }}>
            <List>
                {jobs.map((job) => (
                    <div key={job.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        {job.title}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" color="textSecondary">
                                            {timeAgo(job.posted_at)}
                                        </Typography>
                                        <Typography variant="body1" sx={{ marginTop: 1 }}>
                                            {truncateText(job.description)}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "10px 16px" }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                <b>Budget:</b> PKR {job.budget}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ textAlign: "right" }}>
                                <b>Deadline:</b> {new Date(job.deadline).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Divider />
                    </div>
                ))}
            </List>
        </Paper>
    );
};

export default Home;
