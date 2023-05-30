import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import './style.css';
import {fetchUserProfile, followEvent, unfollowEvent} from "../../util/api/userapi.tsx";
import SlideMessage from "../../util/status.tsx";
import PostList from "../../common/Components/Post/Post.tsx";
import {sendMessage} from "../../util/api/inboxapi.tsx";
import useAuthentication from "../../setup/useAuthentication.tsx";

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
        following: 0,
        follows: false
    });

    const [userLoaded, setUserLoaded] = useState(false);
    const navigate = useNavigate();
    let { username } = useParams();
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, messageKey: number, duration?: number } | null>(null);
    const [page, setPage] = useState<Array<number>>([0])
    const [message, setMessage] = useState('');
    const [refresh, setRefresh] = useState(false);

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

    let user = '';
    if (typeof username === "string") {
        user = username;
    }

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
                    setRefresh(prevState => !prevState);
                }
            };

            fetchUserDetails();
    }, []);

    useEffect(() => {
        if (user === localStorage.getItem('username')){
            navigate('/profile', { replace: true });
        }

    }, [user]);

    const followBtnText = userProfile.follows ? 'Unfollow' : 'Follow';

    const followBtnStyle = {
        backgroundColor: userProfile.follows ? 'var(--emoji)' : 'var(--detail-color)',
        color: userProfile.follows ? 'var(--text-color)' : '#f5f5f5'
    };

    const handleFollowClick = () => {
      const postData = async () => {
          if (userProfile.follows){
              await unfollowEvent(user);
              setUserProfile(prevState => ({...prevState, follows: false, followers: prevState.followers - 1}));
          }
          else {
              await followEvent(user);
                setUserProfile(prevState => ({...prevState, follows: true, followers: prevState.followers + 1}));
          }
      }

      postData();

    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const handleMessageSend = () => {
        const postData = async () => {
            const messageSent = await sendMessage(user, message);
            if (messageSent){
                setSlideMessage({ message: 'Message sent', color: 'green', messageKey: Math.random(), duration: 3000});
                setMessage('');
            }
        }

        postData();
    }

    return (
        <>
        <div className={`page ${(userLoaded)? '' : 'hidden'}`}>
            <div className="user-container">
                <div className="user-card">
                    <div className="user-info">
                        <div className="user-header">
                            <div className="user-emoji">{userProfile.profilePic}
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
                        <button className="follow-btn" onClick={handleFollowClick} style={followBtnStyle}>{followBtnText}</button>
                        <div className="message-user">
                            <label>
                                <input type="text" className="message-bar" value={message} onChange={handleMessageChange} placeholder="Send message..."/>
                            </label>
                            <button className="send-message-btn-user" onClick={handleMessageSend}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {userLoaded &&
            <div className={'user-post-container'}>
                <div className={'post-wrapper'}>
                    <PostList setSlideMessage={setSlideMessage} page={page} category={''} lastDay={365} setCategory={null} setSelectedCategory={null} user={user} refresh={refresh} setRefresh={setRefresh} deletedPost={false} setDeletePost={null} setDeletedPost={null}/>
                </div>
            </div>
        }
            {slideMessage && <SlideMessage message={slideMessage.message} color={slideMessage.color} messageKey={slideMessage.messageKey} duration={slideMessage.duration}/>}
        </>
    );
}

export default User