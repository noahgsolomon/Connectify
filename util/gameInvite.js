function showGameInvite(game, inviter, duration = 6000) {
    const inviteOverlay = document.createElement('div');
    inviteOverlay.className = 'invite-message';
    inviteOverlay.id = 'inviteMessage';
    document.body.append(inviteOverlay);

    const inviteContent = document.createElement('div');
    inviteContent.className = 'invite-content';

    const gameHeader = document.createElement('h2');
    if (game === 'CHESS'){
        gameHeader.textContent = "👑 Chess 👑";
    }
    gameHeader.className = 'invite-game-header';

    const inviterContent = document.createElement('p');
    inviterContent.textContent = `${inviter} invited you to play!`;

    const acceptButton = document.createElement('button');
    acceptButton.textContent = '✅';
    acceptButton.className = 'invite-accept';
    acceptButton.addEventListener('click', () => {
        // handle game acceptance logic here
    });

    const declineButton = document.createElement('button');
    declineButton.textContent = '🚫';
    declineButton.className = 'invite-decline';
    declineButton.addEventListener('click', () => {
        inviteOverlay.remove();
    });

    inviteContent.append(gameHeader);
    inviteContent.append(inviterContent);
    inviteContent.append(acceptButton);
    inviteContent.append(declineButton);
    inviteOverlay.append(inviteContent);

    setTimeout(() => {
        inviteOverlay.remove();
    }, duration);
}

export {
    showGameInvite
}
