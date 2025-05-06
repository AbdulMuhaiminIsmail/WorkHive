import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    AppBar, Toolbar, Typography, Button, TextField, Paper, Box,
    Divider, Chip
} from "@mui/material";
import axios from "axios";

const PostJob = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const token = location.state?.token;
    
    const [jobData, setJobData] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        clientId: user.id
    });

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/jobs", jobData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/home", { state: { user, token } });
        } catch (err) {
            console.error("Error posting job:", err);
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

            {/* Form Container */}
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
                    <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        fontFamily: '"Inter", sans-serif',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: 3,
                        textAlign: 'center'
                    }}>
                        Post a New Job
                    </Typography>

                    <Divider sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        marginBottom: 3 
                    }} />

                    <form onSubmit={handleSubmit}>
                        <TextField 
                            fullWidth 
                            label="Title" 
                            name="title" 
                            variant="filled"
                            margin="normal" 
                            onChange={handleChange} 
                            required
                            sx={{
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
                        />

                        <TextField 
                            fullWidth 
                            label="Description" 
                            name="description" 
                            variant="filled"
                            margin="normal" 
                            multiline 
                            rows={4} 
                            onChange={handleChange} 
                            required
                            sx={{
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
                        />

                        <TextField 
                            fullWidth 
                            label="Budget (PKR)" 
                            name="budget" 
                            type="number" 
                            variant="filled"
                            margin="normal" 
                            onChange={handleChange} 
                            required
                            sx={{
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
                        />

                        <TextField 
                            fullWidth 
                            label="Deadline" 
                            name="deadline" 
                            type="date" 
                            variant="filled"
                            margin="normal" 
                            InputLabelProps={{ shrink: true }} 
                            onChange={handleChange} 
                            required
                            sx={{
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
                        />
                        
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
                                type="submit"
                            >
                                Post Job
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default PostJob;