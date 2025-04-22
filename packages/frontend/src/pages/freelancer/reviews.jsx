import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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

    return (
        <>
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

            <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                    Reviews
                </Typography>
                <Paper sx={{ padding: 2, background: "#f9f9f9" }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Contract ID</b></TableCell>
                                    <TableCell><b>Rating</b></TableCell>
                                    <TableCell><b>Feedback</b></TableCell>
                                    <TableCell><b>Posted</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reviews.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No reviews available.</TableCell>
                                    </TableRow>
                                ) : (
                                    reviews.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell>{review.contract_id}</TableCell>
                                            <TableCell>{review.rating} / 5</TableCell>
                                            <TableCell>{review.feedback}</TableCell>
                                            <TableCell>{moment(review.created_at).fromNow()}</TableCell>
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

export default Reviews;
