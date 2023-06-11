import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProfileButton: React.FC = () => {
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    const emoji = localStorage.getItem('emoji') || "😀";

    const handleOverlayClick = () => {
        setShowProfilePanel(false);
    }

    const overlay: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 7999
    }

    return (
        <>
            <Link to="#" className={'profile-btn'} onClick={() => setShowProfilePanel(prevState => !prevState)}>
                {emoji}
            </Link>
            {showProfilePanel && <div onClick={handleOverlayClick} style={overlay}></div>}
            <div className={`profile-panel ${showProfilePanel ? 'show' : ''}`}  onClick={() => setShowProfilePanel(prevState => !prevState)}>
                <Link to="/profile" className="profile-sub-btn">
                    {emoji} Profile
                </Link>
                <Link to="/settings" className="settings-sub-btn">
                    ⚙️Settings
                </Link>
            </div>
        </>
    );
};

export default ProfileButton;