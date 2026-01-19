import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Verification()  {
    const location = useLocation();
    const navigate = useNavigate();

    const userEmail = location.state.email;

    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        let timer;
        if (resendTimer > 0 && isResending) {
            timer = setTimeout(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setIsResending(false);
        }
        return () => clearTimeout(timer); 
    }, [resendTimer, isResending]);

    
    useEffect(() => {
        if (!userEmail) {
            setMessage("No email provided. Please sign up or log in again.");
            
            const redirectTimer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(redirectTimer);
        }
    }, [userEmail, navigate]);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!userEmail || !otp) {
            setMessage('Please enter both email and OTP.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/authentication/verify-otp`, {
                email: userEmail,
                otp: otp
            });

            if (response.data && response.data.message === "User is Identified") {
                setMessage('Account verified successfully! Redirecting to login...');
                setLoading(false);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage(response.data?.message || 'Verification failed. Please try again.');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setMessage(error.response?.data?.message || 'An error occurred during verification.');
            console.error('OTP verification error:', error);
        }
    };

    const handleResendOTP = async () => {
        if (!userEmail) {
            setMessage("Cannot resend OTP, email is missing.");
            return;
        }

        setIsResending(true);
        setResendTimer(60);  

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/authentication/resend-otp`, { 
                 email: userEmail 
            });

            if (response.data && response.data.message.includes("OTP sent")) {
                setMessage('New OTP sent to your email.');
            } else {
                setMessage(response.data?.message || 'Failed to resend OTP.');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error resending OTP.');
            console.error('Resend OTP error:', error);
        } finally {
         
        }
    };

    if (!userEmail) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>OTP Verification</h2>
                <p style={styles.messageError}>{message}</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Verify Your Account</h2>
            <p style={styles.subText}>Please enter the 6-digit code sent to:</p>
            <p style={styles.emailText}><b>{userEmail}</b></p>

            <form onSubmit={handleVerifyOTP} style={styles.form}>
                <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="Enter OTP"
                    required
                    style={styles.input}
                    disabled={loading}
                />
                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
            </form>

            <button
                onClick={handleResendOTP}
                disabled={isResending && resendTimer > 0}
                style={{ ...styles.resendButton, opacity: (isResending && resendTimer > 0) ? 0.6 : 1 }}
            >
                {isResending && resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>

            {message && (
                <p style={message.includes('success') || message.includes('sent') ? styles.messageSuccess : styles.messageError}>
                    {message}
                </p>
            )}
        </div>
    );
};


const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    heading: {
        color: '#333',
        marginBottom: '20px',
    },
    subText: {
        color: '#666',
        marginBottom: '10px',
    },
    emailText: {
        color: '#007bff',
        fontSize: '1.1em',
        marginBottom: '25px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    input: {
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
        textAlign: 'center',
        letterSpacing: '2px',
    },
    button: {
        padding: '12px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#28a745',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#218838',
    },
    resendButton: {
        marginTop: '20px',
        padding: '10px 15px',
        borderRadius: '5px',
        border: '1px solid #007bff',
        backgroundColor: 'transparent',
        color: '#007bff',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease, background-color 0.3s ease',
    },
    resendButtonHover: {
        backgroundColor: '#e7f3ff',
    },
    messageSuccess: {
        color: '#28a745',
        marginTop: '20px',
        fontWeight: 'bold',
    },
    messageError: {
        color: '#dc3545',
        marginTop: '20px',
        fontWeight: 'bold',
    },
};

