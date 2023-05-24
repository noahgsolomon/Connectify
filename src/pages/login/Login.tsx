import React from "react";
import './style.css';
import Header from "../../common/Components/Header/Header.tsx";
import useAuthentication from "../../setup/useAuthentication.tsx";

const Login: React.FC = () => {

    const showContent = useAuthentication();
    if (!showContent){
        return null;
    }

    return (
        <div>
            <Header page={'login'} />
            <div className="login-wrapper">
                <div className="login-container">
                    <h2>Log In</h2>
                    <form id="login-form" action="#" method="post" noValidate={true}>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" required />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" required />
                        </div>
                        <div>
                            <input type="submit" value="Log In" className="btn-login" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;