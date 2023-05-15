const jwtToken = localStorage.getItem('jwtToken');

async function createSession(opponent) {
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

async function getChessSession(opponent) {
    const response = await fetch(`http://localhost:8080/chess/session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
        body: opponent
    });
    const responseBody = await response.text();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseBody;
}

async function getChessSessionWithId(sessionId) {
    const response = await fetch(`http://localhost:8080/chess/session/${sessionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        }
    });
    const responseBody = await response.text();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return JSON.parse(responseBody);
}

async function postMove(sessionId, fromPos, toPos, piece){
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

async function updateGameStatus(sessionId, gameStatus) {
    console.log(sessionId);
    console.log(gameStatus);

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

export {
    createSession,
    getChessSession,
    getChessSessionWithId,
    postMove,
    updateGameStatus
}