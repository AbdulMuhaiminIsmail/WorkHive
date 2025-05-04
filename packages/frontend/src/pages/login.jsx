import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Paper, 
    Fade,
    InputAdornment,
    IconButton,
    Stack
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const navigateToRegisterScreen = () => {
        navigate("/register");
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/auth/login", formData);
            setMessage("Login successful!");
            const user = response.data.user;
            const token = response.data.token;
            navigate("/home", { state: { user, token } });
        } catch (err) {
            console.error(err);
            setMessage("Login failed!");
        }   
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#121212',
            p: 3,
            overflow: 'hidden', // Prevent scrollbars
            margin: 0 // Remove default margin
        }}>
            <Fade in={true} timeout={800}>
                <Paper elevation={0} sx={{
                    width: '100%',
                    maxWidth: '450px',
                    p: 4,
                    bgcolor: 'rgba(32, 32, 32, 0.95)',
                    borderRadius: '8px',
                    border: 'none', // Remove border completely
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.36)' // Add subtle shadow instead
                }}>
                    <Box textAlign="center" mb={4}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 800, // Increased weight
                                color: '#ffffff',
                                mb: 1,
                                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', // Modern font stack
                                letterSpacing: '-0.75px',
                                fontSize: '2.25rem' // Slightly larger
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography 
                            variant="subtitle1" 
                            color="rgba(255, 255, 255, 0.7)" 
                            sx={{ 
                                letterSpacing: '0.3px',
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 400,
                                fontSize: '1rem'
                            }}
                        >
                            Sign in to continue to WorkHive
                        </Typography>
                    </Box>

                    {message && (
                        <Typography 
                            color={message.includes("success") ? "rgba(255, 255, 255, 0.9)" : "error.main"}
                            textAlign="center"
                            mb={2}
                            sx={{ 
                                fontWeight: 500,
                                fontFamily: '"Inter", sans-serif'
                            }}
                        >
                            {message}
                        </Typography>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: '#ffffff',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.15)'
                                    },
                                    fontFamily: '"Inter", sans-serif'
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontFamily: '"Inter", sans-serif'
                                }
                            }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: '#ffffff',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.15)'
                                    },
                                    fontFamily: '"Inter", sans-serif'
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontFamily: '"Inter", sans-serif'
                                }
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 4,
                                py: 1.5,
                                borderRadius: '4px',
                                bgcolor: '#ffffff',
                                color: '#121212',
                                fontSize: '1rem',
                                fontWeight: 700,
                                fontFamily: '"Inter", sans-serif',
                                letterSpacing: '0.5px',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    transform: 'scale(1.02)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Login
                        </Button>

                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 3 }}>
                            <Typography 
                                variant="body1" 
                                color="rgba(255, 255, 255, 0.7)"
                                sx={{ fontFamily: '"Inter", sans-serif' }}
                            >
                                Haven't created an account?
                            </Typography>
                            <Button 
                                onClick={() => navigateToRegisterScreen()}
                                variant="text" 
                                sx={{ 
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontFamily: '"Inter", sans-serif',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        bgcolor: 'transparent'
                                    },
                                }}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
};

export default Login;