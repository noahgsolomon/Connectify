import {showGameInvite} from "../../gameInvite.js";
import {deleteGameInvite, getGameInvites} from "./inviteapi.js";
import {createSession} from "./chessapi.js";

async function getChessInvites(chesslocation, timeout=7500){
    let inviteList;
    let eventListenersAttached = false;

    setInterval(async () => {
        if (!document.querySelector('.invite-message')){
            inviteList = await getGameInvites();
        }

        if (inviteList && inviteList.length > 0) {
            if (!eventListenersAttached) {
                showGameInvite(inviteList[0].game, inviteList[0].inviter);
                console.log(inviteList[0].inviter);
                let timeoutId = setTimeout(async () => {
                    await deleteGameInvite(inviteList[0].inviter);
                }, 6000);

                const acceptBtn = document.querySelector('.invite-accept');
                const declineBtn = document.querySelector('.invite-decline');

                acceptBtn.addEventListener('click', async () => {
                    await deleteGameInvite(inviteList[0].inviter);
                    const sessionId = await createSession(inviteList[0].inviter);
                    localStorage.setItem('opponent', inviteList[0].inviter);
                    window.location.href = `${chesslocation}?sessionId=${sessionId}`;
                });

                declineBtn.addEventListener('click', async () => {
                    clearTimeout(timeoutId);
                    await deleteGameInvite(inviteList[0].inviter);
                });

                eventListenersAttached = true;
            }
        }
        else{
            eventListenersAttached = false;
        }
    }, timeout);
}

export {
    getChessInvites
}