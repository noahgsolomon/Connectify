import React, {useEffect, useState} from "react";
import useAuthentication from "../../setup/useAuthentication.tsx";
import {profile, updateProfile, updateTheme} from "../../util/api/userapi.tsx";
import Header from "../../common/Components/Header/Header.tsx";
import PostList from "../../common/Components/Post/Post.tsx";
import SlideMessage from "../../util/status.tsx";

import '../user/style.css';
import './style.css';
import {applyTheme} from "../../util/userUtils.tsx";


type UserType = 'USER' | 'ADMIN'
type Theme = 'light' | 'dark'

const Profile: React.FC = () => {

    const [myProfile, setMyProfile] = useState({
        users: {
            username: "",
            email: "",
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

    const [category, setCategory] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("");
    const [userLoaded, setUserLoaded] = useState(false);
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, messageKey: number, duration?: number } | null>(null);
    const [page, setPage] = useState<Array<number>>([0])
    const [editMode, setEditMode] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useAuthentication();

    useEffect(() => {
        const handleScroll = async () => {
            const d = document.documentElement;
            const offset = d.scrollTop + window.innerHeight;
            const height = d.offsetHeight;

            if (offset >= height) {
                setPage(prevPage => [...prevPage, prevPage[prevPage.length - 1] + 1]);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

    console.log(category);
    console.log(selectedCategory);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            const myProfile = await profile();
            console.log(myProfile);
            if (myProfile){
                console.log(myProfile);
                setMyProfile(myProfile);
                setUserLoaded(true);
            }
        };

        fetchProfileDetails();
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
        const postData = async () => {
            const response = await updateProfile(myProfile.users.country, myProfile.users.bio, myProfile.users.cardColor, myProfile.users.backgroundColor, myProfile.users.profilePic);
            if (response){
                setSlideMessage({message: 'updated profile!', color: 'green', messageKey: Math.random()});
                setEditMode(false);
            }
            else{
                setSlideMessage({message: 'Unable to update profile', color: 'var(--error-color)', messageKey: Math.random()});
                setEditMode(false);
            }
        }

        postData();

    }


    return (
        <>
            <div className={`page ${(userLoaded)? '' : 'hidden'}`}>
                <Header page={"profile"}/>
                <div className="profile-container">
                    <div className="profile-card">
                        <button className="edit-btn show" onClick={() =>  setEditMode(true)}>Edit</button>
                        <button className={`cancel-btn ${editMode ? 'show' : ''}`} onClick={() =>  setEditMode(false)}>Cancel</button>
                        <div className="theme-switch">
                            <button className="theme-btn light-mode" onClick={() => setTheme('light')}>
                                🌞
                            </button>
                            <button className="theme-btn dark-mode" onClick={() => setTheme('dark')}>
                                🌚
                            </button>
                        </div>
                        <div className="profile-info">
                            <div className="profile-header">
                                <div className="profile-emoji">{myProfile.users.profilePic}</div>
                            </div>
                            <h2 className="profile-name">{myProfile.users.username}</h2>
                            {editMode ?
                                    <textarea className="profile-country-edit"
                                              value={myProfile.users.country}
                                              onChange={e => setMyProfile(prev => ({...prev, users: {...prev.users, country: e.target.value}}))}
                                    />
                                :
                                <p className="profile-country">Country: {myProfile.users.country}</p>
                            }

                            {editMode ?
                                    <textarea className="profile-bio-edit"
                                              value={myProfile.users.bio}
                                              onChange={e => setMyProfile(prev => ({...prev, users: {...prev.users, bio: e.target.value}}))}
                                    />
                                :
                                <p className="profile-bio">{myProfile.users.bio}</p>
                            }
                            <p className="profile-category">{myProfile.users.topCategory} enthusiast</p>
                            <div className="followers-following">
                                <span className="followers-count">{myProfile.followers} followers</span>
                                <span className="following-count">{myProfile.following} following</span>
                            </div>
                            <button className={`save-btn ${editMode ? 'show' : ''}`} onClick={handleSubmitEdit}>✅</button>
                        </div>
                    </div>
                </div>
            </div>
            {userLoaded &&
                <div className={'user-post-container'}>
                    <div className={'post-wrapper'}>
                        <PostList setSlideMessage={setSlideMessage} page={page} category={''} lastDay={365} setCategory={setCategory} setSelectedCategory={setSelectedCategory} user={localStorage.getItem('username')}/>
                    </div>
                </div>
            }
            {slideMessage && <SlideMessage message={slideMessage.message} color={slideMessage.color} messageKey={slideMessage.messageKey} duration={slideMessage.duration}/>}
        </>
    );
}

export default Profile;