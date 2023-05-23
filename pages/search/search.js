import {
    fetchUsers,
    userProfile,
    profileColors, onlineHeartbeat
} from '../../util/api/userapi.js'
import {getChessInvites} from "../../util/api/gamesapi/inviteUtil.js";
import {applyTheme} from "../../util/userUtils.jsx";

const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));
if (!jwtToken || expiryDate < new Date()){
    if (jwtToken){
        localStorage.removeItem('jwtToken');
    }
    localStorage.removeItem('expiry');
    console.log();
    localStorage.setItem('destination', '../search/search.html');
    window.location.href = "../login/login.html"
}


window.addEventListener("load", function() {

    applyTheme();

    const searchContent = document.querySelector('.search-content');

    (async () => {
        await onlineHeartbeat();
        setInterval(await onlineHeartbeat, 120000);

        await getChessInvites('../games/chess/chessgame/chessgame.html');

        const allUsers = await fetchUsers();
        await profileColors();


        const loader = document.querySelector('.loader');
        loader.style.display = "none";
        const page = document.querySelector('.page');
        page.classList.remove('hidden');

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

                    for (const user of matchingUsers){
                        const userDiv = document.createElement('div');
                        userDiv.textContent = user;
                        userDiv.classList.add('search-result');
                        searchContent.append(userDiv);

                        userDiv.addEventListener('click', async () => {
                            document.querySelector('.container').style.display = 'none';
                            document.querySelector('.post-wrapper').style.display = 'none';
                            loader.style.display = "inline-block";



                            const postsContainer = document.querySelector('.posts');
                            const allPosts = postsContainer.querySelectorAll('.post');
                            for (const post of allPosts){
                                postsContainer.removeChild(post);
                            }

                            const allDivs = searchContent.querySelectorAll('div');

                            for (const div of allDivs) {
                                searchContent.removeChild(div);
                            }

                            const elementToRemove = document.querySelector('.page-number-container');
                            const messageUser = document.querySelector('.message-user');
                            if (messageUser){
                                messageUser.remove();
                            }
                            const followBtn = document.querySelector('.follow-btn');
                            if (followBtn){
                                followBtn.remove();
                            }

                            document.querySelector('.followers-following').innerHTML = '';

                            if (elementToRemove) {
                                elementToRemove.remove();
                            }

                            await userProfile(user);


                            searchBar.value = '';

                            document.querySelector('.container').style.display = 'flex';
                            document.querySelector('.post-wrapper').style.display = 'flex';
                            loader.style.display = "none";
                        });
                    }
                }
            });
        }
    })();

});