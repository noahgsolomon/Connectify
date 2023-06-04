const jwtToken = localStorage.getItem('jwtToken');

async function createSession(opponent : string) {
    const response = await fetch('http://localhost:8080/chess/create-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
        body: opponent
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem('sessionId', data.id);
    return data.id;
}

async function getChessSession(opponent : string) {
    try{
        const response = await fetch(`http://localhost:8080/chess/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            },
            body: opponent
        });

        if (response.ok) {
            return await response.json();
        }

    } catch (e) {
        console.log(e);
    }
}

async function chessHeartbeat(sessionId: number) {
    try {

        const response = await fetch(`http://localhost:8080/chess/heart-beat/${sessionId}`, {
            method: 'POST',
            headers: {'Content-Type':'application/json',
                'Authorization': 'Bearer ' + jwtToken}
        });

        if (response.ok){
            return await response.text();
        }

    }catch (e) {
        console.log(e);
        throw e;
    }
}

async function getChessSessionWithId(sessionId: number) {
    const response = await fetch(`http://localhost:8080/chess/session/${sessionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        }
    });
    if (response.ok) {
        return await response.json();
    }

}

async function postMove(sessionId: number, fromPos: number, toPos: number, piece: string){
    const model = {
        piece: piece,
        startPosition: fromPos,
        endPosition: toPos
    }
    const response = await fetch(`http://localhost:8080/chess/post-move/${sessionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
        body: JSON.stringify(model)
    });

    const responseBody = await response.text();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseBody;
}

async function updateGameStatus(sessionId: number, gameStatus: string) {

    const response = await fetch(`http://localhost:8080/chess/game-status/${sessionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
        body: gameStatus
    });

    const responseBody = await response.text();
    console.log(responseBody);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseBody;
}

async function deleteChessSession(sessionId: number){
    const response = await fetch(`http://localhost:8080/chess/delete-session/${sessionId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        }
    });

    if (response.ok) {
        return await response.text();
    }
}

async function deleteUserChessSessions(user: string){
    const response = await fetch(`http://localhost:8080/chess/delete-user-sessions/${user}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        }
    });

    const responseBody = await response.text();

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseBody;
}


export {
    createSession,
    getChessSession,
    getChessSessionWithId,
    postMove,
    updateGameStatus,
    deleteChessSession,
    chessHeartbeat,
    deleteUserChessSessions
}