import React from "react";

interface InviteModalProps {
    inviter: string;
    onAccept: () => void;
    onDecline: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ inviter, onAccept, onDecline }) => {
    let deleted = false;

    setTimeout(() => {
        if (!deleted){
            deleted = true;
            onDecline();
        }
    }, 5000);

    return (
        <>
            <div className={'overlay'}></div>
            <div className="invite-content">
                <h2 className="invite-game-header">👑 Chess 👑</h2>
                <p className={"invite-text"}>{inviter} invited you to play!</p>
                <div className={'invite-buttons'}>
                    <button className="invite-accept" onClick={onAccept}>✅</button>
                    <button className="invite-decline" onClick={() => {
                    if (!deleted) {
                        deleted = true;
                        onDecline();
                    }

                    }}>❌</button>
                </div>
            </div>
        </>
    );
};

export default InviteModal;