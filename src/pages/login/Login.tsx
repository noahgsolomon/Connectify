import React, {useState} from "react";
import './style.css';
import Header from "../../common/Components/Header/Header.tsx";
import useAuthentication from "../../setup/useAuthentication.tsx";
import {login} from "../../util/api/userapi.tsx";
import SlideMessage from "../../util/status.tsx";
import {useNavigate} from "react-router-dom";
import {applyTheme} from "../../util/userUtils.tsx";
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, duration?: number } | null>(null);
    const navigate = useNavigate();
    const showContent = useAuthentication();

    if (!showContent){
        return null;
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username) {
            setSlideMessage({ message: 'Please enter your username', color: 'var(--error-color)' });
            return;
        }

        if (!password) {
            setSlideMessage({ message: 'Please enter your password', color: 'var(--error-color)' });
            return;
        }

        const response = await login(username, password);

        if (response.status === 'ok'){
            setSlideMessage({ message: response.message, color: response.color});
            applyTheme();
            navigate('/dashboard');
        }
        else {
            setSlideMessage({ message: response.message, color: response.color});
        }

        setUsername('');
        setPassword('');
    }

    return (
        <div>
            <Header page={'login'} />
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