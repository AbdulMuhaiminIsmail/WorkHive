import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    AppBar, Toolbar, Typography, Button, Paper, Box,
    Chip, Avatar, Divider, IconButton
} from "@mui/material";
import { ArrowForward, Delete } from "@mui/icons-material";
import axios from "axios";

const Bids = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user;
    const job = location.state?.job;
    const token = location.state?.token;

    const [bids, setBids] = useState([]);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {    
        const fetchBids = async () => {
            try {
                const bidsResponse = (user.user_type === "Freelancer") ? 
                    await axios.get(`http://localhost:5000/bids/freelancer/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }) : await axios.get(`http://localhost:5000/bids/job/${job.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                setBids(bidsResponse.data);

                if (user.user_type === "Freelancer") {
                    const jobIds = bidsResponse.data.map((bid) => bid.job_id);
                    const jobsResponse = await axios.post("http://localhost:5000/jobs/byids",
                        {jobIds}, 
                        {headers: { Authorization: `Bearer ${token}` }}
                    );
                    setJobs(jobsResponse.data); 
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
    
        fetchBids();
    }, [token, user]); 
    
    const handleDeleteBid = async (bidId) => {
        try {
            await axios.delete(`http://localhost:5000/bids/${bidId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBids(bids.filter((bid) => bid.id !== bidId));
        } catch (err) {
            console.error("Error deleting bid:", err);
        }
    };

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

            {/* Bids Section */}
            <Box sx={{ 
                maxWidth: '900px', 
                margin: 'auto', 
                padding: 4,
                paddingTop: 6
            }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    fontFamily: '"Inter", sans-serif',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: 4,
                    textAlign: 'center'
                }}>
                    {user.user_type === "Freelancer" ? "My Bids" : "Job Bids"}
                </Typography>

                {bids.length === 0 ? (
                    <Paper sx={{ 
                        padding: 4,
                        textAlign: 'center',
                        backgroundColor: 'rgba(32, 32, 32, 0.7)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <Typography variant="body1" sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                            No bids placed yet.
                        </Typography>
                    </Paper>
                ) : (
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 3
                    }}>
                        {bids.map((bid, index) => (
                            <Paper key={bid.id} sx={{ 
                                padding: 3,
                                backgroundColor: 'rgba(32, 32, 32, 0.7)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)'
                                }
                            }}>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 600,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    marginBottom: 2
                                }}>
                                    {user.user_type === "Freelancer" 
                                        ? jobs[index]?.title || 'Job' 
                                        : job.title}
                                </Typography>

                                <Divider sx={{ 
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    marginBottom: 2 
                                }} />

                                <Box sx={{ 
                                    display: 'grid',
                                    gap: 2,
                                    marginBottom: 3
                                }}>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Typography variant="body2" sx={{ 
                                            color: 'rgba(255, 255, 255, 0.6)'
                                        }}>
                                            Bid Amount
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            color: '#1db954',
                                            fontWeight: 600
                                        }}>
                                            PKR {bid.bid_amount}
                                        </Typography>
                                    </Box>

                                    {user.user_type === "Freelancer" && (
                                        <Box sx={{ 
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography variant="body2" sx={{ 
                                                color: 'rgba(255, 255, 255, 0.6)'
                                            }}>
                                                Job Budget
                                            </Typography>
                                            <Typography variant="body1">
                                                PKR {jobs[index]?.budget}
                                            </Typography>
                                        </Box>
                                    )}

                                    {user.user_type === "Client" && (
                                        <Box>
                                            <Typography variant="body2" sx={{ 
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                marginBottom: 1
                                            }}>
                                                Cover Letter
                                            </Typography>
                                            <Typography variant="body1" sx={{ 
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                fontStyle: 'italic'
                                            }}>
                                                {bid.cover_letter.length > 100 
                                                    ? `${bid.cover_letter.substring(0, 100)}...` 
                                                    : bid.cover_letter}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Chip
                                        label={new Date(bid.bid_at).toLocaleDateString()}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            color: 'rgba(255, 255, 255, 0.7)'
                                        }}
                                    />

                                    {user.user_type === "Freelancer" ? (
                                        <IconButton
                                            onClick={() => handleDeleteBid(bid.id)}
                                            sx={{ 
                                                color: '#ff4444',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 68, 68, 0.1)'
                                                }
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            onClick={() => navigate(`/bidDetails/${bid.id}`, { state: { user, bid, job, token } })}
                                            sx={{ 
                                                color: '#1d9bf0',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(29, 155, 240, 0.1)'
                                                }
                                            }}
                                        >
                                            <ArrowForward />
                                        </IconButton>
                                    )}
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Bids;