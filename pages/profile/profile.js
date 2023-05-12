import {
    profile,
    updateProfile,
    getFollowCount,
    logout
} from '../../util/api/userapi.js'
import {deletePost, getMyPosts, getPost, updatePost} from "../../util/api/postapi.js";
import {showSlideMessage} from "../../util/status.js";
import {formatDateAndTime} from "../../util/postUtils.js";

const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));
if (!jwtToken || expiryDate < new Date()){
    if (jwtToken){
        localStorage.removeItem('jwtToken');
    }
    localStorage.removeItem('expiry');
    console.log();
    localStorage.setItem('destination', '../profile/profile.html');
    window.location.href = "../login/login.html"
}
window.addEventListener("load", function() {

    const page = document.querySelector('.page');
    page.classList.remove('hidden');

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
    const emoji = document.querySelector('.profile-emoji');

    const profileCard = document.querySelector('.profile-card');
    const body = document.querySelector('body');

    document.querySelector('.settings-btn').addEventListener('click', function(e) {
        e.preventDefault();
        const settingsPanel = document.querySelector('.settings-panel');
        settingsPanel.classList.toggle('show');
    });

    document.querySelector('.page').addEventListener('click', function(e) {
        const settingsPanel = document.querySelector('.settings-panel');
        if (settingsPanel.classList.contains('show') && !settingsPanel.contains(e.target) && e.target !== document.querySelector('.settings-btn')) {
            settingsPanel.classList.remove('show');
        }
    });

    document.querySelector('#logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.logout-confirm-modal').style.display = 'flex';
        const settingsPanel = document.querySelector('.settings-panel');
        settingsPanel.classList.remove('show');
    });

    document.querySelector('#confirm-logout-btn').addEventListener('click', async function(e) {
        e.preventDefault();
        document.querySelector('.logout-confirm-modal').style.display = 'none';
        await logout();
    });

    document.querySelector('#cancel-logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.logout-confirm-modal').style.display = 'none';
    });


    (async () => {
        const profileJson = await profile();
        if (profileJson){
            const userDetails = JSON.parse(profileJson);

            const emoji = document.querySelector('.profile-emoji');
            emoji.textContent = userDetails.profilePic;
            const profileName = document.querySelector('.profile-name');
            profileName.textContent = userDetails.username;
            const country = document.querySelector(".profile-country");
            country.textContent = 'Country: ' + userDetails.country;
            const bio = document.querySelector(".profile-bio");
            bio.textContent = 'Bio: ' + userDetails.bio;
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

            const followDetailContainer = document.querySelector('.followers-following');
            const followCount = await getFollowCount(userDetails.username);
            const followerCountSpan = document.createElement('span');
            followerCountSpan.className = 'followers-count';
            followerCountSpan.textContent = `${followCount.followerCount} followers`;

            const followingCountSpan = document.createElement('span');
            followingCountSpan.className = 'following-count';
            followingCountSpan.textContent = `${followCount.followingCount} following`;

            followDetailContainer.append(followerCountSpan);
            followDetailContainer.append(followingCountSpan);

            const postListString = await getMyPosts();
            if (postListString) {
                const postList = JSON.parse(postListString);
                postList.reverse();

                const main = document.querySelector('.posts');
                for (const post of postList) {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';
                    postElement.style.backgroundColor = profileCard.style.backgroundColor;

                    const titleElement = document.createElement('h2');
                    titleElement.textContent = post.title;

                    const contentElement = document.createElement('p');
                    contentElement.textContent = post.body;

                    const postMeta = document.createElement('div')
                    postMeta.className = 'post-meta';

                    const category = document.createElement('span');
                    category.className = 'category';
                    category.textContent = post.category;

                    const author = document.createElement('span');
                    author.className = 'author';
                    author.textContent = post.username;

                    const postActions = document.createElement('div');
                    postActions.className = 'post-actions';

                    const postEditBtn = document.createElement('button');
                    postEditBtn.className = 'post-edit-btn';
                    postEditBtn.textContent = 'Edit'

                    const postDelBtn = document.createElement('button');
                    postDelBtn.className = 'post-del-btn';
                    postDelBtn.textContent = '🔥️';

                    postEditBtn.addEventListener('click', () => {

                        postActions.removeChild(postEditBtn);

                        const content = contentElement.textContent;
                        const title = titleElement.textContent;

                        const inputContainer = document.createElement('div');
                        inputContainer.style.display = 'flex';

                        const titleContainer = document.createElement('div');
                        titleContainer.style.display = 'flex'

                        const contentTextAreaElement = document.createElement('textarea');
                        contentTextAreaElement.className = 'content-text-area';
                        contentTextAreaElement.value = content;
                        contentTextAreaElement.rows = 5;

                        const titleTextAreaElement = document.createElement('textarea');
                        titleTextAreaElement.className = 'title-text-area';
                        titleTextAreaElement.value = title;

                        inputContainer.appendChild(contentTextAreaElement);
                        titleContainer.appendChild(titleTextAreaElement);

                        postElement.replaceChild(inputContainer, contentElement);
                        postElement.replaceChild(titleContainer, titleElement);

                        const postWidth = postElement.offsetWidth;
                        inputContainer.style.maxWidth = postWidth + 'px';

                        const postSaveBtn = document.createElement('button');
                        postSaveBtn.className = 'post-save-btn';
                        postSaveBtn.textContent = '✅';

                        postActions.append(postSaveBtn);

                        postSaveBtn.addEventListener('click', async () => {
                            const updatedPost = await updatePost(post.id, contentTextAreaElement.value, titleTextAreaElement.value);
                            if (updatedPost){
                                showSlideMessage("Updated post!", "#24bd47");
                            }
                            else {
                                showSlideMessage("Inappropriate Content!", "red");
                            }
                            const savedPostJson = await getPost(post.id);
                            const savedPost = JSON.parse(savedPostJson);
                            contentElement.textContent = savedPost.body;
                            titleElement.textContent = savedPost.title;
                            postElement.replaceChild(contentElement, inputContainer);
                            postElement.replaceChild(titleElement, titleContainer);
                            postSaveBtn.remove();
                            postActions.append(postEditBtn);
                        });

                    });

                    postDelBtn.addEventListener('click', async () => {
                        const confirmDeleteContainer = document.querySelector('.confirm-delete-container');
                        confirmDeleteContainer.style.display = 'flex';

                        const cancelBtn = document.querySelector('.confirm-delete-popup-buttons .cancel-popup-btn');
                        cancelBtn.addEventListener('click', () => {
                            // Hide the custom popup
                            confirmDeleteContainer.style.display = 'none';
                        });

                        const deleteBtn = document.querySelector('.confirm-delete-popup-buttons .delete-btn');
                        deleteBtn.addEventListener('click', async () => {
                            const deletedPost = await deletePost(post.id);
                            if (deletedPost){
                                showSlideMessage("Post Deleted!", "#24bd47");

                            }
                            else {
                                showSlideMessage("Error deleting post", "red");
                            }
                            postElement.remove();
                            confirmDeleteContainer.style.display = 'none';
                        });
                    });

                    const date = document.createElement('span');
                    const formattedLastModifiedDate = formatDateAndTime(post.lastModifiedDate);
                    date.className = 'date';
                    date.textContent = formattedLastModifiedDate;

                    postMeta.append(author);
                    postMeta.append(date);


                    postActions.append(postDelBtn);
                    postActions.append(postEditBtn);

                    postElement.append(titleElement);
                    postElement.append(contentElement);
                    postElement.append(category);
                    postElement.append(postMeta);
                    postElement.append(postActions);
                    main.append(postElement);
                }
            }

            profileCard.style.display = 'block';
        }
    })();

    const editButton = document.querySelector('.edit-btn');
    editButton.addEventListener('click', handleEditButtonClick);
    const cancelBtn = document.querySelector('.cancel-popup-btn');

    function handleEditButtonClick() {

        emoji.style.cursor = 'pointer';

        const editForm = document.querySelector('.edit-form');
        const countryInput = document.querySelector('#country');
        const bioInput = document.querySelector('#bio');
        const cardColors = document.querySelectorAll('.card-color');
        const backgroundColors = document.querySelectorAll('.bg-color');
        const initialCardColor = profileCard.style.backgroundColor;
        const initialBackgroundColor = body.style.backgroundColor;

        for (const color of cardColors){
            color.addEventListener('click', () => {
                profileCard.style.backgroundColor = color.style.backgroundColor;
            });
        }

        for (const color of backgroundColors){
            color.addEventListener('click', () => {
                body.style.backgroundColor = color.style.backgroundColor;
            });
        }

        cancelBtn.style.display = 'block';

        editForm.style.display = 'block';

        cancelBtn.addEventListener('click', () =>{
            editForm.style.display = 'none';
            cancelBtn.style.display = 'none';
            profileCard.style.backgroundColor = initialCardColor;
            body.style.backgroundColor = initialBackgroundColor;
        });

        emoji.addEventListener('click', () => {
            emoji.textContent = emojiList[Math.round(Math.random() * emojiList.length)];
        });

        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedCountry = countryInput.value.trim();
            const updatedBio = bioInput.value.trim();

            const newProfile = await updateProfile(updatedCountry, updatedBio, profileCard.style.backgroundColor, body.style.backgroundColor, emoji.textContent);
            if (newProfile){
                showSlideMessage("Updated profile!", "#24bd47");
            }
            else {
                showSlideMessage("Error updating profile", "red");
            }
            const userDetails = JSON.parse(newProfile);

            const profileName = document.querySelector('.profile-name');
            profileName.textContent = userDetails.username;
            const country = document.querySelector(".profile-country");
            country.textContent = 'Country: ' + userDetails.country;
            const bio = document.querySelector(".profile-bio");
            bio.textContent = 'Bio: ' + userDetails.bio;
            const category = document.querySelector(".profile-category");
            category.textContent = userDetails.topCategory + ' enthusiast';
            profileCard.style.backgroundColor = userDetails.cardColor;
            body.style.backgroundColor = userDetails.backgroundColor;

            emoji.style.cursor = "default";
             editForm.style.display = 'none';
            editForm.reset();
            cancelBtn.style.display = 'none';
        });
    }



});