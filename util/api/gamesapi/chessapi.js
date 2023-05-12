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
    console.log(responseBody);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseBody;
}

export {
    createSession,
    getChessSession
}