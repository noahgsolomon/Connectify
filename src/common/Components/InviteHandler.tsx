import {deleteGameInvite} from "../../util/games/gameinviteapi.tsx";
import {createSession} from "../../util/games/chessapi.tsx";
import React from "react";
import InviteModal from "./Game/InviteModal.tsx";

const InviteHandler: React.FC<{invite: {inviter: string}, setInvite: Function}> = ({invite, setInvite}) => {

    return (
        <>
            {(invite && invite.inviter !== '') && <InviteModal
                inviter={invite.inviter}
                onAccept={async () => {
                    const session = await createSession(invite.inviter);
                    if (session){
                        window.location.href = '/chess-live/' + session;
                        await deleteGameInvite(invite.inviter);
                        setInvite({inviter: ''})
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