document.addEventListener("DOMContentLoaded", function() {

    async function getPosts() {
        const url = 'http://localhost:8080/feed';

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

    async function createPost(title, body){
        const model = {
            title: title,
            body: body
        }
        try {
            const response = await fetch('http://localhost:8080/create-post', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(model),
                credentials: "include"
            })
            const responseBody = await response.json();
            console.log(responseBody);
            if (response.ok) {
                return responseBody;
            } else {
                console.log('error');
                console.log(responseBody);
                return responseBody;
            }
        } catch (error) {
            console.error(error);
            return {
                status: "invalid",
                response: "server side problem occurred."
            }
        }
    }

    (async () => {
        const postListString = await getPosts();
        if (postListString) {
            const postList = JSON.parse(postListString);
            postList.reverse();

            const main = document.querySelector('.center-content');
            for (const post of postList) {
                const postElement = document.createElement('div');
                postElement.className = 'post';

                const titleElement = document.createElement('h2');
                titleElement.textContent = post.title;

                const contentElement = document.createElement('p');
                contentElement.textContent = post.body;

                const postMeta = document.createElement('div')
                postMeta.className = 'post-meta';

                const author = document.createElement('span');
                author.className = 'author';
                author.textContent = post.username;

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

                const postActions = document.createElement('div');
                postActions.className = 'post-actions';

                const likedBookmarked = await getLikeBookmark(post.id);

                const likeButton = document.createElement('button');
                likeButton.className = 'btn like-btn';
                if (!likedBookmarked.liked) {
                    likeButton.textContent = 'Like';
                } else {
                    likeButton.style.backgroundColor = '#d72f56';
                    likeButton.textContent = 'Liked';
                    likeButton.setAttribute('data-clicked', 'true');
                }


                likeButton.addEventListener('click', (event) => {
                    const buttonElement = event.currentTarget;
                    const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
                    if (!isClicked) {
                        buttonElement.style.backgroundColor = '#d72f56';
                        buttonElement.textContent = 'Liked';
                        buttonElement.setAttribute('data-clicked', 'true');
                    } else {
                        buttonElement.style.backgroundColor = '';
                        buttonElement.textContent = 'Like';
                        buttonElement.setAttribute('data-clicked', 'false');
                    }

                    let bookmarkStatus = false;
                    if (bookmarkButton.textContent === 'Bookmarked') {
                        bookmarkStatus = true;
                    }
                    let likeStatus = false;
                    if (likeButton.textContent === 'Liked') {
                        likeStatus = true;
                    }
                    addLikeBookmark(post.id, likeStatus, bookmarkStatus);
                });

                const bookmarkButton = document.createElement('button');
                bookmarkButton.className = 'btn bookmark-btn';
                if (!likedBookmarked.bookmark) {
                    bookmarkButton.textContent = 'Bookmark';
                } else {
                    bookmarkButton.style.backgroundColor = '#be773f';
                    bookmarkButton.textContent = 'Bookmarked';
                    bookmarkButton.setAttribute('data-clicked', 'true');
                }

                bookmarkButton.addEventListener('click', (event) => {
                    const buttonElement = event.currentTarget;
                    const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
                    if (!isClicked) {
                        buttonElement.style.backgroundColor = '#be773f';
                        buttonElement.textContent = 'Bookmarked';
                        buttonElement.setAttribute('data-clicked', 'true');
                    } else {
                        buttonElement.style.backgroundColor = '';
                        buttonElement.textContent = 'Bookmark';
                        buttonElement.setAttribute('data-clicked', 'false');
                    }
                    let bookmarkStatus = false;
                    if (bookmarkButton.textContent === 'Bookmarked') {
                        bookmarkStatus = true;
                    }
                    let likeStatus = false;
                    if (likeButton.textContent === 'Liked') {
                        likeStatus = true;
                    }
                    addLikeBookmark(post.id, likeStatus, bookmarkStatus);
                });

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
        }

    })();

    // Get the modal, add-post-btn and close elements
    const modal = document.getElementById("postModal");
    const addPostBtn = document.querySelector(".add-post-btn");
    const closeBtn = document.getElementsByClassName("close")[0];
    let charCount = document.getElementById("charCount");

// When the add-post-btn is clicked, open the modal
    addPostBtn.onclick = function () {
        modal.style.display = "block";
    };

// When the close button (x) is clicked, close the modal
    closeBtn.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

// Update the character count for the textarea
    document.getElementById("postBody").addEventListener("input", function () {
        charCount = document.getElementById("charCount");
        charCount.innerText = this.value.length;
    });

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


// Add an event listener to the postForm
    document.getElementById("postForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        charCount.innerText = '0';
        const postTitle = document.getElementById("postTitle").value;
        const postBody = document.getElementById("postBody").value;

        const title = postTitle.trim();
        const body = postBody.trim();

        const response = await createPost(title, body);

        if (title.length < 5 || title.length > 50) {
            showSlideMessage('Title must be between 5 and 50 characters.', 'red');
            return;
        }
        else if (body.length < 10 || body.length > 500) {
            showSlideMessage('Body must be between 10 and 500 characters.', 'red');
            return;
        }
        else if (response.status === 'invalid'){
            showSlideMessage(response.response, 'red');
        }
        else if(response.status === 'valid'){
            showSlideMessage(response.response, 'green')
        }


        // Close the modal and reset the form
        modal.style.display = "none";
        this.reset();

    });
});