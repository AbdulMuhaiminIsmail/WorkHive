import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, TextField, List, ListItem, ListItemText, Paper, Box, Divider } from "@mui/material";

const BidDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = location.state?.token;
    const user = location.state?.user;
    const job = location.state?.job;
    const bid = location.state?.bid;

    const signContract = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/contracts`,
                {
                    jobId: job.id, 
                    freelancerId: bid.freelancer_id, 
                    agreedAmount: bid.bid_amount
                },
                {headers: { Authorization: `Bearer ${token}` } }
            );

            console.log(response);
            
            await axios.post(`http://localhost:5000/payments`,
                {
                    contractId: response.data.contractId,
                    amount: bid.bid_amount
                },
                {headers: { Authorization: `Bearer ${token}` } }
            )

            navigate("/home", { state: { user, token } });
        } catch (err) {
            console.error(err);
        }
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
            
            {/* Bid Details Section */}
            <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
                <Paper sx={{ padding: 3, background: "#f9f9f9" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976D2", marginBottom: 2 }}>
                        {user.title}
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />                    
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Bid Amount:</Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>{bid.bid_amount}</Typography>

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Description:</Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>{bid.cover_letter}</Typography>

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
                            onClick={signContract}
                        >
                            Sign Contract
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

export default BidDetails;