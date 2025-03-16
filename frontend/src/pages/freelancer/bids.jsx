import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Paper, Box, Divider } from "@mui/material";
import axios from "axios";

const Bids = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user;
    const token = location.state?.token;

    const [bids, setBids] = useState([]);
    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const bidsResponse = await axios.get(`http://localhost:5000/bids/freelancer/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setBids(bidsResponse.data);

                const jobsRequests = bidsResponse.data.map((bid) =>
                    axios.get(`http://localhost:5000/jobs/${bid.job_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                );
  
                const jobsResponses = await Promise.all(jobsRequests);

                const jobsData = {};
                jobsResponses.forEach((response, index) => {
                    jobsData[bidsResponse.data[index].job_id] = response.data;
                });

                setJobs(jobsData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchBids();
    }, [token]);

    if (loading) return <p>Loading...</p>;

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

            {/* Bids List */}
            <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                    My Bids
                </Typography>
                <Paper sx={{ padding: 2, background: "#f9f9f9" }}>
                    <List>
                        {bids.length === 0 ? (
                            <Typography variant="body1" sx={{ textAlign: "center", padding: 2 }}>
                                No bids placed yet.
                            </Typography>
                        ) : (
                            bids.map((bid) => (
                                <div key={bid.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                    {jobs[bid.job_id]?.title || "Loading..."}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Budget: PKR {jobs[bid.job_id]?.budget || "Loading..."}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Bid Amount: PKR {bid.bid_amount}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Deadline: {new Date(jobs[bid.job_id]?.deadline).toLocaleDateString() || "Loading..."}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                                                        {jobs[bid.job_id]?.description || "Loading..."}
                                                    </Typography>
                                                </>
                                            }
                                        />
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

export default Bids;
