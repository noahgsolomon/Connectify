import {chessboard} from "../chessboard.js";
import {profileColors} from "../../../../util/api/userapi.js";

const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));
if (!jwtToken || expiryDate < new Date()){
    if (jwtToken){
        localStorage.removeItem('jwtToken');
    }
    localStorage.removeItem('expiry');
    console.log();
    localStorage.setItem('destination', '../games/chess/chess.html');
    window.location.href = "../../../login/login.html"
}

window.addEventListener("load", function() {

    let url = new URL(window.location.href);

    let sessionId = url.searchParams.get("sessionId");
    localStorage.setItem('sessionId', sessionId);

    const page = document.querySelector('.page');
    page.classList.remove('hidden');

    chessboard('../');


    (async () => {
        await profileColors();
    })();
});
