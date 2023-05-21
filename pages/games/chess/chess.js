import {profileColors, friendsList, onlineHeartbeat} from "../../../util/api/userapi.js";
import {chessboard} from "./chessboard.js";
import { sendGameInvite } from "../../../util/api/gamesapi/inviteapi.js";
import {getChessSession} from "../../../util/api/gamesapi/chessapi.js";
import {getChessInvites} from "../../../util/api/gamesapi/inviteUtil.js";
import {applyTheme} from "../../../util/userUtils.js";


const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));
if (!jwtToken || expiryDate < new Date()){
    if (jwtToken){
        localStorage.removeItem('jwtToken');
    }
    localStorage.removeItem('expiry');
    console.log();
    localStorage.setItem('destination', '../games/chess/chess.html');
    window.location.href = "../../login/login.html"
}

window.addEventListener("load", function() {
    const page = document.querySelector('.page');
    page.classList.remove('hidden');

    chessboard();
    applyTheme();

    let friends;
    (async () => {
        await onlineHeartbeat();
        setInterval(await onlineHeartbeat, 120000);

        await getChessInvites('chessgame/chessgame.html', 2000);

        await profileColors();
        friends = await friendsList();
        const friendListElement = document.querySelector('.friends-list');
        for (const friend of friends){
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';

            const friendName = document.createElement('span');
            friendName.textContent = `${friend.profilePic} ${friend.username}`;

            const isOnline = (friend.online.toLowerCase() === 'true');

            if (isOnline) {
                const onlineIndicator = document.createElement('div');
                onlineIndicator.className = 'online-indicator';
                const blinkSpan = document.createElement('span');
                blinkSpan.className = 'blink';
                onlineIndicator.appendChild(blinkSpan);

                friendName.appendChild(onlineIndicator);
            }

            const inviteBtn = document.createElement('button');
            inviteBtn.className = 'invite-btn';
            inviteBtn.textContent = 'Invite';
            inviteBtn.dataset.opponent = friend.username;
            friendItem.append(friendName);
            friendItem.append(inviteBtn);
            friendListElement.append(friendItem);
            const inviteButton = friendItem.querySelector('.invite-btn');
            let session;

            inviteButton.addEventListener('click', async function(e) {
                const currentInviteButton = e.target;
                if (inviteButton.textContent === 'Invite'){
                    await sendGameInvite(currentInviteButton.dataset.opponent, 'CHESS');
                    currentInviteButton.textContent = '✅';
                    currentInviteButton.style.backgroundColor = 'green';
                    session = setInterval(async () =>{
                        const sessionDataString = await getChessSession(currentInviteButton.dataset.opponent);
                        let sessionData;
                        if (sessionDataString !== 'No game open between users yet'){
                            sessionData = JSON.parse(sessionDataString);
                        }
                        if (sessionData.gameStatus === 'IN_PROGRESS'){
                            localStorage.setItem('opponent', currentInviteButton.dataset.opponent);
                            window.location.href = `./chessgame/chessgame.html?sessionId=${sessionData.id}`;
                        }
                    }, 250);
                    setTimeout(() => {
                        clearInterval(session);
                        currentInviteButton.textContent = 'Invite';
                        currentInviteButton.style.backgroundColor = 'var(--light-tile)';
                    }, 16000);
                }
            });
        }
        if (friends.length === 0){
            const noFriends = document.createElement('span');
            noFriends.textContent = 'You have no friends😢'
            friendListElement.append(noFriends);
        }
        const searchInput = document.querySelector('.friends-search');
        const friendItems = Array.from(document.querySelectorAll('.friend-item'));

        searchInput.addEventListener('keydown', function(e) {
            const searchString = e.target.value.toLowerCase();

            friendItems.forEach(function(item) {
                const friendName = item.textContent.toLowerCase();

                if(friendName.includes(searchString)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    })();



});