import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Paper, IconButton } from "@mui/material";
import { Star, Edit } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";

const Account = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const token = location.state?.token;

    const [avgRating, setAvgRating] = useState(0.0);
    const [jobsCount, setJobsCount] = useState(0);
    const [listedSkills, setListedSkills] = useState([]);

    console.log(user);

    useEffect(() => {
        const fetchAvgRating = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/users/avgRating/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setAvgRating(response.data.avgRating[0].avgRating);
            } catch (err) {
                console.error("Error fetching average rating", err);
            }
        };

        const fetchJobsCount = async (userId) => {
            try {
                const response = (user.user_type === "Freelancer") ? await axios.get(`http://localhost:5000/users/freelancerJobsCount/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }) : await axios.get(`http://localhost:5000/user/clientJobsCount/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                console.log(response);
                setJobsCount(response.data.jobsCount[0].jobsCount);
            } catch (err) {
                console.error("Error fetching jobs count", err);
            }
        };

        const fetchListedSkills = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/users/listedSkills/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                console.log(response);
                setListedSkills(response.data.listedSkills);
            } catch (err) {
                console.error("Error fetching listed skills", err);
            }
        };

        fetchAvgRating(user.id);
        fetchJobsCount(user.id);
        fetchListedSkills(user.id);

    }, [user.id, token]);

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

            {/* Profile Section */}
            <Box sx={{ maxWidth: "1080px", margin: "auto", padding: 5 }}>
                <Paper sx={{ padding: 5, background: "#f9f9f9", boxShadow: 3 }}>
                    
                    {/* Profile Picture & Name */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 4 }}>
                        <Avatar sx={{ width: 120, height: 120, backgroundColor: "#ddd" }} />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {user.name}{" "}
                                <span style={{ fontSize: "1rem", color: "#666" }}>
                                    ({avgRating.toFixed(1) || "Error fetching average rating"} <Star sx={{ color: "gold", fontSize: "1rem" }} />)
                                </span>
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: "#666" }}>
                                {user.title || "No title provided"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* User Details */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Email:</Typography>
                                    <Typography variant="body1">{user.email}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>CNIC:</Typography>
                                    <Typography variant="body1">{user.cnic}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Phone:</Typography>
                                    <Typography variant="body1">{user.phone_number}</Typography>
                                </Box>
                            </>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Bio:</Typography>
                            <Typography variant="body1" sx={{ maxWidth: "70%", textAlign: "right" }}>{user.biography || "No bio provided"}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Skills:</Typography>
                            <Typography variant="body1">{listedSkills || "No skills listed"}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Jobs Completed:</Typography>
                            <Typography variant="body1">{jobsCount || "Error fetching jobs count"}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Joined On:</Typography>
                            <Typography variant="body1">{new Date(user.created_at).toLocaleDateString()}</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default Account;
