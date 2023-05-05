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

async function getPosts() {
    const url = 'http://localhost:8080/posts';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
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

async function getUserPosts(user) {
    const url = `http://localhost:8080/posts/${user}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
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

async function addLikeBookmark(postId, liked, bookmarked) {
    console.log(bookmarked);
    let model = {
        liked: liked,
        bookmark: bookmarked
    }
    const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(model),
        credentials: 'include'
    });
    console.log(response.body);
}

async function getLikeBookmark(postId) {
    const url = `http://localhost:8080/post-interactions/${postId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    });

    if (response.ok) {
        const data = await response.json(); // Parse the JSON data
        console.log(data);
        return {
            liked: data.liked,
            bookmark: data.bookmark
        };
    } else {
        console.error('Error fetching data:', response.statusText);
        throw EvalError
    }
}

async function createPost(title, body){
    const model = {
        title: title,
        body: body
    }
    try {
        const response = await fetch('http://localhost:8080/create-post', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: "include"
        });
        const responseBody = await response.json();
        console.log(responseBody);
        if (response.ok) {
            return responseBody;
        } else {
            console.log('error');
            console.log(responseBody);
            return responseBody;
        }
    } catch (error) {
        console.error(error);
        return {
            status: "invalid",
            response: "server side problem occurred."
        }
    }
}

async function createComment(postID, content){
    try{
        const response = await fetch(`http://localhost:8080/comment/${postID}`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: content,
            credentials: "include"
        });

        const responseBody = await response.text();
        console.log(responseBody);
        if (response.ok){
            return responseBody;
        }
    }
    catch (e) {
        console.log(e);
    }
}

async function getPostComments(postID){
    try{
        const response = await fetch(`http://localhost:8080/comment/${postID}`, {
            method: 'GET',
            headers: {'Content-Type':'application/json'},
            credentials: "include"
        });
        const responseBody = await response.text();
        console.log(responseBody);
        if (response.ok){
            return responseBody;
        }
    }
    catch (e) {
        console.log(e)
    }
}

async function getInbox(){
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

    } catch (error){
        console.log(error);
        throw error;
    }
}

async function sendMessage(user, message){
    const model = {
        receiver: user,
        message: message
    }
    try{
        const response = await fetch("http://localhost:8080/inbox/send", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: 'include'
        });

        const responseBody = await response.text();
        console.log(responseBody);

        return responseBody;

    }catch(error){
        console.log(error);
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

async function getMyPosts() {
    const url = `http://localhost:8080/my-posts`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
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

async function getPost(id){
    try {
        const response = await fetch(`http://localhost:8080/post/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
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

const updatePost = async (id, body, title) => {
    console.log(body);
    console.log(title)
    try{
        const model  = {
            body: body,
            title: title
        }
        const response = await fetch(`http://localhost:8080/post/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(model),
            credentials: "include"
        });

        const responseBody = await response.text();
        const responseJson = JSON.parse(responseBody);
        console.log(responseBody);

        if (response.ok){
            return responseBody;
        }
        if (responseJson.status === 'invalid'){}
    }
    catch (e) {
        console.log(e);
    }

}

const deletePost = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/post/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            credentials: "include"
        });

        const responseBody = await response.text();
        if (response.ok){
            return responseBody;
        }
    }
    catch (error){
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

export { profile, getPosts, addLikeBookmark, getLikeBookmark,
    createPost, createComment, getPostComments, getInbox,
    getMessageLog, sendMessage, login, getMyPosts, getPost,
    updatePost, deletePost, updateProfile, fetchUsers,
    fetchUserProfile, signUp, getUserPosts};