import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

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
            // localStorage.setItem("token", token);
            // localStorage.setItem("user", JSON.stringify(user));
            navigate("/home", { state: { user, token } });
        } catch (err) {
            console.error(err);
            setMessage("Login failed!");
        }   
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Login Portal</h2>
                {message && <p style={styles.successMessage}>{message}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />

                    <button type="submit" style={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

// Basic Inline Styling (You can replace this with CSS or Tailwind later)
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa"
    },
    card: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "300px"
    },
    heading: {
        marginBottom: "15px",
        color: "#333"
    },
    successMessage: {
        color: "green",
        fontSize: "14px",
        marginBottom: "10px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    input: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px"
    },
    button: {
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "10px"
    }
};

export default Login;
