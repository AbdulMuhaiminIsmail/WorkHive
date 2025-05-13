import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    TextField, 
    List, 
    ListItem, 
    ListItemText, 
    Paper, 
    Box, 
    Divider,
    Chip,
    Avatar
} from "@mui/material";

useEffect(() => {
    if (!user?.id || !token) return;

    const fetchCredits = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/users/fetchCredits/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCredits(response.data.credits[0].credits);
        } catch (err) {
            console.error("Error fetching credits", err);
        }
    };

    fetchCredits(user.id);
}, [user?.id, token]);

const BidDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = location.state?.token;
    const user = location.state?.user;
    const job = location.state?.job;
    const bid = location.state?.bid;

    const [credits, setCredits] = useState(0);
    const [creditsError, setCreditsError] = ("");
    
    const signContract = async () => {
        try {
            if (credits < bid.bid_amount) {
                setCreditsError("You do not have sufficient credits to sign this contract");
                return;
            }

            const response = await axios.post(`http://localhost:5000/contracts`,
                {
                    jobId: job.id, 
                    freelancerId: bid.freelancer_id, 
                    agreedAmount: bid.bid_amount
                },
                {headers: { Authorization: `Bearer ${token}` } }
            );
            
            await axios.post(`http://localhost:5000/payments`,
                {
                    contractId: response.data.contractId,
                    amount: bid.bid_amount
                },
                {headers: { Authorization: `Bearer ${token}` } }
            );

            await axios.put(`http://localhost:5000/jobs/${job.id}`, { status: 'Assigned' },
                {headers: { Authorization: `Bearer ${token}` } }
            );

            navigate("/home", { state: { user, token } });
        } catch (err) {
            console.error(err);
        }
    }

    const returnToHome = () => {
        navigate("/home", { state: { user, token } });
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
            
            {/* Bid Details Section */}
            <Box sx={{ 
                maxWidth: 800, 
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
                    <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        fontFamily: '"Inter", sans-serif',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: 3
                    }}>
                        Bid Details
                    </Typography>
                    
                    <Divider sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        marginBottom: 3 
                    }} />
                    
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 1
                        }}>
                            BID AMOUNT
                        </Typography>
                        <Chip
                            label={`Creds ${bid.bid_amount}`}
                            sx={{
                                backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                color: '#1db954',
                                fontSize: '1.1rem',
                                padding: 2
                            }}
                        />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 1
                        }}>
                            DESCRIPTION
                        </Typography>
                        <Paper sx={{ 
                            padding: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px'
                        }}>
                            <Typography variant="body1" sx={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                lineHeight: 1.6
                            }}>
                                {bid.cover_letter}
                            </Typography>
                        </Paper>
                    </Box>

                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        marginTop: 4,
                        gap: 2
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
                            onClick={returnToHome}
                        >
                            Return
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
                            onClick={signContract}
                        >
                            Sign Contract
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default BidDetails;