import React, {useState} from "react";
import './style.css'
import Header from "../../common/Components/Header/Header.tsx";
import useAuthentication from "../../setup/useAuthentication.tsx";
import {signUp} from "../../util/api/userapi.tsx";
import SlideMessage from "../../util/status.tsx";

const Signup : React.FC = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, duration?: number } | null>(null);

    const showContent = useAuthentication();
    if (!showContent){
        return null;
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username || username.length < 8) {
            setSlideMessage({ message: 'Username must be at least 8 characters long', color: 'var(--error-color)' });
        } else if (!email) {
            setSlideMessage({ message: 'Please provide a valid email', color: 'var(--error-color)' });
        } else if (!password || password.length < 8) {
            setSlideMessage({ message: 'Password must be at least 8 characters long', color: 'var(--error-color)' });
        } else if (password !== confirmPassword) {
            setSlideMessage({ message: 'Passwords do not match', color: 'var(--error-color)' });
        } else {
            const response = await signUp(username, email, password);
            setSlideMessage(response);
        }

        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div>
            <Header page={'signup'}/>
            <div className="signup-wrapper">
                <div className="signup-container">
                    <h2>Sign Up</h2>
                    <form id="signup-form" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" required
                                   value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" required
                                   value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" required
                                   value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="confirm-password">Confirm Password:</label>
                            <input type="password" id="confirm-password" name="confirm-password" required
                                   value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div>
                            <input type="submit" value="Sign Up" className="btn-signup"/>
                        </div>
                    </form>
                </div>
            </div>
            {slideMessage && <SlideMessage {...slideMessage} />}
        </div>
    )
}

export default Signup