document.addEventListener("DOMContentLoaded", function() {
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
    const profile = async () => {
        try {
            const response = await fetch("http://localhost:8080/profile", {
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

    function showSlideMessage(message, color, duration = 2000) {
        const slideMessage = document.getElementById("slideMessage");
        slideMessage.innerHTML = message;
        slideMessage.classList.remove("hide");
        slideMessage.classList.add("show");
        slideMessage.style.backgroundColor = color;
        setTimeout(() => {
            slideMessage.classList.add("hide");
            setTimeout(() => {
                slideMessage.classList.remove("show");
                slideMessage.classList.add("hide");
            }, 300);
        }, duration);
    }

    async function getMyPosts() {
        const url = `http://localhost:8080/my-posts`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });
            const responseBody = await response.text();
            console.log(responseBody);
            if (response.ok) {
                return responseBody;
            } else {
                console.log('error');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function getPost(id){
        try {
            const response = await fetch(`http://localhost:8080/post/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });
            const responseBody = await response.text();
            console.log(responseBody);
            if (response.ok) {
                return responseBody;
            } else {
                console.log('error');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const updatePost = async (id, body, title) => {
        console.log(body);
        console.log(title)
        try{
            const model  = {
                body: body,
                title: title
            }
            const response = await fetch(`http://localhost:8080/post/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(model),
                credentials: "include"
            });

            const responseBody = await response.text();
            const responseJson = JSON.parse(responseBody);
            console.log(responseBody);

            if (response.ok){
                showSlideMessage("Updated post!", "green");
                return responseBody;
            }
            if (responseJson.status === 'invalid'){
                showSlideMessage("Inappropriate Content!", "red");
            }
        }
        catch (e) {
            console.log(e);
        }

    }

    const deletePost = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/post/${id}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: "include"
            });

            const responseBody = await response.text();
            if (response.ok){
                showSlideMessage("Post Deleted!", "green");
                return responseBody;
            }
            else{
                showSlideMessage("Error deleting post", "red");
            }
        }
        catch (error){
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
                showSlideMessage("Updated profile!", "green");
            }
            return responseBody;
        }catch (error){
            console.log(error);
        }
    }

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
                    postDelBtn.textContent = '🔥🗑️';

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
                            await updatePost(post.id, contentTextAreaElement.value, titleTextAreaElement.value);
                            console.log(contentTextAreaElement.value);
                            console.log(titleTextAreaElement.value);
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
                        // Display the custom popup
                        const confirmDeleteContainer = document.querySelector('.confirm-delete-container');
                        confirmDeleteContainer.style.display = 'flex';

                        // Handle the Cancel button click
                        const cancelBtn = document.querySelector('.confirm-delete-popup-buttons .cancel-popup-btn');
                        cancelBtn.addEventListener('click', () => {
                            // Hide the custom popup
                            confirmDeleteContainer.style.display = 'none';
                        });

                        // Handle the Delete button click
                        const deleteBtn = document.querySelector('.confirm-delete-popup-buttons .delete-btn');
                        deleteBtn.addEventListener('click', async () => {
                            await deletePost(post.id);
                            postElement.remove();
                            confirmDeleteContainer.style.display = 'none';
                        });
                    });

                    const formatDateAndTime = (dateString) => {
                        const dateObj = new Date(dateString);
                        const formattedDate = dateObj.toLocaleDateString();
                        const formattedTime = dateObj.toLocaleTimeString();
                        return `${formattedDate} ${formattedTime}`;
                    };

                    const date = document.createElement('span');
                    const formattedLastModifiedDate = formatDateAndTime(post.lastModifiedDate);
                    date.className = 'date';
                    date.textContent = 'Date: ' + formattedLastModifiedDate;

                    postMeta.append(author);
                    postMeta.append(date);


                    postActions.append(postDelBtn);
                    postActions.append(postEditBtn);

                    postElement.append(titleElement);
                    postElement.append(contentElement);
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
            console.log('cock')
            emoji.textContent = emojiList[Math.round(Math.random() * emojiList.length)];
        });

        // Add an event listener to handle form submission
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedCountry = countryInput.value.trim();
            const updatedBio = bioInput.value.trim();

            const newProfile = await updateProfile(updatedCountry, updatedBio, profileCard.style.backgroundColor, body.style.backgroundColor, emoji.textContent);
            const userDetails = JSON.parse(newProfile);
            console.log(userDetails);

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