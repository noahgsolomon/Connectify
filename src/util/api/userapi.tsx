

const jwtToken = localStorage.getItem('jwtToken');

async function signUp(username: string, email: string, password: string) {
    try {
        const model = { username, email, password };
        const response = await fetch('http://localhost:8080/sign-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        });

        const responseBody = await response.text();

        if (response.ok) {
            return {
                message: 'Successfully created! Check email to activate account',
                color: 'var(--slide-message-bg)',
                duration: 7500
            };
        } else {
            return {
                message: responseBody,
                color: 'var(--error-color)',
            };
        }
    } catch (error) {
        console.error(error);
        return {
            message: 'Something went wrong!',
            color: 'var(--error-color)',
        };
    }
}

async function login(username : string, password : string){
    try {
        const model = { username, password };
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: 'include'
        });
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.ok) {
            return {
                ...responseBody,
                status: 'ok',
                message: 'Successfully logged in!',
                color: 'var(--slide-message-bg)',
            };
        }
        return {
            status: 'bad',
            message: 'unable to verify credentials',
            color: 'var(--error-color)'

        };
    } catch (error) {
        console.log(error);
        return {
            message: 'Invalid username or password.',
            color: 'var(--error-color)',
        };
    }
}
async function profile()  {
    try {

        const response = await fetch("http://localhost:8080/profile", {
            method: "GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });


        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateProfile(country : string, bio : string, cardColor : string, backgroundColor : string, profilePic : string){
    const model = {
        country: country,
        bio: bio,
        cardColor: cardColor,
        backgroundColor: backgroundColor,
        profilePic: profilePic
    }
    try{
        const response = await fetch("http://localhost:8080/profile", {
            method: "PUT",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: JSON.stringify(model)
        });

        const responseBody = await response.text();
        if (response.ok){
            return responseBody;
        }
    }catch (error){
        console.log(error);
        throw error;
    }
}

async function updateProfileSettings(firstName: string, lastName: string, email: string, profilePic: string){
    const model = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePic: profilePic
    }
    try{
        const response = await fetch("http://localhost:8080/profile-settings", {
            method: "PUT",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: JSON.stringify(model)
        });

        return await response.json();
    }catch (error){
        console.log(error);
        throw error;
    }
}

const sendEmailChangeVerification = async (email: string) => {

    try{

        const response = await fetch("http://localhost:8080/profile-settings/email", {
            method: 'PUT',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: email
        });

        return response.json();

    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function fetchUsers() {
    try {
        const response = await fetch("http://localhost:8080/users", {
            method: "GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });

        const users = await response.text();
        if (response.ok){
            return users;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function fetchUserProfile(user : string) {
    try {
        const response = await fetch(`http://localhost:8080/${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function followEvent(user : string){
    try{
        const response = await fetch(`http://localhost:8080/${user}/follow`, {
            method: 'POST',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });
        const responseBody = await response.text();
        console.log(responseBody);
    }catch (e) {
        console.log(e);
    }
}

async function unfollowEvent(user : string){
    try{
        const response = await fetch(`http://localhost:8080/${user}/unfollow`, {
            method: 'POST',
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });
        const responseBody = await response.text();
        console.log(responseBody);
    }catch (e) {
        console.log(e);
    }
}


async function friendsList(){
    try{
        const response = await fetch('http://localhost:8080/friends', {
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

type Theme = 'light' | 'dark';

async function updateTheme(theme : Theme){
    try{
        const response = await fetch("http://localhost:8080/update-theme", {
            method: "PUT",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`},
            body: theme
        });

        const responseBody = await response.text();
        console.log(responseBody);
        if (response.ok){
            return responseBody;
        }
    }catch (error){
        console.log(error);
    }
}

async function getTheme() {
    try{
        const response = await fetch("http://localhost:8080/theme", {
            method: "GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`}
        });

        if (response.ok){
            return await response.text();
        }
    }catch (e) {
     console.log(e);
     throw e;
    }
}

async function onlineHeartbeat() {
    try{
        const response = await fetch("http://localhost:8080/online", {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken}
        });

        await response;

    }catch (e) {
        console.log(e);
    }
}

export {
    profile,
    login,
    updateProfile,
    updateProfileSettings,
    sendEmailChangeVerification,
    fetchUsers,
    fetchUserProfile,
    signUp,
    friendsList,
    updateTheme,
    getTheme,
    onlineHeartbeat,
    followEvent,
    unfollowEvent
};