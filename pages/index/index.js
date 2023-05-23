import {applyTheme} from "../../util/userUtils.jsx";
import {onlineHeartbeat} from "../../util/api/userapi.js";

const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));

if (jwtToken && expiryDate > new Date()){
    window.location.href = '../dashboard/dashboard.html'
}

window.addEventListener("load", function(){

    applyTheme();

    const page = document.querySelector('.page');
    page.classList.remove('hidden');

    (async () => {
        await onlineHeartbeat();
        setInterval(await onlineHeartbeat, 120000);
    })();
});