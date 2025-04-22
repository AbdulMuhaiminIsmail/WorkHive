import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from "@mui/material";
import axios from "axios";

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
                console.log(response.data);
                setPayments(response.data);
            } catch (error) {
                console.error("Error fetching payments:", error);
            }
        };

        fetchPayments();
    }, [user.id, token]);

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

            {/* Payments Table */}
            <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                    Payment History
                </Typography>
                <Paper sx={{ padding: 2, background: "#f9f9f9" }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Payment ID</b></TableCell>
                                    <TableCell><b>Contract ID</b></TableCell>
                                    <TableCell><b>Status</b></TableCell>
                                    <TableCell><b>Amount (PKR)</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No payment records available.</TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.id}</TableCell>
                                            <TableCell>{payment.contract_id}</TableCell>
                                            <TableCell>{payment.status}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </>
    );
};

export default Payments;
