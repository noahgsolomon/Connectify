import {deleteGameInvite} from "../../util/games/gameinviteapi.tsx";
import {createSession, deleteUserChessSessions} from "../../util/games/chessapi.tsx";
import React from "react";
import InviteModal from "./Game/InviteModal.tsx";

const InviteHandler: React.FC<{invite: {inviter: string}, setInvite: Function}> = ({invite, setInvite}) => {
    return (
        <>
            {(invite && invite.inviter !== '') && <InviteModal
                inviter={invite.inviter}
                onAccept={async () => {

                    await deleteUserChessSessions(localStorage.getItem('username') || '');
                    await deleteUserChessSessions(invite.inviter);

                    const session = await createSession(invite.inviter);
                    if (session){
                        await deleteGameInvite(invite.inviter);
                        setInvite({inviter: ''});
                        localStorage.setItem('opponent', invite.inviter);
                        window.location.href = '/chess-live/' + session;

                    }
                }}
                onDecline={async () => {
                    console.log('deleted');
                    await deleteGameInvite(invite.inviter);
                    setInvite({inviter: ''});
                }}
            />}
        </>
    );
}

export default InviteHandler;