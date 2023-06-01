import React, { useEffect, useState } from 'react';

type GameType = 'CHESS' | 'OTHER_GAME';
interface Props {
    game: GameType;
    inviter: string;
    onAccept: () => void;
    onDecline: () => void;
    duration?: number;
}

const GameInvite: React.FC<Props> = ({ game, inviter, onAccept, onDecline, duration = 6000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timeoutId);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="invite-message" id="inviteMessage">
            <div className="invite-content">
                <h2 className="invite-game-header">
                    {game === 'CHESS' ? '👑 Chess 👑' : 'Unknown Game'}
                </h2>
                <p>{`${inviter} invited you to play!`}</p>
                <button className="invite-accept" onClick={onAccept}>✅</button>
                <button className="invite-decline" onClick={onDecline}>🚫</button>
            </div>
        </div>
    );
};

export default GameInvite;