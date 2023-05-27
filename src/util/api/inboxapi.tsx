const jwtToken = localStorage.getItem('jwtToken');
const getInbox = async () => {
    try {
        const response = await fetch('http://localhost:8080/inbox', {
            method: 'GET',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.log('error');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getMessageLog = async (user : string) => {
    try {
        const response = await fetch(`http://localhost:8080/inbox/${user}`, {
            method: 'GET',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });

        if (response.ok){
            return await response.json();
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

const sendMessage = async (user : string, message : string) => {
    const model = {
        receiver: user,
        message: message
    }
    try {
        const response = await fetch("http://localhost:8080/inbox/send", {
            method: 'POST',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: JSON.stringify(model)
        });

        if (response.ok){
            return await response.json();
        }

    } catch (error) {
        console.error(error);
        throw error;
    }

}

export {sendMessage};
export {getMessageLog};
export {getInbox};