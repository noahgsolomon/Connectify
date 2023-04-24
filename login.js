document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const url = 'http://localhost:8080/';

    loginForm.addEventListener("submit", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the input values
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const login = async () => {
            try {
                const model = { username, password };
                const response = await fetch(url + 'login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(model),
                });
                console.log(await response.text());

                if (response.ok) {
                    const loginMessage = document.querySelector('.login-msg');
                    loginMessage.innerHTML = 'Successfully logged in!';
                    loginMessage.style.color = 'green';
                    const cookies = response.headers.get('Set-Cookie');
                    if (cookies) {
                        console.log(cookies);
                        return getSessionIdFromCookie(cookies);
                    }
                }
                else {
                    const loginMessage = document.querySelector('.login-msg');
                    loginMessage.innerHTML = 'User does not exist';
                    loginMessage.style.color = 'red';
                }
                return null;
            } catch (error) {
                console.error(error);
            }
        };

        (async () => {
            const sessionId = await login().catch(error => console.error(error));

        })();


        // If you want to submit the form after processing the values, uncomment the line below
        // loginForm.submit();
    });
});


