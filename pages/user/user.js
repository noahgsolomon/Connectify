import {userProfile, profileColors} from "../../util/api/userapi.js";


const jwtToken = localStorage.getItem('jwtToken');
if (!jwtToken){
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