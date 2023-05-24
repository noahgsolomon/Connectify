import React from "react";
import './style.css'
import Header from "../../common/Components/Header/Header.tsx";
import useAuthentication from "../../setup/useAuthentication.tsx";

const Signup : React.FC = () => {

    const showContent = useAuthentication();
    if (!showContent){
        return null;
    }

    return (
        <div>
            <Header page={'signup'}/>
            <div className="signup-wrapper">
                <div className="signup-container">
                    <h2>Sign Up</h2>
                    <form id="signup-form" action="#" method="post" noValidate>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" required/>
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" required/>
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" required/>
                        </div>
                        <div>
                            <label htmlFor="confirm-password">Confirm Password:</label>
                            <input type="password" id="confirm-password" name="confirm-password" required/>
                        </div>
                        <div>
                            <input type="submit" value="Sign Up" className="btn-signup"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup