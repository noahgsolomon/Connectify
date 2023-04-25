document.addEventListener("DOMContentLoaded", function() {
    const url = 'http://localhost:8080/';
    function getSessionIdFromCookie() {
        const name = 'session_id' + '=';
        console.log(document.cookie);
        const decodedCookie = decodeURIComponent(document.cookie);
        console.log(decodedCookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                const sessionId = cookie.substring(name.length, cookie.length);
                if (sessionId !== 'null') {
                    return sessionId;
                }
            }
        }
        console.log('test');
        return null;
    }
    const sessionId = getSessionIdFromCookie();
    console.log(sessionId);

    async function getPosts() {
        const url = 'http://localhost:8080/feed';

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

    async function addLike(postId, liked){
        const url = `http://localhost:8080/posts/${postId}`
        const bookmarked = await getLikeBookmark(postId, 'bookmarked') | false;
        console.log(bookmarked);
        let model = {
            liked: liked,
            bookmark: bookmarked
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model),
            credentials: 'include'
        });
        console.log(response.body);
    }
    async function addBookmark(postId, bookmarked){
        const url = `http://localhost:8080/posts/${postId}`
        const liked = await getLikeBookmark(postId, 'liked') | false;
        console.log(liked);
        let model = {
            liked: liked,
            bookmark: bookmarked
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model),
            credentials: 'include'
        });
        console.log(response.body);
    }
    async function getLikeBookmark(postId, type) {
        const url = `http://localhost:8080/post-interactions/${postId}`;
        const model = {
            type: type
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: type,
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json(); // Parse the JSON data
            console.log(data);
            return data.result; // Access the boolean value
        } else {
            console.error('Error fetching data:', response.statusText);
            throw EvalError
        }
    }


    (async () => {
       const postListString = await getPosts(sessionId);
       if (postListString){
           const postList = JSON.parse(postListString);
           const main = document.querySelector('.center-content');
           for (const post of postList){
               const postElement = document.createElement('div');
               postElement.className = 'post';

               const titleElement = document.createElement('h2');
               titleElement.textContent = post.title;

               const contentElement = document.createElement('p');
               contentElement.textContent = post.body;

               const postMeta = document.createElement('div')
               postMeta.className = 'post-meta';

               const author = document.createElement('span');
               author.className = 'author';
               author.textContent = post.username;

               const formatDateAndTime = (dateString) => {
                   const dateObj = new Date(dateString);
                   const formattedDate = dateObj.toLocaleDateString();
                   const formattedTime = dateObj.toLocaleTimeString();
                   return `${formattedDate} ${formattedTime}`;
               };

               const date = document.createElement('span');
               const formattedLastModifiedDate = formatDateAndTime(post.lastModifiedDate);
               date.className = 'date';
               date.textContent = 'Date: ' + formattedLastModifiedDate;

               const postActions = document.createElement('div');
               postActions.className = 'post-actions';

               const likeButton = document.createElement('button');
               likeButton.className = 'btn like-btn';
               likeButton.textContent = 'Like';


               likeButton.addEventListener('click', (event) => {
                   const buttonElement = event.currentTarget;
                   addLike(post.id, true);
                   const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
                   if (!isClicked) {
                       buttonElement.style.backgroundColor = '#d72f56';
                       buttonElement.textContent = 'Liked';
                       buttonElement.setAttribute('data-clicked', 'true');
                   } else {
                       buttonElement.style.backgroundColor = '';
                       buttonElement.textContent = 'Like';
                       buttonElement.setAttribute('data-clicked', 'false');
                   }
               });

               const bookmarkButton = document.createElement('button');
               bookmarkButton.className = 'btn bookmark-btn';
               bookmarkButton.textContent = 'Bookmark';

               bookmarkButton.addEventListener('click', (event) => {
                   const buttonElement = event.currentTarget;
                   addBookmark(post.id, true);
                   const isClicked = buttonElement.getAttribute('data-clicked') === 'true';
                   if (!isClicked) {
                       buttonElement.style.backgroundColor = '#be773f';
                       buttonElement.textContent = 'Bookmarked';
                       buttonElement.setAttribute('data-clicked', 'true');
                   } else {
                       buttonElement.style.backgroundColor = '';
                       buttonElement.textContent = 'Bookmark';
                       buttonElement.setAttribute('data-clicked', 'false');
                   }
               });

               postMeta.append(author);
               postMeta.append(date);

               postActions.append(likeButton);
               postActions.append(bookmarkButton);

               postElement.append(titleElement);
               postElement.append(contentElement);
               postElement.append(postMeta);
               postElement.append(postActions);

               main.append(postElement);
           }
       }

    })();

});