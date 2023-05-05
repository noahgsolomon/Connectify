async function getInbox() {
    try {
        const response = await fetch('http://localhost:8080/inbox', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: "include"
        });

        const responseBody = await response.text();
        console.log(responseBody);
        if (response.ok) {
            return responseBody;
        } else {
            console.log('error');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getMessageLog(user) {
    try {
        const response = await fetch(`http://localhost:8080/inbox/${user}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });
        const responseBody = await response.text();
        console.log(responseBody);

        return responseBody;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function sendMessage(user, message) {
    const model = {
        receiver: user,
        message: message
    }
    try {
        const response = await fetch("http://localhost:8080/inbox/send", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: 'include'
        });

        const responseBody = await response.text();
        console.log(responseBody);

        return responseBody;

    } catch (error) {
        console.log(error);
    }

}

export {sendMessage};
export {getMessageLog};
export {getInbox};