const jwtToken = localStorage.getItem('jwtToken');
async function getGameInvites(){
    try{
        const response = await fetch(`http://localhost:8080/game-invites`, {
            method: 'GET',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });
        const responseBody = await response.text();
        if (response.ok){
            return JSON.parse(responseBody);
        }
    }catch (e) {
        console.log(e);
    }
}

async function sendGameInvite(userInvited: string, game: string){
    const model = {
        invited: userInvited,
        game: game
    }
    try{
        const response = await fetch(`http://localhost:8080/send-invite`, {
            method: 'POST',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: JSON.stringify(model)
        });
        const responseBody = await response.text();
        if (response.ok){
            return JSON.parse(responseBody);
        }
    }catch (e) {
        console.log(e);
    }
}

async function deleteGameInvite(inviter: string){
    try{
        const response = await fetch(`http://localhost:8080/delete-invite`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: inviter
        });
        const responseBody = await response.text();
        if (response.ok){
            return responseBody;
        }
    }catch (e) {
        console.log(e);
    }
}

export {
    getGameInvites,
    sendGameInvite,
    deleteGameInvite
}