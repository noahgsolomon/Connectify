async function signUp(username, email, password) {
    try{
        const model = {username, email, password};
        const response = await fetch('http://localhost:8080/sign-up', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: 'include'
        });
        const responseBody = await response.text();

        if (response.ok) {
            const signUpMessage = document.querySelector('.signup-msg');
            signUpMessage.innerHTML = 'Successfully created! Check email to activate account';
            signUpMessage.style.color = 'green';
            console.log(responseBody);
        }
        else {
            console.log(responseBody);
            const signUpMessage = document.querySelector('.signup-msg');
            signUpMessage.innerHTML = 'Credentials invalid';
            signUpMessage.style.color = 'red';
            setTimeout(() => {
                signUpMessage.textContent = '';
            }, 2000);
        }
    } catch (error) {
        console.error(error);
    }
}

async function login(username, password){
    try {
        const model = { username, password };
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: 'include'
        });
        const responseBody = await response.text();

        if (response.ok) {
            console.log(responseBody);
            console.log(responseBody);
            const loginMessage = document.querySelector('.login-msg');
            loginMessage.innerHTML = 'Successfully logged in!';
            loginMessage.style.color = 'green';
            setTimeout(() => {
                loginMessage.textContent = '';
            }, 2000);
            const sessionId = responseBody;
            console.log("Session ID:", sessionId);
            return sessionId;
        }
        else {
            console.log(responseBody);
            console.log(responseBody);
            const loginMessage = document.querySelector('.login-msg');
            loginMessage.innerHTML = 'User does not exist';
            loginMessage.style.color = 'red';
            setTimeout(() => {
                loginMessage.textContent = '';
            }, 2000);
        }
        return null;
    } catch (error) {
        console.error(error);
    }
}

async function profile()  {
    try {
        const response = await fetch("http://localhost:8080/profile", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            credentials: "include"
        });

        const responseBody = await response.text();
        console.log(responseBody);
        console.log(responseBody);
        if (response.ok) {
            return responseBody;
        }
    } catch (error) {
        console.log(error);
    }
}

const updateProfile = async (country, bio, cardColor, backgroundColor, profilePic) => {
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: "include"
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

async function fetchUsers() {
    try {
        const response = await fetch("http://localhost:8080/users", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const users = await response.text();
        console.log(users);
        if (response.ok){
        return users;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function fetchUserProfile(user){
    try {
        const response = await fetch(`http://localhost:8080/${user}`, {
            method: "GET",
            headers: {"Content-Type":"application/json"},
            credentials: "include"
        });

        const responseBody = await response.text();
        console.log(responseBody);
        console.log(responseBody);
        if (response.ok){
        return responseBody;
        }
    } catch (error){
        console.log(error);
    }
}

export {
    profile,
    login,
    updateProfile,
    fetchUsers,
    fetchUserProfile,
    signUp
};