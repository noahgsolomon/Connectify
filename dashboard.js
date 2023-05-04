document.addEventListener("DOMContentLoaded", function() {

    const main = document.querySelector('.center-content');

    const slideMessage = document.createElement('div');
    slideMessage.className = 'slide-message';
    slideMessage.id = 'slideMessage';
    main.append(slideMessage);

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
    const formatDateAndTime = (dateString) => {
        const dateObj = new Date(dateString);
        const now = new Date();
        const timeDifference = now - dateObj;
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        const formattedDate = dateObj.toLocaleDateString();
        const formattedTime = dateObj.toLocaleTimeString
        ([], { hour12: true, hour: '2-digit', minute: '2-digit' });

        if (timeDifference < twentyFourHours) {
            return `${formattedTime}`;
        } else {
            return `${formattedDate}`;
        }
    };
    async function getPosts() {
        const url = 'http://localhost:8080/posts';

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
        console.log(bookmarked);
        let model = {
            liked: liked,
            bookmark: bookmarked
        }
        const response = await fetch(`http://localhost:8080/posts/${postId}`, {
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
            });
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

    async function createComment(postID, content){
        try{
            const response = await fetch(`http://localhost:8080/comment/${postID}`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: content,
                credentials: "include"
            });

            const responseBody = await response.text();
            console.log(responseBody);
            if (response.ok){
                showSlideMessage("uploaded comment!", "green");
                return responseBody;
            }
            showSlideMessage("comment could not be posted", "red");
        }
        catch (e) {
            console.log(e);
        }
    }

    async function getPostComments(postID){
        try{
            const response = await fetch(`http://localhost:8080/comment/${postID}`, {
                method: 'GET',
                headers: {'Content-Type':'application/json'},
                credentials: "include"
            });
            const responseBody = await response.text();
            console.log(responseBody);
            if (response.ok){
                return responseBody;
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    async function getInbox(){
        try {
            const response = await fetch('http://localhost:8080/inbox', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
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

    async function getMessageLog(user) {
        try {
            const response = await fetch(`http://localhost:8080/inbox/${user}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });
            const responseBody = await response.text();
            console.log(responseBody);

            return responseBody;

        } catch (error){
            console.log(error);
            throw error;
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

    async function displayPosts(i, postList, profileString){

        const postWrapper = document.querySelector('.post-wrapper');

        const postElement = document.createElement('div');
        postElement.className = 'post';

        if (profileString){
            const profileDetails = JSON.parse(profileString);
            if (profileDetails.cardColor){
                postElement.style.backgroundColor = profileDetails.cardColor;
            }
        }

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

        const commentContainer = document.createElement("div");
        commentContainer.className = 'comment-container';

        const commentField = document.createElement("input");
        commentField.type = 'text';
        commentField.placeholder = 'Comment here...';
        commentField.className = 'comment-field';

        const commentButton = document.createElement("button");
        commentButton.className = 'comment-btn';
        commentButton.textContent = '💬';

        const uploadComment = async ()=> {
            if (commentField.value !== ''){
                await createComment(postList[i].id, commentField.value);
                commentField.value = '';

                if (seeComments.style.display === 'none'){
                    comments.innerHTML = '';
                    await postComments();
                }
            }

        }

        commentButton.addEventListener('click', uploadComment);
        commentField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter'){
                event.preventDefault();
                uploadComment();
            }
        });


        const seeComments = document.createElement("div");
        seeComments.className = 'see-comments-container';
        seeComments.textContent = 'see all comments...';

        const comments = document.createElement("div");
        comments.className = 'comments';


        const commentsString = await getPostComments(postList[i].id);
        console.log(commentsString)
        if (commentsString === '[]'){
            seeComments.style.display = 'none';
        }
        const postComments = async () => {
            seeComments.style.display = 'none';
            const updatedCommentsString = await getPostComments(postList[i].id);
            const commentsList = JSON.parse(updatedCommentsString);
            for (const comment of commentsList){
                console.log(comment.content);
                console.log(comment.user);
                const commentBox = document.createElement("div");
                commentBox.className = 'comment'

                const commentAuthor = document.createElement("span");
                commentAuthor.className = 'comment-author';
                commentAuthor.textContent = comment.user;

                const commentText = document.createElement("span");
                commentText.className = 'comment-text';
                commentText.textContent = comment.content;

                const commentTime = document.createElement('span');
                commentTime.className = 'comment-time';
                commentTime.textContent = formatDateAndTime(comment.date);

                const commentInfo = document.createElement("div");
                commentInfo.className = 'comment-info';

                commentBox.append(commentAuthor);
                commentBox.append(commentText);
                commentInfo.append(commentTime);
                commentBox.append(commentInfo);
                comments.append(commentBox);
            }
        }

        seeComments.addEventListener('click', postComments);

        commentContainer.append(commentField);
        commentContainer.append(commentButton);

        postMeta.append(author);
        postMeta.append(date);

        postActions.append(likeButton);
        postActions.append(bookmarkButton);

        postElement.append(titleElement);
        postElement.append(contentElement);
        postElement.append(postMeta);
        postElement.append(postActions);
        postElement.append(commentContainer);
        postElement.append(seeComments);
        postElement.append(comments);
        postWrapper.append(postElement);
    }

    (async () => {
        const profileString = await profile();
        if (profileString){
            const profileDetails = JSON.parse(profileString);
            if (profileDetails.backgroundColor){
                document.body.style.backgroundColor = profileDetails.backgroundColor;
            }
        }
        const postListString = await getPosts();
        const inboxListString = await getInbox();
        if (postListString) {
            const postList = JSON.parse(postListString);
            postList.reverse();

            const postWrapper = document.querySelector('.post-wrapper');
            const pageNumber = Math.ceil(postList.length / 10);
            let currentPage = 0;
            const count = 0;
            const end = Math.min(count + 10, postList.length);

            for (let i = currentPage*10; i < end; i++) {
                await displayPosts(i, postList, profileString);
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
                        postWrapper.innerHTML = '';
                        const start = currentPage * 10;
                        const end = Math.min(start + 10, postList.length);
                        for (let j = start; j < end; j++) {
                            await displayPosts(j, postList, profileString);
                        }
                    }
                });
            }
            if (postList.length > 10){
                main.append(pageNumberContainer)
            }
        }
        if (inboxListString){
            const inboxList = JSON.parse(inboxListString);
            inboxList.sort((a, b) =>  new Date(b.timeSent) - new Date(a.timeSent));
            console.log(inboxList);
            const inboxItems = document.querySelector(".inbox-items");
            for (const inbox of inboxList){
                const inboxElement = document.createElement("div");
                inboxElement.className = "inbox-item";

                if (inbox.unread){
                    console.log('hello')
                    inboxElement.className = 'inbox-item unread';
                }

                const user = document.createElement("div");
                user.className = 'inbox-user';
                user.textContent = inbox.user;

                const lastMessage = document.createElement("div");
                lastMessage.className = 'inbox-last-message';
                lastMessage.textContent = inbox.last_message;

                const timeSent = document.createElement("div");
                timeSent.className = 'inbox-timestamp';
                timeSent.textContent = formatDateAndTime(inbox.timeSent);

                const messageLog = document.querySelector('.message-log');
                const backBtn = document.querySelector('.back-btn');
                const messageLogContent = document.querySelector('.message-log-content');
                const messageLogInput = document.querySelector('.message-log-input');
                async function openMessageLog(event) {
                    document.body.classList.add('no-scroll');
                    inboxItems.innerHTML = '';
                    const sendButton = document.createElement('button');
                    sendButton.className = 'send-message-btn';
                    sendButton.textContent = 'Send';
                    const messageFieldInput = document.createElement('input');
                    messageFieldInput.type = 'text';
                    messageFieldInput.className = 'inbox-message-input';
                    messageFieldInput.placeholder = 'Type your message...';

                    messageLogInput.append(messageFieldInput);
                    messageLogInput.append(sendButton);

                    if (inbox.unread){
                        inboxElement.className = 'inbox-item';
                    }
                    const target = event.currentTarget;
                    const user = target.querySelector('.inbox-user').textContent;

                    const messageLogUsername = document.querySelector(".message-log-username");
                    messageLogUsername.textContent = user;

                    const messageListString = await getMessageLog(user);
                    const messageList = JSON.parse(messageListString);

                    for (let i = 0; i < messageList.length; i++) {
                        const messageFormat = document.createElement("div");
                        if (messageList[i].sender === user){
                            messageFormat.className = 'message received';
                        }
                        else {
                            messageFormat.className = 'message sent';
                        }

                        const messageContent = document.createElement("div");
                        messageContent.className = "message-content";
                        messageContent.textContent = messageList[i].message;

                        const messageTime = document.createElement("span");
                        messageTime.className = 'message-time';
                        messageTime.textContent = formatDateAndTime(messageList[i].timeSent);

                        messageContent.append(messageTime);
                        messageFormat.append(messageContent);
                        messageLogContent.append(messageFormat);
                    }

                    setTimeout(() => {
                        messageLogContent.scrollTop = messageLogContent.scrollHeight;
                    }, 0);

                    function handleClick() {
                        const inputValue = inputField.value;
                        if (inputValue.trim() !== '') {
                            sendMessage(user, inputValue);
                            const sentMessage = document.createElement("div");
                            sentMessage.className = 'message sent';

                            const messageContent = document.createElement("div");
                            messageContent.className = "message-content";
                            messageContent.textContent = inputValue;
                            console.log(inputValue);

                            const messageTime = document.createElement("span");
                            messageTime.className = 'message-time';
                            messageTime.textContent = formatDateAndTime(new Date());

                            messageContent.append(messageTime);
                            sentMessage.append(messageContent);
                            messageLogContent.append(sentMessage);
                            inputField.value = '';

                            setTimeout(() => {
                                messageLogContent.scrollTop = messageLogContent.scrollHeight;
                            }, 0);

                            const inboxIndex = inboxList.findIndex(item => item.user === user);
                            if (inboxIndex !== -1) {
                                console.log(inboxIndex);
                                inboxList[inboxIndex].last_message = inputValue;
                                inboxList[inboxIndex].timeSent = new Date();
                            }
                        }
                    }

                    async function closeMessageLog() {
                        document.body.classList.remove('no-scroll');
                        messageLogContent.innerHTML = '';
                        messageLogInput.innerHTML = '';
                        messageLog.style.display = 'none';

                        inboxItems.innerHTML = '';

                        inboxList.sort((a, b) =>  new Date(b.timeSent) - new Date(a.timeSent));

                        for (const inbox of inboxList) {
                            const inboxElement = document.createElement("div");
                            inboxElement.className = "inbox-item";

                            const user = document.createElement("div");
                            user.className = 'inbox-user';
                            user.textContent = inbox.user;

                            const lastMessage = document.createElement("div");
                            lastMessage.className = 'inbox-last-message';
                            lastMessage.textContent = inbox.last_message;

                            const timeSent = document.createElement("div");
                            timeSent.className = 'inbox-timestamp';
                            timeSent.textContent = formatDateAndTime(inbox.timeSent);

                            inboxElement.append(user);
                            inboxElement.append(lastMessage);
                            inboxElement.append(timeSent);
                            inboxItems.append(inboxElement);

                            inboxElement.addEventListener('click', openMessageLog);
                        }

                        sendButton.removeEventListener('click', handleClick);
                        inputField.removeEventListener('keydown', handleKeyDown);
                    }

                    backBtn.addEventListener('click', () => {
                        closeMessageLog();
                    });

                    const inputField = document.querySelector('.inbox-message-input');
                    sendButton.addEventListener('click', handleClick);
                    inputField.addEventListener('keydown', handleKeyDown);

                    function handleKeyDown(event) {
                        if (event.key === 'Enter') {
                            event.preventDefault(); // Prevent default behavior of submitting the form
                            handleClick(inbox);
                        }
                    }

                    messageLog.style.display = 'block';
                }


                inboxElement.append(user);
                inboxElement.append(lastMessage);
                inboxElement.append(timeSent);
                inboxItems.append(inboxElement);
                inboxElement.addEventListener('click', openMessageLog);
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
        const postButton = document.querySelector('#postForm .btn');
        const form = document.getElementById('postForm');

        const title = postTitle.trim();
        const body = postBody.trim();

        const response = await createPost(title, body);

        if (title.length < 5 || title.length > 50) {
            postButton.style.backgroundColor = 'red';
            postButton.value = '🔥';
            showSlideMessage('Title must be between 5 and 50 characters.', 'red');
        }
        else if (body.length < 10 || body.length > 500) {
            postButton.style.backgroundColor = 'red';
            postButton.value = '🔥';
            showSlideMessage('Body must be between 10 and 500 characters.', 'red');
        }


        else if (response.status === 'invalid'){
            showSlideMessage(response.response, 'red');
            postButton.style.backgroundColor = 'red';
            postButton.value = '🔥';
        }
        else if(response.status === 'valid'){
            showSlideMessage(response.response, 'green');
            postButton.style.backgroundColor = 'green';
            postButton.value = '✅';
        }

        setTimeout(function() {
            postButton.style.backgroundColor = '#1e90ff';
            postButton.value = '🚀';
        }, 2000);

        setTimeout(function () {
            modal.style.display = "none";
            form.reset();
        }, 1000);

    });

    const inboxPanel = document.querySelector(".inbox-panel");
    const inboxBtn = document.querySelector(".inbox-btn");
    const overlay = document.querySelector(".overlay");

    function addInboxPanel() {
        overlay.style.display = "block";
        inboxPanel.style.display = "block";
        document.body.classList.add('no-scroll');
    }
    function removeInboxPanel(){
        inboxPanel.style.display = "none";
        overlay.style.display = "none";
        document.body.classList.remove('no-scroll');
    }

    inboxBtn.addEventListener("click", addInboxPanel);
    overlay.addEventListener("click", removeInboxPanel);

    document.querySelector('.inbox-search').addEventListener('input', function (event) {
        const searchValue = event.target.value.trim().toLowerCase();
        const inboxItems = document.querySelectorAll('.inbox-item');

        if (searchValue === '') {
            // Display all inbox items when search input is empty
            inboxItems.forEach(item => item.style.display = 'flex');
            return;
        }

        // Show or hide inbox items based on the matching username
        inboxItems.forEach(item => {
            const username = item.querySelector('.inbox-user').textContent.trim().toLowerCase();

            if (username.includes(searchValue)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    document.querySelector('.post-search').addEventListener('input', function (event) {
        const searchValue = event.target.value.trim().toLowerCase();
        const posts = document.querySelectorAll('.post');

        if (searchValue === '') {
            // Display all inbox items when search input is empty
            posts.forEach(item => item.style.display = 'block');
            return;
        }

        // Show or hide inbox items based on the matching username
        posts.forEach(item => {
            const title = item.querySelector('h2').textContent.trim().toLowerCase();
            const body = item.querySelector('p').textContent.trim().toLowerCase();
            const username = item.querySelector('.author').textContent.trim().toLowerCase();
            const postContent = title + body + username;
            if (postContent.includes(searchValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });


});