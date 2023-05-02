document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the input values
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const login = async () => {
            try {
                const model = { username, password };
                const response = await fetch('https://connectifymedia.herokuapp.com/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(model),
                    credentials: 'same-origin'
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
        };

        function setCookie(name, value, days, sameSite = 'Lax') {
            let expires = '';
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }
            document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=' + sameSite + '; Secure; HttpOnly';
        }

        (async () => {
            const sessionId = await login().catch(error => console.error(error));
            if (sessionId) {
                console.log(sessionId);
                setCookie('JSESSIONID', sessionId, 7); // Store the session ID in a cookie for 7 days
                // Redirect the user to the dashboard page
                window.location.href = 'dashboard.html';
            }
        })();
    });
});


