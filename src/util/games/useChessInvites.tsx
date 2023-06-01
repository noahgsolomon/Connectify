import { useEffect, useState } from 'react';
import showGameInvite from './ShowGameInvite.tsx';
import { deleteGameInvite, getGameInvites } from "./gameinviteapi.tsx";
import { createSession } from "./chessapi.tsx";

interface Invite {
    game: any;
    inviter: string;
}

const useChessInvites = (chesslocation: string, timeout: number = 7500) => {
    const [eventListenersAttached, setEventListenersAttached] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            let inviteList: Invite[] = [];
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

                    acceptBtn?.addEventListener('click', async () => {
                        await deleteGameInvite(inviteList[0].inviter);
                        const sessionId = await createSession(inviteList[0].inviter);
                        localStorage.setItem('opponent', inviteList[0].inviter);
                        window.location.href = `${chesslocation}?sessionId=${sessionId}`;
                    });

                    declineBtn?.addEventListener('click', async () => {
                        clearTimeout(timeoutId);
                        await deleteGameInvite(inviteList[0].inviter);
                    });

                    setEventListenersAttached(true);
                }
            }
            else{
                setEventListenersAttached(false);
            }
        }, timeout);

        return () => clearInterval(intervalId);
    }, [eventListenersAttached, chesslocation, timeout]);

    return eventListenersAttached;
}

export { useChessInvites }