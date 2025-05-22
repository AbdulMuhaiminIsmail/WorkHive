import { useLocation, useNavigate } from "react-router-dom";
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    Avatar, 
    Paper, 
    IconButton,
    Chip,
    Divider
} from "@mui/material";
import { Star, Edit, Logout } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";

const Account = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const token = location.state?.token;

    const [credits, setCredits] = useState(0);
    const [jobsCount, setJobsCount] = useState(0);
    const [avgRating, setAvgRating] = useState(0.0);
    const [listedSkills, setListedSkills] = useState([]);

    useEffect(() => {
        const fetchAvgRating = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/users/avgRating/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setAvgRating(response.data.avgRating[0]?.avgRating || 0.0);
            } catch (err) {
                console.error("Error fetching average rating", err);
            }
        };

        const fetchJobsCount = async (userId) => {
            try {
                const response = (user.user_type === "Freelancer") ? await axios.get(`http://localhost:5000/users/freelancerJobsCount/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }) : await axios.get(`http://localhost:5000/users/clientJobsCount/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                setJobsCount(response.data.jobsCount[0]?.jobsCount || 0);
            } catch (err) {
                console.error("Error fetching jobs count", err);
            }
        };

        const fetchListedSkills = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/users/listedSkills/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setListedSkills(response.data.listedSkills);
            } catch (err) {
                console.error("Error fetching listed skills", err);
            }
        };

        const fetchCredits = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/users/fetchCredits/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCredits(response.data.credits[0].credits);
            } catch (err) {
                console.error("Error fetching credits", err);
            }
        }

        fetchCredits(user.id);
        fetchAvgRating(user.id);
        fetchJobsCount(user.id);
        fetchListedSkills(user.id);

    }, [user.id, token]);

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
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            navigate("/");
                        }}
                        sx={{
                            marginLeft: 2,
                            backgroundColor: 'rgba(255, 65, 65, 0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 65, 65, 0.2)'
                            }
                        }}
                        title="Logout"
                    >
                        <Logout sx={{ color: '#ff4141' }} />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Profile Section */}
            <Box sx={{ 
                maxWidth: "800px", 
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
                    {/* Profile Picture & Name */}
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 4, 
                        marginBottom: 4,
                        paddingBottom: 3,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <Avatar sx={{ 
                            width: 120, 
                            height: 120, 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            fontSize: '3rem'
                        }}>
                            {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700,
                                fontFamily: '"Inter", sans-serif',
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 1
                            }}>
                                {user.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    icon={<Star sx={{ color: 'gold', fontSize: '1rem' }} />}
                                    label={`${avgRating.toFixed(1) || 'N/A'} Rating`}
                                    sx={{
                                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                        color: 'gold'
                                    }}
                                />
                                <Chip
                                    label={`${jobsCount} Jobs`}
                                    sx={{
                                        backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                        color: '#1db954'
                                    }}
                                />
                                <Chip
                                    label={`${credits} Credits`}
                                    sx={{
                                        backgroundColor: 'rgba(29, 155, 240, 0.1)',
                                        color: '#1d9bf0'
                                    }}
                                />
                            </Box>
                            <Typography variant="subtitle1" sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                mt: 2
                            }}>
                                {user.title || "No title provided"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* User Details */}
                    <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: 3
                    }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600,
                                color: 'rgba(255, 255, 255, 0.7)',
                                mb: 1
                            }}>
                                ABOUT
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: 2,
                                borderRadius: '6px'
                            }}>
                                {user.biography || "No bio provided"}
                            </Typography>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                        <Box>
                            <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600,
                                color: 'rgba(255, 255, 255, 0.7)',
                                mb: 1
                            }}>
                                DETAILS
                            </Typography>
                            <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: 2,
                                borderRadius: '6px',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 2
                            }}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                        {user.email}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                        {user.phone_number}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        CNIC
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                        {user.cnic}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Member Since
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                        <Box>
                            <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600,
                                color: 'rgba(255, 255, 255, 0.7)',
                                mb: 1
                            }}>
                                SKILLS
                            </Typography>
                            <Box sx={{ 
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: 2,
                                borderRadius: '6px'
                            }}>
                                {listedSkills.length > 0 ? (
                                    listedSkills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            label={skill}
                                            sx={{
                                                backgroundColor: 'rgba(29, 155, 240, 0.1)',
                                                color: '#1d9bf0'
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                        No skills listed
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Account;