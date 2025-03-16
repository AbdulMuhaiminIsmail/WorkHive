import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Paper, Box, TextField } from "@mui/material";
import axios from "axios";

const Bid = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user;
    const token = location.state?.token;
    const job = location.state?.job;

    const [bidAmount, setBidAmount] = useState("");
    const [coverLetter, setCoverLetter] = useState("");

    const placeBid = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/bids`, 
                {jobId: job.id, freelancerId: user.id, coverLetter, bidAmount},
                {headers: { Authorization: `Bearer ${token}` }}
            );

            navigate("/bids", { state: { user, token } })
        } catch (err) {
            console.error(err)
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
                    <Button color="inherit" onClick={() => navigate("/bids", { state: { user, token } })}>Bids</Button>
                    <Button color="inherit" onClick={() => navigate("/contracts", { state: { user, token } })}>Contracts</Button>
                    <Button color="inherit" onClick={() => navigate("/payments", { state: { user, token } })}>Payments</Button>
                    <Button color="inherit" onClick={() => navigate("/reviews", { state: { user, token } })}>Reviews</Button>
                    <Button color="inherit" onClick={() => navigate("/account", { state: { user, token } })}>Account</Button>
                </Toolbar>
            </AppBar>

            {/* Bid Form */}
            <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                    Place Your Bid
                </Typography>
                <Paper sx={{ padding: 3, background: "#f9f9f9" }}>
                    <TextField
                        fullWidth
                        label="Bid Amount (PKR)"
                        variant="outlined"
                        type="number"
                        sx={{ marginBottom: 2 }}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Cover Letter"
                        variant="outlined"
                        multiline
                        rows={4}
                        sx={{ marginBottom: 2 }}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" color="error" onClick={() => navigate("/home", { state: { user, token } })}>
                            Return
                        </Button>
                        <Button variant="contained" color="primary" onClick={placeBid}>
                            Place
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default Bid;
