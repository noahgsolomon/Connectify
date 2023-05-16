import {profileColors, friendsList} from "../../../util/api/userapi.js";
import {chessboard} from "./chessboard.js";
import { sendGameInvite } from "../../../util/api/gamesapi/inviteapi.js";
import {getChessSession} from "../../../util/api/gamesapi/chessapi.js";
import {getChessInvites} from "../../../util/api/gamesapi/inviteUtil.js";


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

    let friends;
    (async () => {

        await getChessInvites('chessgame/chessgame.html');

        await profileColors();
        friends = await friendsList();
        const friendListElement = document.querySelector('.friends-list');
        for (const friend of friends){
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            const friendName = document.createElement('span');
            friendName.textContent = `${friend.profilePic} ${friend.username}`;
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
                    }, 2000);
                    setTimeout(() => {
                        clearInterval(session);
                        currentInviteButton.textContent = 'Invite';
                        currentInviteButton.style.backgroundColor = '#8B4513';
                    }, 16000);
                }
            });
        }
        if (friends.length === 0){
            const noFriends = document.createElement('span');
            noFriends.textContent = 'You have no friends😢'
            friendListElement.append(noFriends);
        }
    })();



});