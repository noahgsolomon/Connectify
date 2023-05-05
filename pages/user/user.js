import {userProfile, profileColors} from "../../util/api/userapi.js";

document.addEventListener("DOMContentLoaded", function() {
    function getUsernameFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('username');

    }




    const username = getUsernameFromUrl();
    console.log(username);

    (async () => {
        await profileColors();
        await userProfile(username);
    })();
});