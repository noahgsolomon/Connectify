import {
    profile,
    fetchUsers,
    fetchUserProfile,
} from '../../util/api/userapi.js'
import {getUserPosts} from "../../util/api/postapi.js";
import {postRender} from "../../util/postUtils.js";
import {sendMessage} from "../../util/api/inboxapi.js";
document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector('body');

    const slideMessage = document.createElement('div');
    slideMessage.className = 'slide-message';
    slideMessage.id = 'slideMessage';
    body.append(slideMessage);

    const searchContent = document.querySelector('.search-content');
    const profileEmoji = document.querySelector('.profile-btn');

    (async () => {
        const allUsers = await fetchUsers();
        const myProfileString = await profile();
        if (myProfileString){
            const profileDetails = JSON.parse(myProfileString);
            if (profileDetails.profilePic){
                profileEmoji.textContent = profileDetails.profilePic;
            }
            else {
                profileEmoji.textContent = '😀';
            }
        }
        if (allUsers){
            const usersList = JSON.parse(allUsers);
            const usernameList = usersList.map((user) => user.username);
            for (let i = 0; i < usersList.length; i++) {
                console.log(usernameList[i]);
            }
            const searchBar = document.querySelector(".search-bar");
            searchBar.addEventListener("input", (event) => {
                const searchTerm = event.target.value;

                const allDivs = searchContent.querySelectorAll('div');
                for (const div of allDivs) {
                    searchContent.removeChild(div);
                }

                if (searchTerm.length >= 3){
                    const matchingUsers = usernameList.filter((username) =>
                        username.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    console.log(matchingUsers);

                    for (const user of matchingUsers){
                        const userDiv = document.createElement('div');
                        userDiv.textContent = user;
                        userDiv.classList.add('search-result');
                        searchContent.append(userDiv);

                        userDiv.addEventListener('click', async () => {

                            const postsContainer = document.querySelector('.post-wrapper');
                            const allPosts = postsContainer.querySelectorAll('.post');
                            for (const post of allPosts){
                                postsContainer.removeChild(post);
                            }

                            const allDivs = searchContent.querySelectorAll('div');

                            for (const div of allDivs) {
                                searchContent.removeChild(div);
                            }

                            await userProfile(user);


                            searchBar.value = '';
                        });
                    }
                }
            });
        }
    })();


    const userProfile = async (user) => {
        const profileJson = await fetchUserProfile(user);
        if (profileJson){
            const userDetails = JSON.parse(profileJson);
            const profileCard = document.querySelector('.profile-card');
            const sendMessageButton = document.querySelector('.send-message-btn');
            const messageField = document.querySelector('.message-bar');

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
            body.style.backgroundColor = userDetails.backgroundColor;
            if (!userDetails.cardColor){
                profileCard.style.backgroundColor = 'white';
            }
            if (!userDetails.backgroundColor){
                body.style.backgroundColor = 'whitesmoke'
            }

            const main = document.querySelector('.posts');
            const postListString = await getUserPosts(user);
            if (postListString) {
                await postRender(postListString, profileJson, main, 'search');
            }

            sendMessageButton.addEventListener('click', async() => {
                if (messageField.value !== '') {
                    const messageStatus = document.querySelector('.message-status');
                    const message = messageField.value;
                    messageField.value = '';
                    const messageResponse = await sendMessage(userDetails.username, message);
                    if (messageResponse) {
                        messageStatus.textContent = 'sent message!';
                        setTimeout(() => {
                            messageStatus.textContent = '';
                        }, 2000);
                    }
                }
            });




            profileCard.style.display = 'block';
        }
    };

});