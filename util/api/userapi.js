import {displayPosts} from "../postUtils.js";
import {sendMessage} from "./inboxapi.js";
import {showSlideMessage} from "../status.js";
let loggedInUser = null;
const jwtToken = localStorage.getItem('jwtToken');

async function signUp(username, email, password) {
    try{
        const model = {username, email, password};
        const response = await fetch('http://localhost:8080/sign-up', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model)
        });

        if (response.ok) {
            showSlideMessage('Successfully created! Check email to activate account', 'var(--slide-message-bg)', 7500);
        }
        else {
            showSlideMessage('Credentials invalid', 'var(--error-color');
        }
    } catch (error) {
        console.error(error);
    }
}

async function login(username, password){
    try {
        const model = { username, password };
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: 'include'
        });
        const responseBody = await response.json();


        if (response.ok) {
            console.log(localStorage.getItem('jwtToken'));
            localStorage.setItem('jwtToken', responseBody.token);
            let expiryDate = new Date();

            expiryDate.setTime(expiryDate.getTime() + (1000 * 60 * 60 * 24 * 7));

            localStorage.setItem('expiry', expiryDate.toISOString());
            console.log(localStorage.getItem('expiry'));
            localStorage.setItem('username', username);
            localStorage.setItem('theme', responseBody.theme);
            localStorage.setItem('emoji', responseBody.emoji);

            showSlideMessage('Successfully logged in!', 'var(--slide-message-bg)');
            return responseBody;
        }
        else {
            showSlideMessage('User does not exist', 'var(--error-color)');
        }
        return null;
    } catch (error) {
        const loginMessage = document.querySelector('.login-msg');
        loginMessage.innerHTML = 'User does not exist';
        loginMessage.style.color = 'red';
        setTimeout(() => {
            loginMessage.textContent = '';
        }, 2000);
        console.error(error);
    }
}

async function logout(){
    localStorage.removeItem('jwtToken');
    window.location.href = "../login/login.html";
}



async function userProfile(user){
    const profileJson = await fetchUserProfile(user);
    const myProfile = await profile();

    if (profileJson) {
        const userDetails = JSON.parse(profileJson);
        const profileCard = document.querySelector('.profile-card');
        profileCard.style.backgroundColor = 'var(--card)';
        const emoji = document.querySelector('.profile-emoji');

        emoji.textContent = userDetails.profilePic;
        let userOnline = userDetails.online.toLowerCase() === 'true';
        if (userOnline) {
            const onlineIndicator = document.createElement('div');
            onlineIndicator.className = "online-indicator";
            const blink = document.createElement('span');
            blink.className = "blink";
            onlineIndicator.appendChild(blink);
            emoji.appendChild(onlineIndicator);
        }
        if (userDetails.profilePic === undefined){
            emoji.textContent = '😀'
        }
        const profileName = document.querySelector('.profile-name');
        profileName.textContent = userDetails.username;
        const country = document.querySelector(".profile-country");
        country.textContent = 'Country: ' + userDetails.country;
        const bio = document.querySelector(".profile-bio");
        bio.textContent = userDetails.bio;
        const category = document.querySelector(".profile-category");
        category.textContent = userDetails.topCategory + ' enthusiast';
        let pageCount = 0;
        await displayPosts(myProfile, 'search', pageCount);

        if (loggedInUser === null){
            loggedInUser = await profile();
            loggedInUser = JSON.parse(loggedInUser);
        }

        window.onscroll = async function() {
            const d = document.documentElement;
            const offset = d.scrollTop + window.innerHeight;
            const height = d.offsetHeight;

            if (offset >= height) {
                pageCount += 1;
                console.log();
                console.log(pageCount);
                await displayPosts(myProfile, 'search', pageCount);
            }
        };

        const followDetailContainer = document.querySelector('.followers-following');
        const followCount = await getFollowCount(user);
        const followerCountSpan = document.createElement('span');
        followerCountSpan.className = 'followers-count';
        followerCountSpan.textContent = `${followCount.followerCount} followers`;

        const followingCountSpan = document.createElement('span');
        followingCountSpan.className = 'following-count';
        followingCountSpan.textContent = `${followCount.followingCount} following`;

        followDetailContainer.append(followerCountSpan);
        followDetailContainer.append(followingCountSpan);

        if (loggedInUser.username !== user){
            const messageUser = document.createElement('div');
            messageUser.className = 'message-user';

            const messageLabel = document.createElement('label');
            const messageBar = document.createElement('input');
            messageBar.type = 'text';
            messageBar.className = 'message-bar';
            messageBar.placeholder = 'Send message...';

            const sendMessageBtn = document.createElement('button');
            sendMessageBtn.className = 'send-message-btn';
            sendMessageBtn.textContent = 'Send';

            const userFollow = await isUserFollowed(user);

            const followBtn = document.createElement('button');
            followBtn.className = 'follow-btn';

            if (userFollow.followed){
                followBtn.textContent = 'Unfollow';
                followBtn.style.color = 'var(--text-color)';
                followBtn.style.backgroundColor = 'var(--emoji)';
            }
            else{
                followBtn.textContent = 'Follow';
                followBtn.style.backgroundColor = 'var(--detail-color)';
            }

            followBtn.addEventListener('click', async () => {
                if (followBtn.textContent === 'Follow'){
                    await followEvent(user);
                    followCount.followerCount += 1;
                    followerCountSpan.textContent = `${followCount.followerCount} followers`;
                    followBtn.style.backgroundColor = 'var(--emoji)';
                    followBtn.style.color = 'var(--text-color)';
                    followBtn.textContent = 'Unfollow';
                }
                else if (followBtn.textContent === 'Unfollow'){
                    await unfollowEvent(user);
                    followCount.followerCount -= 1;
                    followerCountSpan.textContent = `${followCount.followerCount} followers`;
                    followBtn.style.backgroundColor = 'var(--detail-color)';
                    followBtn.style.color = '#f5f5f5';
                    followBtn.textContent = 'Follow'
                }

            });

            messageLabel.append(messageBar);
            messageUser.append(messageLabel);
            messageUser.append(sendMessageBtn);

            const profileInfo = document.querySelector('.profile-info');
            profileInfo.append(followBtn);
            profileInfo.append(messageUser);

            sendMessageBtn.addEventListener('click', async() => {
                if (messageBar.value !== '') {
                    const messageStatus = document.querySelector('.message-status');
                    const message = messageBar.value;
                    messageBar.value = '';
                    const messageResponse = await sendMessage(userDetails.username, message);
                    if (messageResponse) {
                        showSlideMessage("sent message!", "#24bd47");
                        setTimeout(() => {
                            messageStatus.textContent = '';
                        }, 2000);
                    }
                }
        });

        }




        profileCard.style.display = 'block';
    }
}

