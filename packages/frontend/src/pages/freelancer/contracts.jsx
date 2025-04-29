import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AppBar, Toolbar, Typography, Dialog, DialogTitle, DialogActions,
    DialogContent, Slider, TextField, Button, Paper, Box,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
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

    // New state for client details dialog
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
            // Update the contracts table
            await axios.put(`http://localhost:5000/contracts/${contract.id}`, { status: 'Completed' }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the payments table
            await axios.put(`http://localhost:5000/payments/${contract.id}`, { status: 'Paid' }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Release funds to the freelancer's wallet
            await axios.put(`http://localhost:5000/users/${contract.freelancer_id}`, { creditsAdd: contract.agreed_amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Subtract funds from the client's wallet
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

    // Function to view contact details
    const handleViewDetails = async (contractId) => {
        const response = await axios.get(`http://localhost:5000/users/fetchClientByContractId/${contractId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response);

        const client = {
            name: response.data[0].name,
            email: response.data[0].email,
            phone: response.data[0].phone_number
        }

        setSelectedClient(client);
        setContactDialogOpen(true);
    };

    return (
        <>
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: "#1976D2" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        WorkHive
                    </Typography>
                    <Button color="inherit" onClick={() => navigate("/home", { state: { user, token } })}>Jobs</Button>
                    <Button color="inherit" onClick={() => navigate("/bids", { state: { user, token } })}>Bids</Button>
                    <Button color="inherit" onClick={() => navigate("/contracts", { state: { user, token } })}>Contracts</Button>
                    <Button color="inherit" onClick={() => navigate("/payments", { state: { user, token } })}>Payments</Button>
                    <Button color="inherit" onClick={() => navigate("/reviews", { state: { user, token } })}>Reviews</Button>
                    <Button color="inherit" onClick={() => navigate("/account", { state: { user, token } })}>Account</Button>
                </Toolbar>
            </AppBar>

            {/* Contracts List */}
            <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                    {user.user_type === "Freelancer" ? "My Contracts" : "Job Contracts"}
                </Typography>
                <Paper sx={{ padding: 2, background: "#f9f9f9" }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Contract ID</b></TableCell>
                                    <TableCell><b>Freelancer ID</b></TableCell>
                                    <TableCell><b>Agreed Amount (PKR)</b></TableCell>
                                    <TableCell><b>Status</b></TableCell>
                                    {user.user_type === "Client" && <TableCell><b>Action</b></TableCell>}
                                    {user.user_type === "Freelancer" && <TableCell><b>Contact</b></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contracts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No contracts signed yet.</TableCell>
                                    </TableRow>
                                ) : (
                                    contracts.map((contract) => (
                                        <TableRow key={contract.id}>
                                            <TableCell>{contract.id}</TableCell>
                                            <TableCell>{contract.freelancer_id}</TableCell>
                                            <TableCell>{contract.agreed_amount}</TableCell>
                                            <TableCell>{contract.status}</TableCell>
                                            {user.user_type === "Client" && (
                                                <TableCell>
                                                    {contract.status !== "Completed" && contract.status !== "Cancelled" && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                sx={{ mr: 1 }}
                                                                onClick={() => handleCompleteContract(contract)}
                                                            >
                                                                Release Funds
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => handleCancelContract(contract.id)}
                                                            >
                                                                Cancel Contract
                                                            </Button>
                                                        </>
                                                    )}
                                                </TableCell>
                                            )}
                                            {user.user_type === "Freelancer" && (
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => handleViewDetails(contract.id)}
                                                    >   
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Feedback Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Provide Feedback</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Rate the experience (1-5):</Typography>
                    <Slider
                        value={rating}
                        onChange={(e, newValue) => setRating(newValue)}
                        step={1}
                        marks
                        min={1}
                        max={5}
                        valueLabelDisplay="auto"
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmitReview} color="primary" variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Contact Dialog */}
            <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)}>
                <DialogTitle>Client Details</DialogTitle>
                <DialogContent>
                    <Typography><strong>Name:</strong> {selectedClient.name}</Typography>
                    <Typography><strong>Email:</strong> {selectedClient.email}</Typography>
                    <Typography><strong>Phone:</strong> {selectedClient.phone}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setContactDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Contracts;
