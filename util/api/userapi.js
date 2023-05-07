import {getUserPosts} from "./postapi.js";
import {postRender} from "../postUtils.js";
import {sendMessage} from "./inboxapi.js";
import {showSlideMessage} from "../status.js";

let loggedInUser = null;

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
        const responseBody = await response.text();

        if (response.ok) {
            console.log(responseBody);
            console.log(responseBody);
            const loginMessage = document.querySelector('.login-msg');
            loginMessage.innerHTML = 'Successfully logged in!';
            loginMessage.style.color = 'green';
            setTimeout(() => {
                loginMessage.textContent = '';
            }, 2000);
            return responseBody;
        }
        else {
            console.log(responseBody);
            console.log(responseBody);
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

            const followBtn = document.createElement('button');
            followBtn.className = 'follow-btn';
            followBtn.textContent = 'Follow';

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
            headers: {"Content-Type": "application/json"},
            credentials: "include"
        });

        const responseBody = await response.text();
        console.log(responseBody);
        console.log(responseBody);
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: "include"
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

async function fetchUsers() {
    try {
        const response = await fetch("http://localhost:8080/users", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const users = await response.text();
        console.log(users);
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
            headers: {"Content-Type":"application/json"},
            credentials: "include"
        });

        const responseBody = await response.text();
        console.log(responseBody);
        console.log(responseBody);
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

export {
    profile,
    login,
    updateProfile,
    fetchUsers,
    fetchUserProfile,
    signUp,
    userProfile,
    profileColors,
    loggedInUser
};