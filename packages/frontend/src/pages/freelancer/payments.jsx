import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Paper, 
    Box, 
    Divider,
    Chip,
    Avatar
} from "@mui/material";
import axios from "axios";
import moment from "moment";

const Payments = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = location.state?.token;
    const user = location.state?.user;

    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = (user.user_type === "Freelancer") ? 
                    await axios.get(`http://localhost:5000/payments/freelancer/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }) : await axios.get(`http://localhost:5000/payments/client/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPayments(response.data);
            } catch (error) {
                console.error("Error fetching payments:", error);
            }
        };

        fetchPayments();
    }, [user.id, token]);

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'paid':
                return { bg: 'rgba(29, 185, 84, 0.1)', color: '#1db954' };
            case 'pending':
                return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' };
            case 'failed':
                return { bg: 'rgba(255, 68, 68, 0.1)', color: '#ff4444' };
            default:
                return { bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)' };
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

            {/* Payments Section */}
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
                    Payment History
                </Typography>

                {payments.length === 0 ? (
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
                            No payment records available yet.
                        </Typography>
                    </Paper>
                ) : (
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 3
                    }}>
                        {payments.map((payment) => (
                            <Paper key={payment.id} sx={{ 
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
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 2
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600,
                                        color: 'rgba(255, 255, 255, 0.9)'
                                    }}>
                                        {payment.job_title || 'Completed Job'}
                                    </Typography>
                                    <Chip
                                        label={payment.status}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: getStatusColor(payment.status).bg,
                                            color: getStatusColor(payment.status).color,
                                            fontWeight: 600,
                                            textTransform: 'capitalize'
                                        }}
                                    />
                                </Box>

                                <Divider sx={{ 
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    marginBottom: 2 
                                }} />

                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    marginBottom: 2
                                }}>
                                    <Avatar sx={{ 
                                        width: 40, 
                                        height: 40,
                                        backgroundColor: user.user_type === 'Freelancer' 
                                            ? 'rgba(29, 155, 240, 0.1)' 
                                            : 'rgba(29, 185, 84, 0.1)',
                                        color: user.user_type === 'Freelancer' 
                                            ? '#1d9bf0' 
                                            : '#1db954'
                                    }}>
                                        {user.user_type === 'Freelancer' 
                                            ? (payment.client_name || 'C').charAt(0).toUpperCase()
                                            : (payment.freelancer_name || 'F').charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" sx={{ 
                                            color: 'rgba(255, 255, 255, 0.6)'
                                        }}>
                                            {user.user_type === 'Freelancer' ? 'Client' : 'Freelancer'}
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            color: 'rgba(255, 255, 255, 0.9)'
                                        }}>
                                            {user.user_type === 'Freelancer' 
                                                ? payment.client_name || 'Client'
                                                : payment.freelancer_name || 'Freelancer'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 3
                                }}>
                                    <Typography variant="body2" sx={{ 
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }}>
                                        {moment(payment.sent_at).format('MMM D, YYYY')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 700,
                                        color: '#1db954'
                                    }}>
                                        Creds {payment.amount}
                                    </Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Payments;