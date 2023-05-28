const jwtToken = localStorage.getItem('jwtToken');
const getPosts = async (page : number) => {

    try {
        const response = await fetch(`http://localhost:8080/posts?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const responseBody = await response.json();
        if (response.ok) {
            return responseBody;
        }
        console.log(response);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getPostsFilter = async (category : string, lastDays : number, user : string, page : number) => {

    const model = {
        category: category,
        lastDays: lastDays,
        user: user
    }

    try {
        const response = await fetch(`http://localhost:8080/posts-filter?page=${page}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(model)
        });
        const responseBody = await response.json();
        if (response.ok) {
            return responseBody;
        }
        console.log(response);
    } catch (error) {
        console.error(error);
        throw error;
    }

}

const getUserPosts = async (user : string, page : number) => {
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

const addLikeBookmark = async (postId : number, liked : boolean, bookmarked : boolean) => {
    let model = {
        liked: liked,
        bookmark: bookmarked
    }
    try {
        const response = await fetch(`http://localhost:8080/posts/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(model)
        });
        console.log(response.body);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getLikeBookmark = async (postId : number) => {
    const url = `http://localhost:8080/post-interactions/${postId}`;
    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`}
        });

        if (response.ok) {
            const data = await response.json();
            return {
                liked: data.liked,
                bookmarked: data.bookmark
            };
        }

    }catch (error) {
        console.error(error);
        throw error;
    }

}

const createPost = async (title : string, body : string) => {
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

const createComment = async (postId : number, content : string) => {
    try {
        const response = await fetch(`http://localhost:8080/comment/${postId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`},
            body: content
        });

        const responseBody = await response.json();
        if (response.ok) {
            return responseBody;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getPostComments = async (postId : number) => {
    try {
        const response = await fetch(`http://localhost:8080/comment/${postId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const responseBody = await response.json();
        if (response.ok) {
            return responseBody;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getMyPosts = async (page : number) => {
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

const getPost = async (id : number) => {
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

const updatePost = async (id : number, body : string, title : string) => {
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
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const deletePost = async (id : number) => {
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
        console.error(error);
        throw error;
    }
}

const getPostLikeCount = async (postId : number) => {
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
        console.error(error);
        throw error;
    }
}

export {
    deletePost,
    updatePost,
    getPost,
    getMyPosts,
    getPostComments,
    createComment,
    createPost,
    getLikeBookmark,
    addLikeBookmark,
    getUserPosts,
    getPosts,
    getPostLikeCount,
    getPostsFilter
};