import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AppBar, Toolbar, Typography, Dialog, DialogTitle, DialogActions,
    DialogContent, Slider, TextField, Button, Paper, Box,
    Chip, Avatar, Divider
} from "@mui/material";
import axios from "axios";

const Contracts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user;
    const token = location.state?.token;

    const [contractId, setContractId] = useState(-1);
    const [openDialog, setOpenDialog] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(3);
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const endpoint = user.user_type === "Freelancer"
                    ? `http://localhost:5000/contracts/freelancer/${user.id}`
                    : `http://localhost:5000/contracts/client/${user.id}`;

                const contractsResponse = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const contractsData = contractsResponse.data;
                setContracts(contractsData);
            } catch (err) {
                console.error("Error fetching contracts or related data:", err);
            }
        };

        fetchContracts();
    }, [token, user]);

    const handleCompleteContract = async (contract) => {
        try {
            await axios.put(`http://localhost:5000/contracts/${contract.id}`, { status: 'Completed' }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await axios.put(`http://localhost:5000/payments/${contract.id}`, { status: 'Paid' }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await axios.put(`http://localhost:5000/users/${contract.freelancer_id}`, { creditsAdd: contract.agreed_amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await axios.put(`http://localhost:5000/users/${user.id}`, { creditsSub: contract.agreed_amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setContracts(prev =>
                prev.map(c =>
                    c.id === contract.id ? { ...c, status: 'Completed' } : c
                )
            );

            setContractId(contract.id);
            setOpenDialog(true);
        } catch (err) {
            console.error("Error updating contract status:", err);
        }
    };

    const handleCancelContract = async (contractId) => {
        try {
            await axios.put(`http://localhost:5000/contracts/${contractId}`, { status: 'Cancelled' }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await axios.put(`http://localhost:5000/payments/${contractId}`, { status: 'Failed' }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setContracts(prev =>
                prev.map(contract =>
                    contract.id === contractId ? { ...contract, status: 'Cancelled' } : contract
                )
            );
        } catch (err) {
            console.error("Error cancelling contract:", err);
        }
    };

    const handleSubmitReview = async () => {
        try {
            await axios.post(`http://localhost:5000/reviews`, {
                contractId,
                rating,
                feedback
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOpenDialog(false);
        } catch (err) {
            console.error("Error submitting review: ", err);
        }
    };

    const handleViewDetails = async (contractId) => {
        const response = await axios.get(`http://localhost:5000/users/fetchClientByContractId/${contractId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const client = {
            name: response.data[0].name,
            email: response.data[0].email,
            phone: response.data[0].phone_number
        }

        setSelectedClient(client);
        setContactDialogOpen(true);
    };

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'completed':
                return { bg: 'rgba(29, 185, 84, 0.1)', color: '#1db954' };
            case 'in progress':
                return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' };
            case 'cancelled':
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

            {/* Contracts Section */}
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
                    {user.user_type === "Freelancer" ? "My Contracts" : "Job Contracts"}
                </Typography>

                {contracts.length === 0 ? (
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
                            No contracts signed yet.
                        </Typography>
                    </Paper>
                ) : (
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 3
                    }}>
                        {contracts.map((contract) => (
                            <Paper key={contract.id} sx={{ 
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
                                        {contract.job_title || 'Contract'}
                                    </Typography>
                                    <Chip
                                        label={contract.status}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: getStatusColor(contract.status).bg,
                                            color: getStatusColor(contract.status).color,
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
                                            ? (contract.client_name || 'C').charAt(0).toUpperCase()
                                            : (contract.freelancer_name || 'F').charAt(0).toUpperCase()}
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
                                                ? contract.client_name || 'Client'
                                                : contract.freelancer_name || 'Freelancer'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 2
                                }}>
                                    <Typography variant="body2" sx={{ 
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }}>
                                        Agreement Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        color: 'rgba(255, 255, 255, 0.9)'
                                    }}>
                                        {new Date(contract.signed_at).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <Box sx={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 3
                                }}>
                                    <Typography variant="body2" sx={{ 
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }}>
                                        Agreed Amount
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 700,
                                        color: '#1db954'
                                    }}>
                                        Creds {contract.agreed_amount}
                                    </Typography>
                                </Box>

                                {user.user_type === "Client" ? (
                                    contract.status !== "Completed" && contract.status !== "Cancelled" && (
                                        <Box sx={{ 
                                            display: 'flex',
                                            gap: 2,
                                            marginTop: 2
                                        }}>
                                            <Button
                                                variant="contained"
                                                sx={{ 
                                                    flex: 1,
                                                    backgroundColor: 'rgba(29, 185, 84, 0.2)',
                                                    color: '#1db954',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(29, 185, 84, 0.3)'
                                                    }
                                                }}
                                                onClick={() => handleCompleteContract(contract)}
                                            >
                                                Release Funds
                                            </Button>
                                            <Button
                                                variant="contained"
                                                sx={{ 
                                                    flex: 1,
                                                    backgroundColor: 'rgba(255, 68, 68, 0.2)',
                                                    color: '#ff4444',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 68, 68, 0.3)'
                                                    }
                                                }}
                                                onClick={() => handleCancelContract(contract.id)}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    )
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{ 
                                            width: '100%',
                                            marginTop: 2,
                                            backgroundColor: 'rgba(29, 155, 240, 0.2)',
                                            color: '#1d9bf0',
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: 'rgba(29, 155, 240, 0.3)'
                                            }
                                        }}
                                        onClick={() => handleViewDetails(contract.id)}
                                    >
                                        View Client Details
                                    </Button>
                                )}
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Feedback Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(32, 32, 32, 0.9)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                <DialogTitle>Provide Feedback</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Rate the experience (1-5):
                    </Typography>
                    <Slider
                        value={rating}
                        onChange={(e, newValue) => setRating(newValue)}
                        step={1}
                        marks
                        min={1}
                        max={5}
                        valueLabelDisplay="auto"
                        sx={{ color: '#1db954', marginBottom: 3 }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Feedback"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)'
                            },
                            '& .MuiOutlinedInput-root': {
                                color: 'rgba(255, 255, 255, 0.9)',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDialog(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmitReview} 
                        variant="contained"
                        sx={{ 
                            backgroundColor: 'rgba(29, 185, 84, 0.2)',
                            color: '#1db954',
                            '&:hover': {
                                backgroundColor: 'rgba(29, 185, 84, 0.3)'
                            }
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Contact Dialog */}
            <Dialog 
                open={contactDialogOpen} 
                onClose={() => setContactDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(32, 32, 32, 0.9)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                <DialogTitle>Client Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        marginBottom: 3
                    }}>
                        <Avatar sx={{ 
                            width: 56, 
                            height: 56,
                            backgroundColor: 'rgba(29, 155, 240, 0.1)',
                            color: '#1d9bf0'
                        }}>
                            {selectedClient.name ? selectedClient.name.charAt(0).toUpperCase() : 'C'}
                        </Avatar>
                        <Typography variant="h6">
                            {selectedClient.name}
                        </Typography>
                    </Box>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 2 }} />
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Email
                            </Typography>
                            <Typography variant="body1">
                                {selectedClient.email}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Phone
                            </Typography>
                            <Typography variant="body1">
                                {selectedClient.phone}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setContactDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Contracts;