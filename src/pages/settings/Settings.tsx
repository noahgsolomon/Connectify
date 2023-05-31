import React, {useEffect, useState} from 'react';
import './style.css';
import {updateProfileSettings, updateTheme, profile} from "../../util/api/userapi.tsx";
import {applyTheme} from "../../util/userUtils.tsx";
import SlideMessage from "../../util/status.tsx";
type UserType = 'USER' | 'ADMIN';
type Theme = 'light' | 'dark';

const Settings: React.FC = () => {
    const [selectedSetting, setSelectedSetting] = useState('account');

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, messageKey: number, duration?: number } | null>(null);
    const [editedProfile, setEditedProfile] = useState({firstName: '', lastName: '', email: '', profilePic: ''});

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

    const settingsOptions = ['account', 'password', 'notifications', 'help'];

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
                setMyProfile({...myProfile, users:
                        {...myProfile.users, firstName: editedFirstName, lastName: editedLastName,
                            email: editedEmail, profilePic: editedProfilePic}});
                localStorage.setItem('emoji', editedProfile.profilePic);
                setSlideMessage({message: 'updated profile!', color: 'green', messageKey: Math.random()});
            }
            else{
                setSlideMessage({message: 'Unable to update profile', color: 'var(--error-color)', messageKey: Math.random()});
            }
        }

        postData();
        setEditedProfile({firstName: '', lastName: '', email: '', profilePic: ''})

    }

    const handleCancelEdit = () => {

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
                </div>
                <div className="settings-content">
                    {selectedSetting === 'account' && renderAccountContent()}
                </div>
            </div>
        </div>
    {slideMessage && <SlideMessage message={slideMessage.message} color={slideMessage.color} messageKey={slideMessage.messageKey} duration={slideMessage.duration}/>}
    </>
);
}

export default Settings;