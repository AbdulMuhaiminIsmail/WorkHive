import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cnic: "",
        phoneNumber: "",
        userType: "Client"
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/auth/register", formData);
            console.log(response);
            setMessage("Registration successful!");
            navigate("/login");
        } catch (err) {
            console.error(err);
            setMessage("Registration failed!");
        }   
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Registration Portal</h2>
                {message && <p style={styles.successMessage}>{message}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
                    <input type="text" name="cnic" placeholder="CNIC" onChange={handleChange} required style={styles.input} />
                    <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required style={styles.input} />
                    
                    <select name="userType" onChange={handleChange} style={styles.select}>
                        <option value="Client">Client</option>
                        <option value="Freelancer">Freelancer</option>
                    </select>

                    <button type="submit" style={styles.button}>Register</button>
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
    select: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
        cursor: "pointer"
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

export default Register;
