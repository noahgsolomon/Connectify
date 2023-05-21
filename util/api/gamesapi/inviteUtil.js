import {showGameInvite} from "../../gameInvite.js";
import {deleteGameInvite, getGameInvites} from "./inviteapi.js";
import {createSession} from "./chessapi.js";

async function getChessInvites(chesslocation, timeout=7500){
    setInterval(async () => {
        const inviteList = await getGameInvites();
        console.log(inviteList);
        if (inviteList.length > 0) {
            showGameInvite(inviteList[0].game, inviteList[0].inviter);
            console.log(inviteList[0].inviter);
            let timeoutId = setTimeout(async () => {
                await deleteGameInvite(inviteList[0].inviter);
            }, 6000);

            document.querySelector('.invite-accept').addEventListener('click', async () => {
                await deleteGameInvite(inviteList[0].inviter);
                const sessionId = await createSession(inviteList[0].inviter);
                localStorage.setItem('opponent', inviteList[0].inviter);
                window.location.href = `${chesslocation}?sessionId=${sessionId}`;
            });
            document.querySelector('.invite-decline').addEventListener('click', async () => {
                clearTimeout(timeoutId);
                await deleteGameInvite(inviteList[0].inviter);
            });

        }
    }, timeout);
}

export {
    getChessInvites
}