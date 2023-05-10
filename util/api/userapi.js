import {getUserPosts} from "./postapi.js";
import {postRender} from "../postUtils.js";
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
            body: JSON.stringify(model),
            credentials: 'include'
        });
        const responseBody = await response.text();

        if (response.ok) {
            const signUpMessage = document.querySelector('.signup-msg');
            signUpMessage.innerHTML = 'Successfully created! Check email to activate account';
            signUpMessage.style.color = 'green';
            console.log(responseBody);
        }
        else {
            console.log(responseBody);
            const signUpMessage = document.querySelector('.signup-msg');
            signUpMessage.innerHTML = 'Credentials invalid';
            signUpMessage.style.color = 'red';
            setTimeout(() => {
                signUpMessage.textContent = '';
            }, 2000);
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
        console.log(responseBody.token);

        if (response.ok) {
            localStorage.setItem('jwtToken', responseBody.token);
            const loginMessage = document.querySelector('.login-msg');
            loginMessage.innerHTML = 'Successfully logged in!';
            loginMessage.style.color = 'green';
            setTimeout(() => {
                loginMessage.textContent = '';
            }, 2000);
            return responseBody;
        }
        else {
            const loginMessage = document.querySelector('.login-msg');
            loginMessage.innerHTML = 'User does not exist';
            loginMessage.style.color = 'red';
            setTimeout(() => {
                loginMessage.textContent = '';
            }, 2000);
        }
        return null;
    } catch (error) {
        console.error(error);
    }
}

async function logout(){
    try{
        const response = await fetch('http://localhost:8080/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken},
            redirect: 'manual'
    });
        console.log(await response)
        if (response.ok){
            localStorage.removeItem('jwtToken');
            window.location.href = "../login/login.html";
        }
        else {
            console.log('Logout failed');
        }
    }catch (e){
        console.log(e);
    }
} //TODO work on logout which does not work right now



async function userProfile(user){
    const profileJson = await fetchUserProfile(user);
    if (profileJson){
        const userDetails = JSON.parse(profileJson);
        const profileCard = document.querySelector('.profile-card');

        const emoji = document.querySelector('.profile-emoji');
        emoji.textContent = userDetails.profilePic;
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
        profileCard.style.backgroundColor = userDetails.cardColor;
        document.body.style.backgroundColor = userDetails.backgroundColor;
        if (!userDetails.cardColor){
            profileCard.style.backgroundColor = 'white';
        }
        if (!userDetails.backgroundColor){
            document.body.style.backgroundColor = 'whitesmoke'
        }

        const main = document.querySelector('.posts');
        const postListString = await getUserPosts(user);
        if (postListString) {
            await postRender(postListString, profileJson, main, 'search');
        }

        if (loggedInUser === null){
            loggedInUser = await profile();
            loggedInUser = JSON.parse(loggedInUser);
        }

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
                followBtn.style.backgroundColor = rgbToRGBA(userDetails.backgroundColor, 0.5);
            }
            else{
                followBtn.textContent = 'Follow';
                followBtn.style.backgroundColor = '#4892ee';
            }

            followBtn.addEventListener('click', async () => {
                if (followBtn.textContent === 'Follow'){
                    await followEvent(user);
                    followCount.followerCount += 1;
                    followerCountSpan.textContent = `${followCount.followerCount} followers`;
                    console.log(userDetails.backgroundColor)
                    followBtn.style.backgroundColor = rgbToRGBA(userDetails.backgroundColor, 0.5);
                    followBtn.textContent = 'Unfollow';
                }
                else if (followBtn.textContent === 'Unfollow'){
                    await unfollowEvent(user);
                    followCount.followerCount -= 1;
                    followerCountSpan.textContent = `${followCount.followerCount} followers`;
                    followBtn.style.backgroundColor = '#4892ee';
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
                        showSlideMessage("sent message!", "green");
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

async function profileColors(){
    const profileEmoji = document.querySelector('.profile-btn')
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

async function getNotifications(){
    try{
        const response = await fetch('http://localhost:8080/notifications', {
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

async function deleteAllNotifications(){
    try{
        const response = await fetch('http://localhost:8080/delete-notifications', {
            method: 'DELETE',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });
        const responseBody = await response.text();
        if (response.ok){
            return responseBody;
        }
    }catch (e) {
        console.log(e);
    }
}

function rgbToRGBA(rgb, alpha) {
    const regex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
    const match = regex.exec(rgb);
    if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        console.error("Invalid color format:", rgb);
        return rgb;
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
    getNotifications,
    deleteAllNotifications
};