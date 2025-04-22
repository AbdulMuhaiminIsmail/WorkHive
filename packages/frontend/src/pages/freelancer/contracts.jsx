import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Dialog, DialogTitle, DialogActions, DialogContent, Slider, TextField, Button, Paper, Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const endpoint = user.user_type === "Freelancer"
                    ? `http://localhost:5000/contracts/freelancer/${user.id}`
                    : `http://localhost:5000/contracts/client/${user.id}`;

                const contractsResponse = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setContracts(contractsResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchContracts();
    }, [token, user]);

    const handleCompleteContract = async (contractId) => {
        try {
            await axios.put(`http://localhost:5000/contracts/${contractId}`, { status: 'Completed' }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setContracts(prev =>
                prev.map(contract =>
                    contract.id === contractId ? { ...contract, status: 'Completed' } : contract
                )
            );

            setContractId(contractId);
            setOpenDialog(true);
        } catch (err) {
            console.error("Error updating contract status:", err);
        }
    };

    const handleCancelContract = async (contractId) => {
        try {
            await axios.put(`http://localhost:5000/contracts/${contractId}`, { status: 'Cancelled' }, {
                headers: { Authorization: `Bearer ${token}` },
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

    return (
        <>
            {/* Navigation Bar */}
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contracts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={user.user_type === "Client" ? 5 : 4} align="center">No contracts signed yet.</TableCell>
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
                                                                onClick={() => handleCompleteContract(contract.id)}
                                                            >
                                                                Mark Completed
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
        </>
    );
};

export default Contracts;
