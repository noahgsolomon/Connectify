import React, {useEffect, useState} from 'react';
import './style.css';

const Settings: React.FC = () => {
    const [selectedSetting, setSelectedSetting] = useState('account');

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [profileEmoji, setProfileEmoji] = useState<string | null>("");

    const settingsOptions = ['account', 'password', 'notifications', 'help'];

    const handleSettingClick = (option: string) => {
        setSelectedSetting(option);
    };

    const handleSaveClick = () => {
        // Simulate an API call to save the updated data.
        // Replace this with actual API call logic.
        console.log('Data saved successfully.');
    };

    useEffect(() => {
        // Get the profile emoji from localStorage when the component mounts.
        const emoji = localStorage.getItem('emoji');
        setProfileEmoji(emoji);
    }, []);

    const renderAccountContent = () => {
        return (
            <div className="account-content">
                <div className="profile-info">
                    <span className="profile-emoji">{profileEmoji}</span>
                    <p><strong>Username:</strong> {username}</p>
                    <p><strong>Name:</strong> {firstName} {lastName}</p>
                    <p><strong>Email:</strong> {email}</p>
                </div>
                <div className="input-fields">
                    <h2>General Info</h2>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
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
                    <button onClick={handleSaveClick}>Save</button>
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