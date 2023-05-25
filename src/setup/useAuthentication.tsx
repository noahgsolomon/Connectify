import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthentication() {
    const navigate = useNavigate();
    const jwtToken = localStorage.getItem('jwtToken');
    const expiryDateString = localStorage.getItem('expiry');
    let expiryDate = expiryDateString ? new Date(expiryDateString) : null;
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (jwtToken && expiryDate && expiryDate > new Date()) {
            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
                navigate('/dashboard');
            } else {
                setShowContent(true);
            }
        } else {
            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
                setShowContent(true);
            } else {
                navigate('/login');
            }
        }
    }, [navigate]);

    return showContent;
}