import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Paper, 
    Box, 
    TextField,
    Divider,
    Chip
} from "@mui/material";
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
            await axios.post(`http://localhost:5000/bids`, 
                {jobId: job.id, freelancerId: user.id, coverLetter, bidAmount},
                {headers: { Authorization: `Bearer ${token}` }}
            );

            navigate("/home", { state: { user, token } });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: '#121212',
            color: 'rgba(255, 255, 255, 0.9)'
        }}>
            {/* Navigation Bar */}
            <AppBar 
                position="static" 
                sx={{ 
                    backgroundColor: 'rgba(32, 32, 32, 0.95)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 800,
                            fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        WorkHive
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            color="inherit" 
                            sx={{ 
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                            onClick={() => navigate("/home", { state: { user, token } })}
                        >
                            Jobs
                        </Button>
                        {user.user_type === 'Freelancer' && (
                            <Button 
                                color="inherit" 
                                sx={{ 
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                                onClick={() => navigate("/bids", { state: { user, token } })}
                            >
                                Bids
                            </Button>
                        )}
                        <Button 
                            color="inherit" 
                            sx={{ 
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                            onClick={() => navigate("/contracts", { state: { user, token } })}
                        >
                            Contracts
                        </Button>
                        <Button 
                            color="inherit" 
                            sx={{ 
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                            onClick={() => navigate("/payments", { state: { user, token } })}
                        >
                            Payments
                        </Button>
                        {user.user_type === 'Freelancer' && (
                            <Button 
                                color="inherit" 
                                sx={{ 
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                                onClick={() => navigate("/reviews", { state: { user, token } })}
                            >
                                Reviews
                            </Button>
                        )}
                        <Button 
                            color="inherit" 
                            sx={{ 
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                            onClick={() => navigate("/account", { state: { user, token } })}
                        >
                            Account
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            
            {/* Bid Form */}
            <Box sx={{ 
                maxWidth: 600, 
                margin: "auto", 
                padding: 4,
                paddingTop: 6
            }}>
                <Paper sx={{ 
                    padding: 4, 
                    backgroundColor: 'rgba(32, 32, 32, 0.7)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700,
                            fontFamily: '"Inter", sans-serif',
                            color: 'rgba(255, 255, 255, 0.9)',
                            textAlign: 'center',
                            marginBottom: 3
                        }}
                    >
                        Place Your Bid
                    </Typography>

                    <Divider sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        marginBottom: 3 
                    }} />

                    <TextField
                        fullWidth
                        variant="filled"
                        label="Bid Amount (Creds)"
                        type="number"
                        sx={{ 
                            marginBottom: 3,
                            '& .MuiFilledInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                color: '#ffffff'
                            },
                            '& .MuiFilledInput-root:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)'
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)'
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'rgba(255, 255, 255, 0.9)'
                            }
                        }}
                        InputProps={{
                            disableUnderline: true
                        }}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        variant="filled"
                        label="Cover Letter"
                        multiline
                        rows={6}
                        sx={{ 
                            marginBottom: 3,
                            '& .MuiFilledInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                color: '#ffffff'
                            },
                            '& .MuiFilledInput-root:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)'
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)'
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'rgba(255, 255, 255, 0.9)'
                            }
                        }}
                        InputProps={{
                            disableUnderline: true
                        }}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    />

                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        gap: 2,
                        marginTop: 4
                    }}>
                        <Button 
                            variant="contained" 
                            sx={{ 
                                flex: 1,
                                backgroundColor: 'rgba(255, 68, 68, 0.2)',
                                color: '#ff4444',
                                fontWeight: 600,
                                padding: '12px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 68, 68, 0.3)'
                                }
                            }}
                            onClick={() => navigate("/home", { state: { user, token } })}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            sx={{ 
                                flex: 1,
                                backgroundColor: 'rgba(29, 185, 84, 0.2)',
                                color: '#1db954',
                                fontWeight: 600,
                                padding: '12px',
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 185, 84, 0.3)'
                                }
                            }}
                            onClick={placeBid}
                        >
                            Place Bid
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Bid;