import React, { useState } from 'react';
import './style.css';

const Settings: React.FC = () => {
    const [selectedSetting, setSelectedSetting] = useState('account');

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    const settingsOptions = ['account', 'password', 'notifications', 'help'];

    const handleSettingClick = (option: string) => {
        setSelectedSetting(option);
    };

    const renderAccountContent = () => {
        return (
            <div>
                <h2>General Info</h2>
                <div className="input-group">
                    <label>First Name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
            </div>
        );
    };

    return (
        <div className="settings">
            <h1 className="settings-title">Account Settings</h1>
            <p className="settings-subtitle">Change your profile and account settings</p>
            <div className="settings-card">
                <div className="settings-options">
                    {settingsOptions.map(option => (
                        <p
                            key={option}
                            onClick={() => handleSettingClick(option)}
                            className={`settings-option ${selectedSetting === option ? 'selected-option' : ''}`}
                        >
                            {option}
                        </p>
                    ))}
                </div>
                <div className="settings-content">
                    {selectedSetting === 'account' && renderAccountContent()}
                </div>
            </div>
        </div>
    );
}

export default Settings;