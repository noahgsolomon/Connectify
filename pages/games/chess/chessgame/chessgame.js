import {chessboard} from "../chessboard.js";
import {profileColors, fetchUserProfile} from "../../../../util/api/userapi.js";
import {getChessSessionWithId, deleteChessSession, updateGameStatus} from "../../../../util/api/gamesapi/chessapi.js";

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



    const opponentPlayer = document.querySelector('.top-player');
    const userPlayer = document.querySelector('.bottom-player');

    (async () => {

        const resignBtn = document.querySelector('.resign-btn');
        const resignConfirmationModal = document.getElementById('resignConfirmationModal');
        const confirmResignBtn = document.getElementById('confirmResign');
        const cancelResignBtn = document.getElementById('cancelResign');
        const closeResignModalBtn = document.querySelector('#resignConfirmationModal .close');

        resignBtn.addEventListener('click', () => {
            resignConfirmationModal.style.display = 'flex';
        });

        confirmResignBtn.addEventListener('click', async () => {
            resignConfirmationModal.style.display = 'none';
            let modal = document.getElementById("gameResultModal");
            let span = document.getElementsByClassName("close")[0];
            let gameResultText = document.getElementById("gameResultText");

            span.onclick = function() {
                modal.style.display = "none";
            }

                if (userColor.toUpperCase() === 'WHITE'){
                    gameResultText.innerText = '🏳️Black won by resignation🏳️';
                    await updateGameStatus(sessionId, 'BLACK_WON_BY_RESIGNATION');
                }
                else if (userColor.toUpperCase() === 'BLACK'){
                    gameResultText.innerText = '🏳️White won by resignation🏳️';
                    await updateGameStatus(sessionId, 'WHITE_WON_BY_RESIGNATION');
                }

            modal.style.display = "flex";


            setTimeout(function() {
                resignConfirmationModal.style.display = 'none';
                window.location.href = "../chess.html";
            }, 2000);

        });

        cancelResignBtn.addEventListener('click', () => {
            resignConfirmationModal.style.display = 'none';
        });

        closeResignModalBtn.addEventListener('click', () => {
            resignConfirmationModal.style.display = 'none';
        });

        setInterval(async () => {

            await fetch(`http://localhost:8080/chess/heart-beat/${sessionId}`, {
                method: 'POST',
                headers: {'Content-Type':'application/json',
                    'Authorization': 'Bearer ' + jwtToken}
            });

        }, 60000);

        await profileColors();
        const profileBtn = document.querySelector('.profile-btn');
        const userEmoji = profileBtn.textContent;
        const opponentProfileString = await fetchUserProfile(opponent);
        const opponentProfile = JSON.parse(opponentProfileString);
        let chessSession;
        try{
            chessSession = await getChessSessionWithId(sessionId);
        } catch (e){
            window.location.href = '../chess.html';
        }

        window.chessSession = chessSession;
        const userPlayerSpan = document.createElement('span');
        const opponentPlayerSpan = document.createElement('span');

        userPlayerSpan.textContent = `${userEmoji} ${username}`;
        opponentPlayerSpan.textContent = `${opponentProfile.profilePic} ${opponent}`;

        opponentPlayer.append(opponentPlayerSpan);
        userPlayer.append(userPlayerSpan);

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
        let prevFromTile = null;
        let prevToTile = null;
        window.updatedChessSession = setInterval(async () => {
            if (window.chessSession.turn.toUpperCase() !== userColor.toUpperCase()) {
                try{
                    window.chessSession = await getChessSessionWithId(sessionId);
                }catch (e){
                    window.location.href = '../chess.html';
                }
                if (window.chessSession.gameStatus !== 'IN_PROGRESS') {
                    let modal = document.getElementById("gameResultModal");
                    let span = document.getElementsByClassName("close")[0];
                    let gameResultText = document.getElementById("gameResultText");

                    if (window.chessSession.gameStatus === 'WHITE_WON'){
                        gameResultText.innerText = '👑White won by checkmate!👑';
                    }
                    else if (window.chessSession.gameStatus === 'BLACK_WON'){
                        gameResultText.innerText = '👑Black won by checkmate!👑';
                    }
                    else if (window.chessSession.gameStatus === 'WHITE_WON_BY_RESIGNATION'){
                        gameResultText.innerText = '🏳️White won by resignation🏳️';
                    }
                    else if (window.chessSession.gameStatus === 'BLACK_WON_BY_RESIGNATION'){
                        gameResultText.innerText = '🏳️Black won by resignation🏳️';
                    }

                    span.onclick = function() {
                        modal.style.display = "none";
                    }


                    modal.style.display = "flex";
                    setTimeout(async function() {
                        try {
                            await deleteChessSession(sessionId);
                        } catch (e){
                            console.log('session already deleted');
                        }
                        clearInterval(updatedChessSession);
                        window.location.href = "../chess.html";
                    }, 2000);
                }

                let updatedAt = new Date(window.chessSession.updatedAt);
                let now = new Date();
                let differenceInMilliseconds = now - updatedAt;
                let differenceInMinutes = differenceInMilliseconds / (1000 * 60);

                if (differenceInMinutes > 2) {
                    let modal = document.getElementById("gameResultModal");
                    let span = document.getElementsByClassName("close")[0];
                    let gameResultText = document.getElementById("gameResultText");
                    span.onclick = function() {
                        modal.style.display = "none";
                    }

                    gameResultText.innerText = '⏳Game closed due to inactivity⏳';
                    modal.style.display = "flex";

                    setTimeout(async function() {
                        try {
                            await deleteChessSession(sessionId);
                        } catch (e){
                            console.log('session already deleted');
                        }
                        clearInterval(updatedChessSession);
                        window.location.href = "../chess.html";
                    }, 2000);
                }
                else if (window.chessSession.recentMove.startPosition && (!pastMove || pastMove !== `${window.chessSession.recentMove.startPosition},${window.chessSession.recentMove.endPosition}`)) {
                    const fromTile = document.querySelector(`#tile-${window.chessSession.recentMove.startPosition}`);
                    const toTile = document.querySelector(`#tile-${window.chessSession.recentMove.endPosition}`);

                    if (fromTile.dataset.team.toUpperCase() === 'WHITE'){
                        if (parseInt(toTile.dataset.num) <= 8){
                            fromTile.dataset.piece = 'queen';
                            fromTile.querySelector('.piece').dataset.type = 'queen';
                            fromTile.querySelector('img').src = '../assets/whitequeen.png';
                        }
                    }
                    else if (fromTile.dataset.team.toUpperCase() === 'BLACK'){
                        if (parseInt(toTile.dataset.num) >= 57){
                            fromTile.dataset.piece = 'queen';
                            fromTile.querySelector('.piece').dataset.type = 'queen';
                            fromTile.querySelector('img').src = '../assets/blackqueen.png';
                        }
                    }

                    if (prevFromTile && prevToTile){
                        if (prevFromTile.dataset.color === 'light'){
                            prevFromTile.style.backgroundColor = '#DDB892';
                        }
                        else if (prevFromTile.dataset.color === 'dark'){
                            prevFromTile.style.backgroundColor = 'rgb(166, 109, 79)';
                        }

                        if (prevToTile.dataset.color === 'light'){
                            prevToTile.style.backgroundColor = '#DDB892';
                        }
                        else if (prevToTile.dataset.color === 'dark'){
                            prevToTile.style.backgroundColor = 'rgb(166, 109, 79)';
                        }
                    }
                    fromTile.style.backgroundColor = 'rgba(255,255,0,0.5)';
                    toTile.style.backgroundColor = 'rgb(255,255,0)';

                    toTile.innerHTML = fromTile.innerHTML;
                    toTile.dataset.team = fromTile.dataset.team;
                    toTile.dataset.piece = fromTile.dataset.piece;
                    toTile.style.cursor = 'pointer';
                    toTile.querySelector('.piece').dataset.moved = 'true';
                    fromTile.dataset.team = '';
                    fromTile.style.cursor = 'default';
                    fromTile.dataset.piece = '';
                    fromTile.innerHTML = '';
                    prevFromTile = fromTile;
                    prevToTile = toTile;
                    if (toTile.dataset.piece === 'king'){
                        if (parseInt(window.chessSession.recentMove.endPosition) - parseInt(window.chessSession.recentMove.startPosition) === 2){
                            const rookFromTile = document.querySelector(`#tile-${parseInt(window.chessSession.recentMove.startPosition)+3}`);
                            const rookToTile = document.querySelector(`#tile-${parseInt(window.chessSession.recentMove.startPosition)+1}`);
                            rookToTile.innerHTML = rookFromTile.innerHTML;
                            rookToTile.dataset.team = rookFromTile.dataset.team;
                            rookToTile.style.cursor = 'pointer';
                            rookToTile.querySelector('.piece').dataset.moved = 'true';
                            rookToTile.dataset.piece = 'rook';
                            rookFromTile.dataset.team = '';
                            rookFromTile.style.cursor = 'default';
                            rookFromTile.dataset.piece = '';
                            rookFromTile.innerHTML = '';
                        }
                        else if (parseInt(window.chessSession.recentMove.endPosition) - parseInt(window.chessSession.recentMove.startPosition) === -2){
                            const rookFromTile = document.querySelector(`#tile-${parseInt(window.chessSession.recentMove.startPosition)-4}`);
                            const rookToTile = document.querySelector(`#tile-${parseInt(window.chessSession.recentMove.startPosition)-1}`);
                            rookToTile.innerHTML = rookFromTile.innerHTML;
                            rookToTile.dataset.team = rookFromTile.dataset.team;
                            rookToTile.style.cursor = 'pointer';
                            rookToTile.querySelector('.piece').dataset.moved = 'true';
                            rookToTile.dataset.piece = 'rook';
                            rookFromTile.dataset.team = '';
                            rookFromTile.style.cursor = 'default';
                            rookFromTile.dataset.piece = '';
                            rookFromTile.innerHTML = '';
                        }
                    }
                    if (window.boardState.turn === 'WHITE'){
                        window.boardState.turn = 'BLACK';
                    }
                    else {
                        window.boardState.turn = 'WHITE';
                    }
                    pastMove = `${window.chessSession.recentMove.startPosition},${window.chessSession.recentMove.endPosition}`;
                }
            }
            else {
                let chessSession;
                try {
                    chessSession = await getChessSessionWithId(sessionId);
                } catch (e) {
                    window.location.href = '../chess.html';
                }
                if (chessSession.gameStatus !== 'IN_PROGRESS'){
                    let modal = document.getElementById("gameResultModal");
                    let span = document.getElementsByClassName("close")[0];
                    let gameResultText = document.getElementById("gameResultText");

                    if (chessSession.gameStatus === 'WHITE_WON_BY_RESIGNATION'){
                        gameResultText.innerText = '🏳️White won by resignation🏳️';
                    }
                    else if (chessSession.gameStatus === 'BLACK_WON_BY_RESIGNATION'){
                        gameResultText.innerText = '🏳️Black won by resignation🏳️';
                    }

                    span.onclick = function () {
                        modal.style.display = "none";
                    }

                    modal.style.display = "flex";

                    setTimeout(async function () {
                        try {
                            await deleteChessSession(sessionId);
                        } catch (e){
                            console.log('session already deleted');
                        }
                        clearInterval(updatedChessSession);
                        window.location.href = "../chess.html";
                    }, 2000);
                }



                let updatedAt = new Date(chessSession.updatedAt);
                let now = new Date();
                let differenceInMilliseconds = now - updatedAt;
                let differenceInMinutes = differenceInMilliseconds / (1000 * 60);

                if (differenceInMinutes > 2) {
                    let modal = document.getElementById("gameResultModal");
                    let span = document.getElementsByClassName("close")[0];
                    let gameResultText = document.getElementById("gameResultText");
                    span.onclick = function () {
                        modal.style.display = "none";
                    }

                    gameResultText.innerText = '⏳Game closed due to inactivity⏳';
                    modal.style.display = "flex";

                    setTimeout(async function () {
                        try {
                            await deleteChessSession(sessionId);
                        } catch (e){
                            console.log('session already deleted');
                        }
                        clearInterval(updatedChessSession);
                        window.location.href = "../chess.html";
                    }, 2000);
                }
            }

        }, 500);
    })();
});
