/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { useState, useEffect } from "react";
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
    Stack,
    Chip,
    Divider,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Autocomplete
} from "@mui/material";
import { 
    Email, 
    Lock, 
    Visibility, 
    VisibilityOff, 
    Person, 
    CreditCard, 
    Phone, 
    Work, 
    Description 
} from "@mui/icons-material";

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        userType: "Client",
        name: "",
        email: "",
        password: "",
        cnic: "",
        phoneNumber: "",
        title: "",
        biography: "",
    });
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [skillsPool, setSkillsPool] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(true);
    const [skillsError, setSkillsError] = useState(null);
    const [userId, setUserId] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoadingSkills(true);
                const response = await axios.get("http://localhost:5000/skills");
                setSkillsPool(response.data);
            } catch (err) {
                console.error("Error fetching skills:", err);
                setSkillsError("Failed to load skills. Please try again later.");
            } finally {
                setLoadingSkills(false);
            }
        };
        fetchSkills();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkillChange = (event, value) => {
        setSelectedSkills(value);
    };

    const handleUserRegistration = async () => {
        try {
            const response = await axios.post("http://localhost:5000/auth/register", formData);
            setUserId(response.data.id);
            return response.data.id;
        } catch (err) {
            throw err;
        }
    };

    const handleSkillsRegistration = async (userId) => {
        try {
            if (selectedSkills.length > 0) {
                await axios.post("http://localhost:5000/skills", {
                    userId,
                    skillIds: selectedSkills.map(skill => skill.id)
                });
            }
        } catch (err) {
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUserId = await handleUserRegistration();
            
            if (formData.userType === 'Freelancer') {
                await handleSkillsRegistration(newUserId);
            }
            
            setMessage("Registration successful!");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            console.error(err);
            setMessage("Registration failed: " + (err.response?.data?.message || "Please try again"));
        }   
    };

    const nextStep = () => {
        if (step === 1 && !formData.userType) {
            setMessage("Please select your account type");
            return;
        }
        setStep(step + 1);
        setMessage("");
    };

    const prevStep = () => {
        setStep(step - 1);
        setMessage("");
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 3,
                                textAlign: 'center',
                                fontWeight: 600
                            }}
                        >
                            Let's get started! What type of account are you creating?
                        </Typography>
                        
                        <RadioGroup
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            sx={{ mb: 4 }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                                <Paper 
                                    elevation={formData.userType === 'Freelancer' ? 4 : 0}
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: '8px',
                                        bgcolor: formData.userType === 'Freelancer' ? 'rgba(29, 185, 84, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: formData.userType === 'Freelancer' ? '1px solid rgba(29, 185, 84, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(29, 185, 84, 0.08)'
                                        }
                                    }}
                                    onClick={() => setFormData({...formData, userType: 'Freelancer'})}
                                >
                                    <FormControlLabel 
                                        value="Freelancer" 
                                        control={<Radio sx={{ color: formData.userType === 'Freelancer' ? '#1db954' : 'rgba(255, 255, 255, 0.7)' }} />} 
                                        label={
                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                                                I'm a Freelancer
                                            </Typography>
                                        } 
                                    />
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                                        Join to find work and showcase your skills
                                    </Typography>
                                </Paper>
                                
                                <Paper 
                                    elevation={formData.userType === 'Client' ? 4 : 0}
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: '8px',
                                        bgcolor: formData.userType === 'Client' ? 'rgba(29, 155, 240, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: formData.userType === 'Client' ? '1px solid rgba(29, 155, 240, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(29, 155, 240, 0.08)'
                                        }
                                    }}
                                    onClick={() => setFormData({...formData, userType: 'Client'})}
                                >
                                    <FormControlLabel 
                                        value="Client" 
                                        control={<Radio sx={{ color: formData.userType === 'Client' ? '#1d9bf0' : 'rgba(255, 255, 255, 0.7)' }} />} 
                                        label={
                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                                                I'm a Client
                                            </Typography>
                                        } 
                                    />
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                                        Join to find talented freelancers for your projects
                                    </Typography>
                                </Paper>
                            </Box>
                        </RadioGroup>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 3,
                                textAlign: 'center',
                                fontWeight: 600
                            }}
                        >
                            {formData.userType === 'Freelancer' 
                                ? "Tell us about yourself" 
                                : "Let's set up your account"}
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: '#ffffff',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.15)'
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }
                            }}
                            sx={{ mb: 2 }}
                        />
                        
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
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
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
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        <TextField
                            fullWidth
                            label="CNIC"
                            name="cnic"
                            value={formData.cnic}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCard sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: '#ffffff',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.15)'
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: '#ffffff',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.15)'
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }
                            }}
                        />
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 3,
                                textAlign: 'center',
                                fontWeight: 600
                            }}
                        >
                            {formData.userType === 'Freelancer' 
                                ? "Complete your Freelancer profile" 
                                : "Tell us about your business"}
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label={formData.userType === 'Freelancer' ? "Professional Title" : "Business Title"}
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Work sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: '#ffffff',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.15)'
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        <TextField
                            fullWidth
                            label={formData.userType === 'Freelancer' ? "Your Bio" : "Business Description"}
                            name="biography"
                            value={formData.biography}
                            onChange={handleChange}
                            margin="normal"
                            required
                            multiline
                            rows={4}
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Description sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: '#ffffff',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.15)'
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        {formData.userType === 'Freelancer' && (
                            <Autocomplete
                                multiple
                                options={skillsPool.filter(skill => 
                                    !selectedSkills.some(selected => selected.id === skill.id)
                                )}
                                getOptionLabel={(option) => option.name}
                                loading={loadingSkills}
                                value={selectedSkills}
                                onChange={handleSkillChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Select your skills"
                                        placeholder="Search skills..."
                                        error={!!skillsError}
                                        helperText={skillsError}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start">
                                                        <Work sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                                    </InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                            endAdornment: (
                                                <>
                                                    {loadingSkills ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                            sx: {
                                                color: '#ffffff',
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.15)'
                                                }
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                            }
                                        }}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.name}
                                            {...getTagProps({ index })}
                                            sx={{
                                                bgcolor: 'rgba(29, 185, 84, 0.2)',
                                                color: '#ffffff',
                                                mr: 1,
                                                mb: 1
                                            }}
                                            key={option.id}
                                        />
                                    ))
                                }
                                sx={{ mb: 3 }}
                            />
                        )}
                    </Box>
                );
            default:
                return null;
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
            overflow: 'hidden',
            margin: 0
        }}>
            <Fade in={true} timeout={800}>
                <Paper elevation={0} sx={{
                    width: '100%',
                    maxWidth: '500px',
                    p: 4,
                    bgcolor: 'rgba(32, 32, 32, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.36)'
                }}>
                    <Box textAlign="center" mb={4}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 800,
                                color: '#ffffff',
                                mb: 1,
                                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                                letterSpacing: '-0.75px',
                                fontSize: '2.25rem'
                            }}
                        >
                            Join WorkHive
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
                            {step === 1 ? "Create your account" : `Step ${step} of 3`}
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

                    <Box component="form" onSubmit={handleSubmit}>
                        {renderStep()}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            {step > 1 ? (
                                <Button
                                    onClick={prevStep}
                                    variant="outlined"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '4px',
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                        color: '#ffffff',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.4)'
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                            ) : (
                                <div></div> // Empty div to maintain space
                            )}

                            {step < 3 ? (
                                <Button
                                    onClick={nextStep}
                                    variant="contained"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '4px',
                                        bgcolor: '#ffffff',
                                        color: '#121212',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            transform: 'scale(1.02)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '4px',
                                        bgcolor: formData.userType === 'Freelancer' ? '#1db954' : '#1d9bf0',
                                        color: '#ffffff',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        '&:hover': {
                                            bgcolor: formData.userType === 'Freelancer' ? '#1ed760' : '#1a8cd8',
                                            transform: 'scale(1.02)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Complete Registration
                                </Button>
                            )}
                        </Box>

                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 3 }}>
                            <Typography 
                                variant="body1" 
                                color="rgba(255, 255, 255, 0.7)"
                                sx={{ fontFamily: '"Inter", sans-serif' }}
                            >
                                Already have an account?
                            </Typography>
                            <Button 
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
                                    }
                                }}
                                onClick={() => navigate("/")}
                            >
                                Sign In
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
};

export default Register;