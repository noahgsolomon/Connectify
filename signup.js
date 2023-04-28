document.addEventListener("DOMContentLoaded", function() {
    const signUpForm = document.getElementById("signup-form");
    const url = 'http://localhost:8080/';

    signUpForm.addEventListener("submit", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the input values
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const signUp = async () => {
            try{
                const model = {username, email, password};
                const response = await fetch(url + 'sign-up', {
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
                    signUpForm.reset();
                }
                else {
                    console.log(responseBody);
                    const signUpMessage = document.querySelector('.signup-msg');
                    signUpMessage.innerHTML = 'Credentials invalid';
                    signUpMessage.style.color = 'red';
                    signUpForm.reset();
                }
            } catch (error) {
                console.error(error);
            }
        }
        (async () => {
            await signUp();
        })();
    });
});
