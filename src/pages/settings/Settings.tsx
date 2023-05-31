import React, {useEffect, useState} from 'react';
import './style.css';
import {
    updateProfileSettings,
    updateTheme,
    profile,
    sendEmailChangeVerification,
    deleteAccount
} from "../../util/api/userapi.tsx";
import {applyTheme} from "../../util/userUtils.tsx";
import SlideMessage from "../../util/status.tsx";
type UserType = 'USER' | 'ADMIN';
type Theme = 'light' | 'dark';

const Settings: React.FC = () => {
    const [selectedSetting, setSelectedSetting] = useState('account');

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, messageKey: number, duration?: number } | null>(null);
    const [editedProfile, setEditedProfile] = useState({firstName: '', lastName: '', email: '', profilePic: ''});
    const [logout, setLogout] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);

    const [myProfile, setMyProfile] = useState({
        users: {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            type: 'USER' as UserType,
            topCategory: "",
            country: "",
            bio: "",
            cardColor: "",
            backgroundColor: "",
            theme: 'dark' as Theme,
            profilePic: "",
            online: "",
        },
        followers: 0,
        following: 0,
    });

    const settingsOptions = ['account', 'password'];

    const emojiList = ['🌞', '🌝', '🌛', '🌜', '🌚', '😀', '😁', '😂',
        '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰',
        '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶',
        '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛',
        '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖',
        '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱',
        '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮',
        '🤧', '😇', '🤠', '🤡', '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😈',
        '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼',
        '😽', '🙀', '😿', '😾', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓',
        '👴', '👲', '👳‍♀️', '👳‍♂️', '🧕', '🧔', '👱‍♂️', '👱‍♀️', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦲',
        '👩‍🦲', '👨‍🦳', '👩‍🦳', '🦸‍♀️', '🦸‍♂️', '🦹‍♀️', '🦹‍♂️', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '💂‍♀️', '💂‍♂️', '🕵️‍♀️',
        '🕵️‍','👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭',
        '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️',
        '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰', '🤵', '👸', '🤴', '🤶', '🎅', '🧙‍♀️', '🧙‍♂️', '🧝‍♀️',
        '🧝‍♂️', '🧛‍♀️', '🧛‍♂️', '🧟‍♀️', '🧟‍♂️', '🧞‍♀️', '🧞‍♂️', '🧜‍♀️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽',
        '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦢',
        '🦅', '🦉', '🦚', '🦜', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐚',
        '🐞', '🐜', '🦗', '🕷', '🕸', '🦂', '🦟', '🦠', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙',
        '🦑', '🦐', '🦀', '🐡', '🐠'];

    const handleSettingClick = (option: string) => {
        setSelectedSetting(option);
    };



    useEffect(() => {
        const fetchData = async () => {
            const profileFetch = await profile();
            if (profileFetch){
                setMyProfile(profileFetch);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const postData = async () => {
            if (theme === 'light'){
                localStorage.setItem('theme', 'light');
                await updateTheme('light');
                applyTheme();
            }
            else{
                localStorage.setItem('theme', 'dark');
                await updateTheme('dark');
                applyTheme();
            }
        }

        postData();
    }, [theme]);

    const handleSubmitEdit = () => {
        const editedFirstName = editedProfile.firstName === '' ? myProfile.users.firstName : editedProfile.firstName;
        const editedLastName = editedProfile.lastName === '' ? myProfile.users.lastName : editedProfile.lastName;
        const editedEmail = editedProfile.email === '' ? myProfile.users.email : editedProfile.email;
        const editedProfilePic = editedProfile.profilePic === '' ? myProfile.users.profilePic : editedProfile.profilePic;
        console.log(editedProfilePic);
        if (editedFirstName === myProfile.users.firstName && editedLastName === myProfile.users.lastName && editedEmail === myProfile.users.email && editedProfilePic === myProfile.users.profilePic){
            setEditedProfile({firstName: '', lastName: '', email: '', profilePic: ''})
            return;
        }

        if (editedFirstName.length < 1 || editedFirstName.length > 20 || editedLastName.length < 1 || editedLastName.length > 20 || editedEmail.length < 1 || editedEmail.length > 50){
            setSlideMessage({message: 'Invalid input', color: 'var(--error-color)', messageKey: Math.random()});
            setEditedProfile({firstName: '', lastName: '', email: '', profilePic: ''})
            return;
        }

        const postData = async () => {
            const response = await updateProfileSettings(editedFirstName, editedLastName, editedEmail, editedProfilePic);

            if (response){
                if (editedEmail !== myProfile.users.email){
                    const emailChange = await sendEmailChangeVerification(editedEmail);
                    if (emailChange.status === 'valid'){
                        setSlideMessage({message: 'Verification email sent!', color: 'green', messageKey: Math.random()});
                    }
                    else if (emailChange.status === 'taken'){
                        setSlideMessage({message: 'Email already in use', color: 'var(--error-color)', messageKey: Math.random()});
                    }
                }
                else{
                    setSlideMessage({message: 'updated profile!', color: 'green', messageKey: Math.random()});
                }
                setMyProfile({...myProfile, users:
                        {...myProfile.users, firstName: editedFirstName, lastName: editedLastName, profilePic: editedProfilePic}});
                localStorage.setItem('emoji', editedProfilePic);
            }
            else{
                setSlideMessage({message: 'Unable to update profile', color: 'var(--error-color)', messageKey: Math.random()});
            }
        }

        postData();
        setEditedProfile({firstName: '', lastName: '', email: '', profilePic: ''})

    }

    const handleCancelEdit = () => {
        setEditedProfile({firstName: '', lastName: '', email: '', profilePic: ''});
    }


    const renderAccountContent = () => {
        return (
            <div className="account-content">
                <div className="profile-info">
                    <span className="profile-emoji" onClick={() => {
                        setEditedProfile({...editedProfile, profilePic: emojiList[Math.floor(Math.random()*emojiList.length)]})
                    }}>{(editedProfile.profilePic === '') ? myProfile.users.profilePic : editedProfile.profilePic}</span>
                    <div className="theme-switch-settings">
                        <button className="theme-btn light-mode" onClick={() => setTheme('light')}>
                            🌞
                        </button>
                        <button className="theme-btn dark-mode" onClick={() => setTheme('dark')}>
                            🌚
                        </button>
                    </div>
                </div>
                <div className="input-fields">
                    <h2>General Info</h2>
                    <div className="input-group">
                        <label>First Name</label>
                        <input type="text" placeholder={myProfile.users.firstName}  value={editedProfile.firstName} onChange={e => setEditedProfile({...editedProfile, firstName: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" placeholder={myProfile.users.lastName}  value={editedProfile.lastName} onChange={e => setEditedProfile({...editedProfile, lastName: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder={myProfile.users.email}  value={editedProfile.email} onChange={e => setEditedProfile({...editedProfile, email: e.target.value})} />
                    </div>
                    <button className={'cancel-btn-settings'} onClick={handleCancelEdit}>❌</button>
                    <button className={'save-btn-settings'} onClick={handleSubmitEdit}>✅</button>
                </div>
            </div>
        );
    };

    return (
        <>
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
                    <button className={'logout-btn'} onClick={() => {setLogout(true)}}>Logout</button>
                    <button className={'delete-account-btn'} onClick={() => {setDeleteUser(true)}}>Delete account</button>
                </div>
                <div className="settings-content">
                    {selectedSetting === 'account' && renderAccountContent()}
                </div>
            </div>
        </div>
        <div className="confirm-delete-container" style={{display: ((deleteUser) || (logout) ? 'flex' : 'none')}}>
            <div className="confirm-delete-popup">
                <h3>Are you sure you want to {deleteUser ? 'delete your account' : 'log out'}?</h3>
                <div className="confirm-delete-popup-buttons">
                    <button className="cancel-popup-btn" onClick={() => {
                        setDeleteUser(false);
                        setLogout(false);
                    }}>Cancel</button>
                    <button className="delete-btn" onClick={() => {
                        if (logout){
                            setEditedProfile({...editedProfile, profilePic: '👋'});
                            setSlideMessage({message: 'See you around! :(', color: 'green', messageKey: Math.random()});

                            setTimeout(() => {
                                localStorage.removeItem('jwtToken');
                                window.location.href = '/';
                            }, 2000);

                            setLogout(false);
                        }
                        else if (deleteUser){
                            const deleteData = async () => {
                                const deleteAccountRequest = await deleteAccount();
                                if (deleteAccountRequest){
                                    setSlideMessage({message: 'Account deleted. Sad to see u go! :(', color: 'green', messageKey: Math.random()});
                                    setEditedProfile({...editedProfile, profilePic: '😭'});
                                    setTimeout(() => {
                                        localStorage.removeItem('jwtToken');
                                        window.location.href = '/';
                                    }, 2000);
                                }
                            }

                            deleteData();
                            setDeleteUser(false);

                        }
                    }}>🗑️ {deleteUser ? 'Delete' : 'Logout'}</button>
                </div>
            </div>
        </div>
    {slideMessage && <SlideMessage message={slideMessage.message} color={slideMessage.color} messageKey={slideMessage.messageKey} duration={slideMessage.duration}/>}
    </>
);
}

export default Settings;