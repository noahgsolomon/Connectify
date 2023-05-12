import {userProfile, profileColors} from "../../util/api/userapi.js";


const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));
if (!jwtToken || expiryDate < new Date()){
    if (jwtToken){
        localStorage.removeItem('jwtToken');
    }
    localStorage.removeItem('expiry');
    console.log();
    localStorage.setItem('destination', '../user/user.html');
    window.location.href = "../login/login.html"
}
window.addEventListener("load", function() {

    function getUsernameFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('username');

    }




    const username = getUsernameFromUrl();

    (async () => {
        await profileColors();
        await userProfile(username);
        const page = document.querySelector('.page');
        page.classList.remove('hidden');
    })();
});