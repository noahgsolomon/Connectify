import {
    profileColors
} from '../../util/api/userapi.js'
import {
    createPost,
    getPosts
} from "../../util/api/postapi.js";
import {getInbox, getMessageLog, sendMessage} from "../../util/api/inboxapi.js";
import {showSlideMessage} from "../../util/status.js";
import {postRender} from "../../util/postUtils.js";
import {notificationRender} from "../../util/userUtils.js";
const jwtToken = localStorage.getItem('jwtToken');
if (!jwtToken){
    window.location.href = "../login/login.html"
}
window.addEventListener("load", function() {
    const main = document.querySelector('.center-content');

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

    (async () => {
        const profileString = await profileColors();
        const inboxListString = await getInbox();
        const postListString = await getPosts();
        await notificationRender();
        if (postListString) {
            await postRender(postListString, profileString, main, 'dashboard');
        }

        const page = document.querySelector('.page');
        page.classList.remove('hidden');
        if (inboxListString){
            const inboxList = JSON.parse(inboxListString);
            inboxList.sort((a, b) =>  new Date(b.timeSent) - new Date(a.timeSent));
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
                            event.preventDefault();
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
            inboxItems.forEach(item => item.style.display = 'flex');
            return;
        }

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
            posts.forEach(item => item.style.display = 'block');
            return;
        }

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