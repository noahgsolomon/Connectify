document.addEventListener("DOMContentLoaded", function() {
    const emojiList = ['😀', '😁', '😂', '🤣', '😃', '😄',
        '😅', '😆', '😉', '😊', '😋','😎','😍',
        '😘', '🥰', '😗'];

    const searchContent = document.querySelector('.search-content');

    (async () => {
        const allUsers = await fetchUsers();
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
                        await userProfile(user);
                        const allDivs = searchContent.querySelectorAll('div');
                        for (const div of allDivs) {
                            searchContent.removeChild(div);
                        }
                        searchBar.value = '';
                    });
                }
            }
        });
    })();

    async function fetchUsers() {
        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const users = await response.text();
            console.log(users);
            return users;
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
            return responseBody;
        } catch (error){
            console.log(error);
        }
    }

    const userProfile = async (user) => {
        const profileJson = await profile(user);
        const userDetails = JSON.parse(profileJson);
        const profileCard = document.querySelector('.profile-card');
        const emojiFace = emojiList[Math.round(Math.random() * 15)];
        const body = document.querySelector('body');
        const sendMessageButton = document.querySelector('.send-message-btn');
        const messageField = document.querySelector('.message-bar');

        const emoji = document.querySelector('.profile-emoji');
        emoji.textContent = emojiFace;
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

        sendMessageButton.addEventListener('click', async() => {
            const messageStatus = document.querySelector('.message-status');
            const message = messageField.value;
            messageField.value = '';
            const messageResponse = await sendMessage(userDetails.username, message);
            if (messageResponse){
                messageStatus.textContent = 'sent message!';
            }
        });

        profileCard.style.display = 'block';
    };

});