async function profile()  {
    try {

        const response = await fetch("http://localhost:8080/profile", {
            method: "GET",
            headers: {"Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`}
        });

        const responseBody = await response.text();
        if (response.ok) {
            return responseBody;
        }
    } catch (error) {
        console.log(error);
    }
}

const updateProfile = async (country, bio, cardColor, backgroundColor, profilePic) => {
    const model = {
        country: country,
        bio: bio,
        cardColor: cardColor,
        backgroundColor: backgroundColor,
        profilePic: profilePic
    }
    try{
        const response = await fetch("http://localhost:8080/profile", {
            method: "PUT",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: JSON.stringify(model)
        });

        const responseBody = await response.text();
        if (response.ok){
            return responseBody;
        }
    }catch (error){
        console.log(error);
    }
}

async function fetchUsers() {
    try {
        const response = await fetch("http://localhost:8080/users", {
            method: "GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });

        const users = await response.text();
        if (response.ok){
        return users;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function fetchUserProfile(user){
    try {
        const response = await fetch(`http://localhost:8080/${user}`, {
            method: "GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });

        const responseBody = await response.text();
        if (response.ok){
        return responseBody;
        }
    } catch (error){
        console.log(error);
    }
}

//deprecated
async function profileColors(){
    const profileEmoji = document.querySelector('.profile-btn');
    const profileString = await profile();
    if (profileString){
        const profileDetails = JSON.parse(profileString);
        if (profileDetails.backgroundColor){
            document.body.style.backgroundColor = profileDetails.backgroundColor;
        }

        if (profileDetails.profilePic){
            profileEmoji.textContent = profileDetails.profilePic;
        }
        else {
            profileEmoji.textContent = '😀';
        }
    }
    return profileString;
}

async function getFollowCount(user) {
    try {
        const response = await fetch(`http://localhost:8080/${user}/follow-count`, {
            method: 'GET',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });

        const responseBody = await response.text();
        if (response.ok) {
            return JSON.parse(responseBody);
        }
    }
    catch (e) {
        console.log(e);
    }
}

async function followEvent(user){
    try{
        const response = await fetch(`http://localhost:8080/${user}/follow`, {
            method: 'POST',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });
        const responseBody = await response.text();
        console.log(responseBody);
    }catch (e) {
        console.log(e);
    }
}

async function unfollowEvent(user){
    try{
        const response = await fetch(`http://localhost:8080/${user}/unfollow`, {
            method: 'POST',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });
        const responseBody = await response.text();
        console.log(responseBody);
    }catch (e) {
        console.log(e);
    }
}

async function isUserFollowed(user){
    try{
        const response = await fetch(`http://localhost:8080/${user}/followed`, {
            method: 'GET',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });
        const responseBody = await response.text();
        if (response.ok){
            return JSON.parse(responseBody);
        }
    }catch (e) {
        console.log(e);
    }
}

async function friendsList(){
    try{
        const response = await fetch('http://localhost:8080/friends', {
            method: 'GET',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });
        const responseBody = await response.text();
        if (response.ok){
            return JSON.parse(responseBody);
        }
    }catch (e) {
        console.log(e);
    }
}

async function updateTheme(theme){
    try{
        const response = await fetch("http://localhost:8080/update-theme", {
            method: "PUT",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: theme
        });

        const responseBody = await response.text();
        console.log(responseBody);
        if (response.ok){
            return responseBody;
        }
    }catch (error){
        console.log(error);
    }
}

async function onlineHeartbeat() {
    try{
        const response = await fetch("http://localhost:8080/online", {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken}
        });

        await response;

    }catch (e) {
        console.log(e);
    }
}

export {
    profile,
    login,
    logout,
    updateProfile,
    fetchUsers,
    fetchUserProfile,
    signUp,
    userProfile,
    profileColors,
    loggedInUser,
    getFollowCount,
    friendsList,
    updateTheme,
    onlineHeartbeat
};