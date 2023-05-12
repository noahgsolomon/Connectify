const jwtToken = localStorage.getItem('jwtToken');
async function getNotifications() {
    try {
        const response = await fetch('http://localhost:8080/notifications', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        });
        const responseBody = await response.text();
        if (response.ok) {
            return JSON.parse(responseBody);
        }
    } catch (e) {
        console.log(e);
    }
}

async function deleteAllNotifications() {
    try {
        const response = await fetch('http://localhost:8080/delete-notifications', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        });
        const responseBody = await response.text();
        if (response.ok) {
            return responseBody;
        }
    } catch (e) {
        console.log(e);
    }
}

export {
    getNotifications,
    deleteAllNotifications,
};