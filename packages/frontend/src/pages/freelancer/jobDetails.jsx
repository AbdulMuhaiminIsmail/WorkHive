import { useNavigate, useLocation } from "react-router-dom";
import { 
    AppBar, Toolbar, Typography, Button, Paper, Box, 
    Divider, Chip, Stack, Avatar
} from "@mui/material";

const JobDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = location.state?.token;
    const user = location.state?.user;
    const job = location.state?.job;

    const placeBid = () => {
        navigate("/bid", { state: { user, token, job } });
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
            
            {/* Job Details Section */}
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
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        marginBottom: 3
                    }}>
                        <Avatar sx={{ 
                            width: 60, 
                            height: 60,
                            backgroundColor: 'rgba(29, 155, 240, 0.1)',
                            color: '#1d9bf0',
                            fontSize: '1.5rem'
                        }}>
                            {job.title.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 700,
                            fontFamily: '"Inter", sans-serif',
                            color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                            {job.title}
                        </Typography>
                    </Box>

                    <Divider sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        marginBottom: 3 
                    }} />

                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 3,
                        marginBottom: 3
                    }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600,
                                color: 'rgba(255, 255, 255, 0.7)',
                                marginBottom: 1
                            }}>
                                Budget
                            </Typography>
                            <Chip
                                label={`Creds ${job.budget}`}
                                sx={{
                                    backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                    color: '#1db954',
                                    fontSize: '1.1rem',
                                    padding: '8px 12px'
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600,
                                color: 'rgba(255, 255, 255, 0.7)',
                                marginBottom: 1
                            }}>
                                Deadline
                            </Typography>
                            <Chip
                                label={new Date(job.deadline).toLocaleDateString()}
                                sx={{
                                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                    color: '#ffc107',
                                    fontSize: '1.1rem',
                                    padding: '8px 12px'
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: 1
                        }}>
                            Description
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
                                {job.description}
                            </Typography>
                        </Paper>
                    </Box>

                    {job.skills && job.skills.length > 0 && (
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600,
                                color: 'rgba(255, 255, 255, 0.7)',
                                marginBottom: 1
                            }}>
                                Required Skills
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                                {job.skills.map((skill, index) => (
                                    <Chip 
                                        key={index} 
                                        label={skill} 
                                        sx={{
                                            backgroundColor: 'rgba(29, 155, 240, 0.1)',
                                            color: '#1d9bf0'
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}

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
                                backgroundColor: 'rgba(29, 155, 240, 0.2)',
                                color: '#1d9bf0',
                                fontWeight: 600,
                                padding: '12px',
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 155, 240, 0.3)'
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
}

export default JobDetails;