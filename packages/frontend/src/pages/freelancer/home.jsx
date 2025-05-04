import { Add as AddIcon } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useState, useEffect } from "react";
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
    IconButton,
    Chip,
    Avatar
} from "@mui/material";
import { Delete, Edit, ArrowForward } from "@mui/icons-material";
import axios from "axios";

// Function to format "time ago"
const timeAgo = (datetime) => {
    const now = new Date();
    const postedDate = new Date(datetime);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
};

// Function to truncate text
const truncateText = (text, maxLength = 120) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user;
    const token = location.state?.token;

    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = (user.user_type === "Freelancer") ?
                    await axios.get("http://localhost:5000/jobs", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }) :
                    await axios.get(`http://localhost:5000/jobs/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                
                // Filter out expired jobs
                const currentDate = new Date();
                const activeJobs = response.data.filter(job => 
                    new Date(job.deadline) > currentDate
                );
                setJobs(activeJobs);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJobs();
    }, [token, user]);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteJob = async (jobId) => {
        try {
            await axios.delete(`http://localhost:5000/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setJobs(jobs.filter(job => job.id !== jobId));
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
                        {user.user_type === "Freelancer" && (
                            <Button 
                                color="inherit" 
                                sx={{ 
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                                onClick={() => navigate("/bids", { state: {user, token} })}
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
                            onClick={() => navigate("/contracts", { state: {user, token} })}
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
                            onClick={() => navigate("/account", { state: {user, token} })}
                        >
                            Account
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{ 
                maxWidth: 1200, 
                margin: 'auto', 
                padding: 3,
                paddingTop: 4
            }}>
                {/* Page Title and Search */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700,
                            fontFamily: '"Inter", sans-serif',
                            color: 'rgba(255, 255, 255, 0.9)'
                        }}
                    >
                        {user.user_type === "Freelancer" ? "Available Jobs" : "Your Posted Jobs"}
                    </Typography>
                    
                    <TextField
                        fullWidth
                        variant="filled"
                        label="Search Jobs"
                        sx={{ 
                            maxWidth: 400,
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>

                {/* List of Jobs */}
                <Paper sx={{ 
                    padding: 2, 
                    backgroundColor: 'rgba(32, 32, 32, 0.7)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <List sx={{ padding: 0 }}>
                        {filteredJobs.length === 0 ? (
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    textAlign: "center", 
                                    padding: 4,
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }}
                            >
                                {user.user_type === "Freelancer" 
                                    ? "No active jobs available at the moment." 
                                    : "You haven't posted any jobs yet."}
                            </Typography>
                        ) : (
                            filteredJobs.map((job) => (
                                <Box key={job.id} sx={{ mb: 2 }}>
                                    <ListItem 
                                        alignItems="flex-start"
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '4px',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)'
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ 
                                                    display: "flex", 
                                                    justifyContent: "space-between", 
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {user.user_type !== "Freelancer" && (
                                                            <IconButton 
                                                                size="small" 
                                                                sx={{ 
                                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                                    '&:hover': {
                                                                        color: '#1d9bf0',
                                                                        backgroundColor: 'rgba(29, 155, 240, 0.1)'
                                                                    }
                                                                }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        )}
                                                        <Typography 
                                                            variant="h6" 
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                color: 'rgba(255, 255, 255, 0.9)'
                                                            }}
                                                        >
                                                            {job.title}
                                                        </Typography>
                                                    </Box>
                                                    {user.user_type === "Freelancer" ? (
                                                        <IconButton 
                                                            size="small" 
                                                            sx={{ 
                                                                color: '#1db954',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(29, 185, 84, 0.1)'
                                                                }
                                                            }}
                                                            onClick={() => navigate("/jobDetails", { state: { user, job, token } })}
                                                        >
                                                            <ArrowForward fontSize="small" />
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton 
                                                            size="small" 
                                                            sx={{ 
                                                                color: '#ff4444',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255, 68, 68, 0.1)'
                                                                }
                                                            }}
                                                            onClick={() => deleteJob(job.id)}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 1,
                                                        mt: 1,
                                                        mb: 1
                                                    }}>
                                                        <Chip 
                                                            label={timeAgo(job.posted_at)}
                                                            size="small"
                                                            sx={{ 
                                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                                color: 'rgba(255, 255, 255, 0.7)'
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            color: 'rgba(255, 255, 255, 0.8)',
                                                            mt: 1
                                                        }}
                                                    >
                                                        {truncateText(job.description)}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    
                                    <Box sx={{ 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        borderRadius: '0 0 4px 4px'
                                    }}>
                                        <Chip 
                                            label={`Budget: PKR ${job.budget}`}
                                            sx={{
                                                backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                                color: '#1db954'
                                            }}
                                        />
                                        
                                        {user.user_type === "Client" && (
                                            <Button 
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: 'rgba(29, 155, 240, 0.2)',
                                                    color: '#1d9bf0',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(29, 155, 240, 0.3)'
                                                    }
                                                }}
                                                onClick={() => navigate("/bids", { state: { user, job, token } })}
                                            >
                                                View Bids
                                            </Button>
                                        )}
                                        
                                        <Chip 
                                            label={`Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
                                            sx={{
                                                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                                color: '#ffc107'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            ))
                        )}
                    </List>
                </Paper>
            </Box>

            {/* Floating Action Button (FAB) for Clients to Post Jobs */}
            {user.user_type !== "Freelancer" && (
                <Fab 
                    color="primary" 
                    sx={{ 
                        position: "fixed", 
                        bottom: 32, 
                        right: 32,
                        backgroundColor: '#1db954',
                        '&:hover': {
                            backgroundColor: '#1ed760',
                            transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                    }} 
                    onClick={() => navigate("/postJob", { state: { user, token } })}
                >
                    <AddIcon />
                </Fab>
            )}
        </Box>
    );
};

export default Home;