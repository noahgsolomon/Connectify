import {login} from "../../util/api/userapi.js";
import {applyTheme} from "../../util/userUtils.jsx";


const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));

if (jwtToken && expiryDate > new Date()){
    window.location.href = '../dashboard/dashboard.html'
}

window.addEventListener("load", function() {

    applyTheme();

    const page = document.querySelector('.page');
    page.classList.remove('hidden');

    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        (async () => {
            await login(username, password).catch(error => console.error(error));
            if (localStorage.getItem('destination')){
                window.location.href = localStorage.getItem('destination');
            }
            else window.location.href = '../dashboard/dashboard.html';
        })();
    });
});


