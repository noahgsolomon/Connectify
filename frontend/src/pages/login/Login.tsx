import React, {useState} from "react";
import './style.css';
import useAuthentication from "../../setup/useAuthentication.tsx";
import {login} from "../../util/api/userapi.tsx";
import SlideMessage from "../../util/status.tsx";
import {applyTheme} from "../../util/userUtils.tsx";
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, messageKey: number, duration?: number } | null>(null);
    const showContent = useAuthentication();

    if (!showContent){
        return null;
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username) {
            setSlideMessage({ message: 'Please enter your username', color: 'var(--error-color)', messageKey: Math.random() });
            return;
        }

        if (!password) {
            setSlideMessage({ message: 'Please enter your password', color: 'var(--error-color)', messageKey: Math.random() });
            return;
        }

        const response = await login(username, password);

        if (response.status === 'ok'){
            localStorage.setItem('jwtToken', response.token);
            let expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (1000 * 60 * 60 * 24 * 7));
            localStorage.setItem('expiry', expiryDate.toISOString());
            localStorage.setItem('username', username);
            localStorage.setItem('theme', response.theme);
            localStorage.setItem('emoji', response.emoji);
            localStorage.setItem('username', response.username);

            setSlideMessage({ message: response.message, color: response.color, messageKey: Math.random() });
            applyTheme();
            window.location.href = '/dashboard';
        }
        else {
            setSlideMessage({ message: response.message, color: response.color, messageKey: Math.random() });
        }

        setUsername('');
        setPassword('');
    }

    return (
        <div>
            <div className="login-wrapper">
                <div className="login-container">
                    <h2>Log In</h2>
                    <form id="login-form" action="#" method="post" noValidate={true} onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" required
                                   value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div>
                            <input type="submit" value="Log In" className="btn-login"/>
                        </div>
                    </form>
                </div>
            </div>
            {slideMessage && <SlideMessage {...slideMessage} />}
        </div>
    );
};

export default Login;