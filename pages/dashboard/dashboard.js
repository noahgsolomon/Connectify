import {
    profileColors,
    friendsList,
    onlineHeartbeat
} from '../../util/api/userapi.js'
import {
    createPost,
    getPosts
} from "../../util/api/postapi.js";
import {getInbox, getMessageLog, sendMessage} from "../../util/api/inboxapi.js";
import {showSlideMessage} from "../../util/status.js";
import {postRender} from "../../util/postUtils.js";
import {notificationRender, applyTheme} from "../../util/userUtils.js";
import {deleteAllNotifications} from "../../util/api/notificationapi.js";
import {getChessInvites} from "../../util/api/gamesapi/inviteUtil.js";
localStorage.removeItem('sessionId');


const jwtToken = localStorage.getItem('jwtToken');
console.log(jwtToken);
let expiryDate = new Date(localStorage.getItem('expiry'));
if (!jwtToken || expiryDate < new Date()){
    if (jwtToken){
        localStorage.removeItem('jwtToken');
    }
    localStorage.removeItem('expiry');
    console.log();
    localStorage.setItem('destination', '../dashboard/dashboard.html');
    window.location.href = "../login/login.html"
}

window.addEventListener("load", function() {

    applyTheme();

    const main = document.querySelector('.center-content');
    console.log(localStorage.getItem('jwtToken'));
    const formatDateAndTime = (dateString) => {
        const dateObj = new Date(dateString);
        const now = new Date();
        const timeDifference = now - dateObj;
        const twentyFourHours = 24 * 60 * 60 * 1000;

        const formattedDate = dateObj.toLocaleDateString();
        const formattedTime = dateObj.toLocaleTimeString
        ([], { hour12: true, hour: '2-digit', minute: '2-digit' });

        if (timeDifference < twentyFourHours) {
            return `${formattedTime}`;
        } else {
            return `${formattedDate}`;
        }
    };

    const chessGameJoinBtn = document.querySelector('#chess-game .game-join-btn');
    chessGameJoinBtn.addEventListener('click', () => {
       window.location.href = '../games/chess/chess.html';
    });

    const notificationBtn = document.querySelector('.notification-btn');
    const notificationItems = document.querySelector('.notification-items');

    document.querySelector('.notification-btn').addEventListener('click', async () => {

        if (document.querySelector('.notification-panel').classList.contains('show')){
            if (notificationItems.innerHTML !== ''){
                await deleteAllNotifications();
                notificationBtn.classList.remove('has-notification');
            }
        }

        document.querySelector('.notification-panel').classList.toggle('show');

    });

    document.querySelector('.page').addEventListener('click', async (event) => {
        const notificationPanel = document.querySelector('.notification-panel');

        if (event.target !== notificationBtn) {
            if (notificationPanel.classList.contains('show')) {
                notificationPanel.classList.toggle('show');
                if (notificationItems.innerHTML !== ''){
                    await deleteAllNotifications();
                    notificationBtn.classList.remove('has-notification');
                }
            }
        }
    });


    (async () => {
        await onlineHeartbeat();
        await notificationRender();
        const friends = await friendsList();
        console.log(friends);
        const profileString = await profileColors();
        const inboxListString = await getInbox();
        const postListString = await getPosts();
        setInterval(notificationRender, 5000);
        setInterval(await onlineHeartbeat, 120000);

        await getChessInvites('../games/chess/chessgame/chessgame.html');

        if (postListString) {
            await postRender(postListString, profileString, main, 'dashboard');
        }

        const page = document.querySelector('.page');
        page.classList.remove('hidden');
        if (inboxListString){
            let updateInterval;
            const inboxList = JSON.parse(inboxListString);
            inboxList.sort((a, b) =>  new Date(b.timeSent) - new Date(a.timeSent));
            const inboxItems = document.querySelector(".inbox-items");
            for (const inbox of inboxList){
                const inboxElement = document.createElement("div");
                inboxElement.className = "inbox-item";

                if (inbox.unread){
                    inboxElement.className = 'inbox-item unread';
                }

                const user = document.createElement("div");
                user.className = 'inbox-user';
                user.textContent = inbox.user;

                let lastMessage = document.createElement("div");
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
                    let messageList = JSON.parse(messageListString);

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


                    async function updateMessageLog(user) {
                        const messageLogContent = document.querySelector('.message-log-content');
                        const messageListString = await getMessageLog(user);
                        const newMessageList = JSON.parse(messageListString);
                        let newMessages;

                        let lastMessageId = parseInt(messageList[messageList.length - 1].message_id);

                        newMessages = newMessageList.filter(newMessage => parseInt(newMessage.message_id) > lastMessageId);

                        // If there are new messages, update the UI and the current message list
                        if (newMessages.length > 0) {
                            for (let i = 0; i < newMessages.length; i++) {
                                const messageFormat = document.createElement("div");
                                if (newMessages[i].sender === user) {
                                    messageFormat.className = 'message received';
                                } else {
                                    messageFormat.className = 'message sent';
                                }

                                const messageContent = document.createElement("div");
                                messageContent.className = "message-content";
                                messageContent.textContent = newMessages[i].message;

                                const messageTime = document.createElement("span");
                                messageTime.className = 'message-time';
                                messageTime.textContent = formatDateAndTime(newMessages[i].timeSent);

                                messageContent.append(messageTime);
                                messageFormat.append(messageContent);
                                messageLogContent.append(messageFormat);
                                setTimeout(() => {
                                    messageLogContent.scrollTop = messageLogContent.scrollHeight;
                                }, 0);
                            }
                            inbox.last_message = newMessageList[newMessageList.length-1].message;
                            messageList = newMessageList;
                        }
                    }

                    updateInterval = setInterval(() => updateMessageLog(user), 1000);

                    setTimeout(() => {
                        messageLogContent.scrollTop = messageLogContent.scrollHeight;
                    }, 0);

                    function handleClick() {
                        const inputValue = inputField.value;
                        if (inputValue.trim() !== '') {
                            sendMessage(user, inputValue);
                            inputField.value = '';

                            const inboxIndex = inboxList.findIndex(item => item.user === user);
                            if (inboxIndex !== -1) {
                                console.log(inboxIndex);
                                inboxList[inboxIndex].last_message = inputValue;
                                inboxList[inboxIndex].timeSent = new Date();
                            }
                        }
                    }

                    async function closeMessageLog() {
                        clearInterval(updateInterval);
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

    const modal = document.getElementById("postModal");
    const addPostBtn = document.querySelector(".add-post-btn");
    let charCount = document.getElementById("charCount");


    addPostBtn.onclick = function () {
        modal.style.display = "block";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    document.getElementById("postBody").addEventListener("input", function () {
        charCount = document.getElementById("charCount");
        charCount.innerText = this.value.length;
    });


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
            showSlideMessage(response.response, '#24bd47');
            postButton.style.backgroundColor = 'green';
            postButton.value = '✅';
        }

        setTimeout(function() {
            postButton.style.backgroundColor = 'var(btn-color-light)';
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