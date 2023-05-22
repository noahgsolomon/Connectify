const jwtToken = localStorage.getItem('jwtToken');
async function getPosts(page) {

    const url = `http://localhost:8080/posts?page=${page}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
    });
        const responseBody = await response.text();
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

async function getUserPosts(user, page) {
    const url = `http://localhost:8080/posts/${user}?page=${page}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const responseBody = await response.text();
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
    let model = {
        liked: liked,
        bookmark: bookmarked
    }
    const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`},
        body: JSON.stringify(model)
    });
    console.log(response.body);
}

async function getLikeBookmark(postId) {
    const url = `http://localhost:8080/post-interactions/${postId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`}
    });

    if (response.ok) {
        const data = await response.json();
        return {
            liked: data.liked,
            bookmark: data.bookmark
        };
    } else {
        console.error('Error fetching data:', response.statusText);
        throw EvalError
    }
}

async function createPost(title, body) {
    const model = {
        title: title,
        body: body
    }
    try {
        const response = await fetch('http://localhost:8080/create-post', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`},
            body: JSON.stringify(model)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return {
            status: "invalid",
            response: "server side problem occurred."
        }
    }
}

async function createComment(postID, content) {
    try {
        const response = await fetch(`http://localhost:8080/comment/${postID}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`},
            body: content
        });

        const responseBody = await response.text();
        if (response.ok) {
            return responseBody;
        }
    } catch (e) {
        console.log(e);
    }
}

async function getPostComments(postID) {
    try {
        const response = await fetch(`http://localhost:8080/comment/${postID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const responseBody = await response.text();
        if (response.ok) {
            return responseBody;
        }
    } catch (e) {
        console.log(e)
    }
}

async function getMyPosts(page) {
    const url = `http://localhost:8080/my-posts?page=${page}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const responseBody = await response.text();
        if (response.ok) {
            return responseBody;
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getPost(id) {
    try {
        const response = await fetch(`http://localhost:8080/post/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const responseBody = await response.text();
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
    try {
        const model = {
            body: body,
            title: title
        }
        const response = await fetch(`http://localhost:8080/post/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(model)
        });

        const responseBody = await response.text();
        const responseJson = JSON.parse(responseBody);
        if (response.ok) {
            return responseBody;
        }
        if (responseJson.status === 'invalid') {
        }
    } catch (e) {
        console.log(e);
    }

}
const deletePost = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/post/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        const responseBody = await response.text();
        if (response.ok) {
            return responseBody;
        }
    } catch (error) {
        console.log(error);
    }
}

async function getPostLikeCount(postId) {
    try {
        const response = await fetch(`http://localhost:8080/likes/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        });

        const responseBody = await response.text();
        if (response.ok) {
            return responseBody;
        }
    } catch (error) {
        console.log(error);
    }
}

export {deletePost};
export {updatePost};
export {getPost};
export {getMyPosts};
export {getPostComments};
export {createComment};
export {createPost};
export {getLikeBookmark};
export {addLikeBookmark};
export {getUserPosts};
export {getPosts};
export {getPostLikeCount};