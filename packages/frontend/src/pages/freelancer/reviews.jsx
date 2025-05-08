import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Paper, 
    Box, 
    Avatar,
    Chip,
    Divider,
    IconButton
} from "@mui/material";
import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";

const Reviews = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user;
    const token = location.state?.token;
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsResponse = await axios.get(`http://localhost:5000/reviews/${user.id}`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setReviews(reviewsResponse.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchReviews();
    }, [user, token]);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} sx={{ color: 'gold', fontSize: '1.2rem' }} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<StarHalf key={i} sx={{ color: 'gold', fontSize: '1.2rem' }} />);
            } else {
                stars.push(<StarBorder key={i} sx={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '1.2rem' }} />);
            }
        }
        
        return stars;
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

            {/* Reviews Section */}
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
                    Your Reviews
                </Typography>

                {reviews.length === 0 ? (
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
                            No reviews available yet.
                        </Typography>
                    </Paper>
                ) : (
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 3
                    }}>
                        {reviews.map((review) => (
                            <Paper key={review.id} sx={{ 
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
                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    marginBottom: 2
                                }}>
                                    <Avatar sx={{ 
                                        width: 56, 
                                        height: 56,
                                        backgroundColor: 'rgba(29, 155, 240, 0.1)',
                                        color: '#1d9bf0'
                                    }}>
                                        {review.client_name ? review.client_name.charAt(0).toUpperCase() : 'C'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 600,
                                            color: 'rgba(255, 255, 255, 0.9)'
                                        }}>
                                            {review.client_name || 'Client'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: 'rgba(255, 255, 255, 0.6)'
                                        }}>
                                            {moment(review.created_at).fromNow()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="subtitle1" sx={{ 
                                    fontWeight: 600,
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    marginBottom: 1
                                }}>
                                    {review.job_title || 'Completed Job'}
                                </Typography>

                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 2
                                }}>
                                    {renderStars(review.rating)}
                                    <Chip
                                        label={`${review.rating.toFixed(1)}/5`}
                                        size="small"
                                        sx={{ 
                                            marginLeft: 1,
                                            backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                            color: 'gold'
                                        }}
                                    />
                                </Box>

                                <Divider sx={{ 
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    marginBottom: 2 
                                }} />

                                <Typography variant="body1" sx={{ 
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    lineHeight: 1.6
                                }}>
                                    {review.feedback || 'No feedback provided.'}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Reviews;