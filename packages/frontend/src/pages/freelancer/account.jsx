import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Paper, IconButton } from "@mui/material";
import { Star, Edit } from "@mui/icons-material";

const Account = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const token = location.state?.token;

    const isCurrentUser = true; // Replace with actual logic if needed

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
                            {/* <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {user.name}{" "}
                                <span style={{ fontSize: "1rem", color: "#666" }}>
                                    ({user.avg_rating} <Star sx={{ color: "gold", fontSize: "1rem" }} />)
                                </span>
                            </Typography> */}
                            <Typography variant="subtitle1" sx={{ color: "#666" }}>
                                {user.title || "No title provided"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* User Details */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {isCurrentUser && (
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
                        )}

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Bio:</Typography>
                            <Typography variant="body1" sx={{ maxWidth: "70%", textAlign: "right" }}>{user.biography || "No bio provided"}</Typography>
                        </Box>

                        {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Skills:</Typography>
                            <Typography variant="body1">{user.skills || "No skills listed"}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>Jobs Completed:</Typography>
                            <Typography variant="body1">{user.jobs_count}</Typography>
                        </Box> */}

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
