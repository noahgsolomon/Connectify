document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector('body');

    const searchContent = document.querySelector('.search-content');

    (async () => {
        const allUsers = await fetchUsers();
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

                            const postsContainer = document.querySelector('.posts');
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

    async function getPosts(user) {
        const url = `http://localhost:8080/posts/${user}`;

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

    async function addLikeBookmark(postId, liked, bookmarked) {
        const url = `http://localhost:8080/posts/${postId}`
        console.log(bookmarked);
        let model = {
            liked: liked,
            bookmark: bookmarked
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: 'include'
        });
        console.log(response.body);
    }

    async function getLikeBookmark(postId) {
        const url = `http://localhost:8080/post-interactions/${postId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json(); // Parse the JSON data
            console.log(data);
            return {
                liked: data.liked,
                bookmark: data.bookmark
            };
        } else {
            console.error('Error fetching data:', response.statusText);
            throw EvalError
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

    async function sendMessage(user, message){
        const model = {
            receiver: user,
            message: message
        }
        try{
            const response = await fetch("http://localhost:8080/inbox/send", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(model),
                credentials: 'include'
            });

            const responseBody = await response.text();
            console.log(responseBody);

            return responseBody;

        }catch(error){
            console.log(error);
        }

    }


    const profile = async (user) => {
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

    async function displayPosts(i, postList, postCardColor){

        const main = document.querySelector('.posts');
        const postElement = document.createElement('div');
        postElement.className = 'post';

        postElement.style.backgroundColor = postCardColor;

        const titleElement = document.createElement('h2');
        titleElement.textContent = postList[i].title;

        const contentElement = document.createElement('p');
        contentElement.textContent = postList[i].body;

        const postMeta = document.createElement('div')
        postMeta.className = 'post-meta';

        const author = document.createElement('span');
        author.className = 'author';
        author.textContent = postList[i].username;

        const formatDateAndTimePost = (dateString) => {
            const dateObj = new Date(dateString);
            const formattedDate = dateObj.toLocaleDateString();
            const formattedTime = dateObj.toLocaleTimeString();
            return `${formattedDate} ${formattedTime}`;
        };

        const date = document.createElement('span');
        const formattedLastModifiedDate = formatDateAndTimePost(postList[i].lastModifiedDate);
        date.className = 'date';
        date.textContent = formattedLastModifiedDate;

        const postActions = document.createElement('div');
        postActions.className = 'post-actions';

        const likedBookmarked = await getLikeBookmark(postList[i].id);

        const likeButton = document.createElement('button');
        likeButton.className = 'btn like-btn';
        if (!likedBookmarked.liked) {
            likeButton.textContent = '❤';
        } else {
            likeButton.style.backgroundColor = '#d72f56';
            likeButton.textContent = '💖';
            likeButton.setAttribute('data-clicked', 'true');
        }


        likeButton.addEventListener('click', (event) => {
            const buttonElement = event.currentTarget;
            const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
            if (!isClicked) {
                buttonElement.style.backgroundColor = '#d72f56';
                buttonElement.textContent = '💖';
                buttonElement.setAttribute('data-clicked', 'true');
            } else {
                buttonElement.style.backgroundColor = '';
                buttonElement.textContent = '❤';
                buttonElement.setAttribute('data-clicked', 'false');
            }

            let bookmarkStatus = false;
            if (bookmarkButton.textContent === '📚') {
                bookmarkStatus = true;
            }
            let likeStatus = false;
            if (likeButton.textContent === '💖') {
                likeStatus = true;
            }
            addLikeBookmark(postList[i].id, likeStatus, bookmarkStatus);
        });

        const bookmarkButton = document.createElement('button');
        bookmarkButton.className = 'btn bookmark-btn';
        if (!likedBookmarked.bookmark) {
            bookmarkButton.textContent = '💾';
        } else {
            bookmarkButton.style.backgroundColor = '#be773f';
            bookmarkButton.textContent = '📚';
            bookmarkButton.setAttribute('data-clicked', 'true');
        }

        bookmarkButton.addEventListener('click', (event) => {
            const buttonElement = event.currentTarget;
            const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
            if (!isClicked) {
                buttonElement.style.backgroundColor = '#be773f';
                buttonElement.textContent = '📚';
                buttonElement.setAttribute('data-clicked', 'true');
            } else {
                buttonElement.style.backgroundColor = '';
                buttonElement.textContent = '💾';
                buttonElement.setAttribute('data-clicked', 'false');
            }
            let bookmarkStatus = false;
            if (bookmarkButton.textContent === '📚') {
                bookmarkStatus = true;
            }
            let likeStatus = false;
            if (likeButton.textContent === '💖') {
                likeStatus = true;
            }
            addLikeBookmark(postList[i].id, likeStatus, bookmarkStatus);
        });

        const likeCount = document.createElement('div');
        likeCount.className = 'like-count';
        likeCount.textContent = '10 likes'
        //TODO add like count feature

        postMeta.append(author);
        postMeta.append(date);

        postActions.append(likeButton);
        postActions.append(bookmarkButton);

        postElement.append(titleElement);
        postElement.append(contentElement);
        postElement.append(postMeta);
        postElement.append(postActions);
        main.append(postElement);
    }


    const userProfile = async (user) => {
        const profileJson = await profile(user);
        if (profileJson){
            const userDetails = JSON.parse(profileJson);
            const profileCard = document.querySelector('.profile-card');
            const sendMessageButton = document.querySelector('.send-message-btn');
            const messageField = document.querySelector('.message-bar');

            const emoji = document.querySelector('.profile-emoji');
            emoji.textContent = userDetails.profilePic;
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

            const postListString = await getPosts(user);
            if (postListString) {
                const postList = JSON.parse(postListString);
                postList.reverse();
                const pageNumber = Math.ceil(postList.length / 10);
                let currentPage = 0;
                const count = 0;
                const end = Math.min(count + 10, postList.length);
                const main = document.querySelector('.posts');

                for (let i = currentPage * 10; i < end; i++) {
                    await displayPosts(i, postList, profileCard.style.backgroundColor);
                }
                const pageNumberContainer = document.createElement("div");
                pageNumberContainer.className = 'page-number-container';
                for (let i = 0; i < pageNumber; i++) {
                    const pageNumberDiv = document.createElement("div");
                    pageNumberDiv.className = `page-number page-${i}`;
                    pageNumberDiv.textContent = i.toString();
                    pageNumberContainer.appendChild(pageNumberDiv);
                    pageNumberDiv.addEventListener('click', async () => {
                        const clickedPage = parseInt(pageNumberDiv.textContent);
                        if (clickedPage !== currentPage){
                            currentPage = clickedPage;
                            main.innerHTML = '';
                            const start = currentPage * 10;
                            const end = Math.min(start + 10, postList.length);
                            for (let j = start; j < end; j++) {
                                await displayPosts(j, postList, profileCard.style.backgroundColor);
                            }
                        }
                    });
                }
                if (postList.length > 10){
                    body.append(pageNumberContainer);
                }
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