import {profileColors, friendsList} from "../../../util/api/userapi.js";
import {chessboard} from "./chessboard.js";
import { sendGameInvite } from "../../../util/api/gamesapi/inviteapi.js";
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

            inviteButton.addEventListener('click', async function(e) {
                const currentInviteButton = e.target;
                if (inviteButton.textContent === 'Invite'){
                    await sendGameInvite(currentInviteButton.dataset.opponent, 'CHESS');
                    currentInviteButton.textContent = '✅';
                    currentInviteButton.style.backgroundColor = 'green';
                    setTimeout(() => {
                        currentInviteButton.textContent = 'Invite';
                        currentInviteButton.style.backgroundColor = '#8B4513';
                    }, 16000);
                }
            });
        }
    })();



});