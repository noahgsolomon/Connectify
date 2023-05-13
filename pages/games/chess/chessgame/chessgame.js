import {chessboard} from "../chessboard.js";
import {profileColors, fetchUserProfile} from "../../../../util/api/userapi.js";
import {getChessSessionWithId} from "../../../../util/api/gamesapi/chessapi.js";

const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));
if (!jwtToken || expiryDate < new Date()){
    if (jwtToken){
        localStorage.removeItem('jwtToken');
    }
    localStorage.removeItem('expiry');
    localStorage.setItem('destination', '../games/chess/chess.html');
    window.location.href = "../../../login/login.html"
}

let url = new URL(window.location.href);

let sessionId = url.searchParams.get("sessionId");
localStorage.setItem('sessionId', sessionId);

const username = localStorage.getItem('username');
const opponent = localStorage.getItem('opponent');

window.boardState = {
    turn: 'WHITE'
};

window.addEventListener("load", function() {

    const page = document.querySelector('.page');
    page.classList.remove('hidden');


    const blackPlayerElement = document.querySelector('.top-player');
    const whitePlayerElement = document.querySelector('.bottom-player');

    (async () => {
        await profileColors();
        const profileBtn = document.querySelector('.profile-btn');
        const userEmoji = profileBtn.textContent;
        const opponentProfileString = await fetchUserProfile(opponent);
        const opponentProfile = JSON.parse(opponentProfileString);
        let chessSession = await getChessSessionWithId(sessionId);
        window.chessSession = chessSession;
        const whitePlayerSpan = document.createElement('span');
        whitePlayerSpan.textContent = chessSession.whitePlayer;
        const blackPlayerSpan = document.createElement('span');
        blackPlayerSpan.textContent = chessSession.blackPlayer;

        if (window.chessSession.whitePlayer === username){
            whitePlayerSpan.textContent = `${userEmoji} ${username}`;
            blackPlayerSpan.textContent = `${opponentProfile.profilePic} ${opponent}`
        }
        else {
            whitePlayerSpan.textContent = `${opponentProfile.profilePic} ${opponent}`;
            blackPlayerSpan.textContent = `${userEmoji} ${username}`
        }

        blackPlayerElement.append(blackPlayerSpan);
        whitePlayerElement.append(whitePlayerSpan);
        let userColor;
        if (window.chessSession.whitePlayer === username){
            chessboard('../', 'WHITE');
            localStorage.setItem('userColor', 'WHITE');
            userColor = localStorage.getItem('userColor')
        }
        else if (window.chessSession.blackPlayer === username) {
            chessboard('../', 'BLACK');
            localStorage.setItem('userColor', 'BLACK');
            userColor = localStorage.getItem('userColor')
        }
        let pastMove = null;
        let updatedChessSession = setInterval(async () => {
            console.log(pastMove);
            console.log(window.chessSession.turn.toUpperCase());
            console.log(userColor.toUpperCase());
            console.log(window.chessSession.recentMove.startPosition);
            if (window.chessSession.turn.toUpperCase() !== userColor.toUpperCase()) {
                console.log('hellooooo')
                window.chessSession = await getChessSessionWithId(sessionId);
                if (window.chessSession.recentMove.startPosition && (!pastMove || pastMove !== `${window.chessSession.recentMove.startPosition},${window.chessSession.recentMove.endPosition}`)) {
                    const fromTile = document.querySelector(`#tile-${window.chessSession.recentMove.startPosition}`);
                    const toTile = document.querySelector(`#tile-${window.chessSession.recentMove.endPosition}`);
                    console.log(fromTile);
                    console.log(toTile);
                    toTile.innerHTML = fromTile.innerHTML;
                    fromTile.dataset.team = '';
                    fromTile.dataset.piece = '';
                    fromTile.innerHTML = '';
                    if (window.boardState.turn === 'WHITE'){
                        window.boardState.turn = 'BLACK';
                    }
                    else {
                        window.boardState.turn = 'WHITE';
                    }
                    pastMove = `${window.chessSession.recentMove.startPosition},${window.chessSession.recentMove.endPosition}`;
                }
            }

        }, 2000);
    })();
});
