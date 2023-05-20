import {userProfile, profileColors, onlineHeartbeat} from "../../util/api/userapi.js";
import {getChessInvites} from "../../util/api/gamesapi/inviteUtil.js";
import {applyTheme} from "../../util/userUtils.js";


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

    applyTheme();

    function getUsernameFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('username');

    }


    const username = getUsernameFromUrl();

    (async () => {
        await onlineHeartbeat();
        setInterval(await onlineHeartbeat, 120000);

        await getChessInvites('../games/chess/chessgame/chessgame.html');

        await profileColors();
        await userProfile(username);
        const page = document.querySelector('.page');
        page.classList.remove('hidden');
    })();
});