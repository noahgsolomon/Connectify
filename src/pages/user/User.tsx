import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../../common/Components/Header/Header.tsx";
import './style.css';
import {fetchUserProfile} from "../../util/api/userapi.tsx";
import SlideMessage from "../../util/status.tsx";
import PostList from "../../common/Components/Post/Post.tsx";

const User : React.FC = () => {

    const [userProfile, setUserProfile] = useState({
        username: "",
        country: "",
        bio: "",
        topCategory: "",
        cardColor: "",
        backgroundColor: "",
        profilePic: "",
        online: "",
        followers: 0,
        following: 0
    });

    // const [message, setMessage] = useState('');
    // const [isFollowed, setIsFollowed] = useState(false);

    const [category, setCategory] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("");
    const [userLoaded, setUserLoaded] = useState(false);
    const navigate = useNavigate();
    let { username } = useParams();
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, messageKey: number, duration?: number } | null>(null);
    const [page, setPage] = useState<Array<number>>([0])

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

    let user = '';
    if (typeof username === "string") {
        user = username;
    }

    console.log(category);
    console.log(selectedCategory);

    useEffect(() => {
        if (username === undefined || username === null || username === "") {
            navigate('/dashboard', { replace: true });
        }
    }, [username, navigate]);

    useEffect(() => {
            const fetchUserDetails = async () => {
                const profile = await fetchUserProfile(user);
                console.log(profile);
                if (profile === undefined || profile === null) {
                    setSlideMessage({ message: 'User not found', color: 'red', messageKey: Math.random(), duration: 7000});
                    setTimeout(() => {
                        navigate('/dashboard', { replace: true });
                    }, 2000);
                }
                else{
                    console.log(profile);
                    setUserProfile(profile);
                    setUserLoaded(true);
                }
            };

            fetchUserDetails();
    }, []);

    return (
        <>
        <div className={`page ${(userLoaded)? '' : 'hidden'}`}>
        <Header page={"profile"}/>
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-info">
                        <div className="profile-header">
                            <div className="profile-emoji">{userProfile.profilePic}
                                {(userProfile.online.toLowerCase() === 'true') && <div className="online-indicator"><span className="blink"></span></div>}
                            </div>
                        </div>
                        <h2 className="profile-name">{userProfile.username}</h2>
                        <p className="profile-country">Country: {userProfile.country}</p>
                        <p className="profile-bio">{userProfile.bio}</p>
                        <p className="profile-category">{userProfile.topCategory} enthusiast</p>
                        <div className="followers-following">
                            <span className="followers-count">{userProfile.followers} followers</span>
                            <span className="following-count">{userProfile.following} following</span>
                        </div>
                        <button className="follow-btn">Unfollow</button>
                        <div className="message-user">
                            <label>
                                <input type="text" className="message-bar" placeholder="Send message..."/>
                            </label>
                            <button className="send-message-btn">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={'user-post-container'}>
            <div className={'post-wrapper'}>
                <PostList setSlideMessage={setSlideMessage} page={page} category={''} lastDay={365} setCategory={setCategory} setSelectedCategory={setSelectedCategory} user={user}/>
            </div>
        </div>
            {slideMessage && <SlideMessage message={slideMessage.message} color={slideMessage.color} messageKey={slideMessage.messageKey} duration={slideMessage.duration}/>}
        </>
    );
}

export default User