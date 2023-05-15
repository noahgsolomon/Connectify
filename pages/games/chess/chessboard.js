import {getValidMoves as getKnightValidMoves} from "./pieces/knight.js";
import {getValidMoves as getBishopValidMoves} from "./pieces/bishop.js";
import {getValidMoves as getPawnValidMoves} from "./pieces/pawn.js";
import {getValidMoves as getQueenValidMoves} from "./pieces/queen.js";
import {getValidMoves as getRookValidMoves} from "./pieces/rook.js";
import {getValidMoves as getKingValidMoves} from "./pieces/king.js";
import {getChessSessionWithId, postMove} from "../../../util/api/gamesapi/chessapi.js";

let url = new URL(window.location.href);

let sessionId = url.searchParams.get("sessionId");
function chessboard(imgLocation = "", userColor){

    let chessBoard = document.querySelector('.chess-board');

    let isLight = true;

    for (let i = 1; i <= 64; i++) {
        let tile = document.createElement('div');

        tile.id = 'tile-' + i;

        tile.classList.add('tile');

        tile.dataset.color = isLight ? 'light' : 'dark';
        tile.dataset.num = i.toString();

        tile.style.backgroundColor = isLight ? '#DDB88C' : '#A66D4F';

        chessBoard.appendChild(tile);

        if (i % 8 !== 0) {
            isLight = !isLight;
        }
    }

    const pieces = [
        '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
    ];

    let selectedPiece = null;
    let selectedTile = null;
    let fromPos = null;
    let toPos = null;


    async function handleTileClick(event) {
        if (window.boardState.turn.toUpperCase() === userColor.toUpperCase()) {
            const currentBoard = getBoardState();
            const tile = event.currentTarget;
            const piece = tile.querySelector('.piece');
            if (piece && !selectedPiece) {
                if (piece.dataset.team.toUpperCase() !== window.boardState.turn) {
                    return;
                }
                tile.style.backgroundColor = 'rgb(211,110,108)';
                selectedPiece = tile.querySelector('.piece');
                selectedTile = tile;
                console.log(selectedPiece);
                console.log(selectedTile);
                fromPos = tile.dataset.num;
            } else {
                //if there is a piece selected, and the piece type can move to the tapped tile, and the tile is occupied by a different
                //colored piece or no piece
                if (selectedTile && (tile.dataset.team === '' || (tile.dataset.team !== selectedTile.dataset.team))
                    && canMove(selectedTile.dataset.num, tile.dataset.num, selectedPiece.dataset.type, currentBoard)) {
                    if (piece) {
                        piece.dataset.moved = 'true';
                    }

                    toPos = tile.dataset.num;
                    selectedTile.style.cursor = 'default';
                    tile.style.cursor = 'pointer';

                    tile.dataset.team = selectedTile.dataset.team;
                    if (selectedTile.dataset.color === 'light') {
                        selectedTile.style.backgroundColor = '#DDB892';
                    } else {
                        selectedTile.style.backgroundColor = 'rgb(166, 109, 79)';
                    }
                    if (sessionId) {
                        await postMove(sessionId, fromPos, toPos, selectedTile.dataset.piece.toUpperCase());
                        window.chessSession = await getChessSessionWithId(sessionId);
                    }
                    selectedTile = null;
                    selectedPiece = null;
                } else if (piece && selectedPiece && piece.dataset.team === selectedPiece.dataset.team && tile !== selectedTile) {
                    if (selectedTile.dataset.color === 'light') {
                        selectedTile.style.backgroundColor = '#DDB892';
                    } else {
                        selectedTile.style.backgroundColor = 'rgb(166, 109, 79)';
                    }
                    tile.style.backgroundColor = 'rgb(211,110,108)';
                    selectedTile = tile;
                    selectedPiece = piece;
                    fromPos = tile.dataset.num;
                }
                //if the same tile is clicked again
                else if (selectedTile === tile) {
                    if (tile.dataset.color === 'light') {
                        tile.style.backgroundColor = '#DDB892';
                    } else {
                        tile.style.backgroundColor = 'rgb(166, 109, 79)';
                    }
                    selectedTile = null;
                    selectedPiece = null;
                }
            }

        }
    }



    function getBoardState() {
        const newState = {};
        for (let i = 1; i <= 64; i++) {
            const tile = document.getElementById(`tile-${i}`);
            const piece = tile.querySelector('.piece');
            if (piece) {
                const pieceType = piece.dataset.type;
                const pieceColor = tile.dataset.team;
                const hasMoved = piece.dataset.moved;
                newState[i] = { type: pieceType, color: pieceColor, hasMoved: hasMoved };
            }
        }
        return newState;
    }

    function isKingInCheck(team, boardState) {
        const kingPosition = Object.keys(boardState).find(key => boardState[key] && boardState[key].type === 'king' && boardState[key].color === team);

        const opposingTeam = team.toUpperCase() === 'WHITE' ? 'BLACK' : 'WHITE';

        console.log(boardState);
        for (const tile in boardState) {
            let validMoves;
            if (boardState[tile] && boardState[tile].color.toUpperCase() === opposingTeam) {
                if (boardState[tile].type === 'knight'){
                    validMoves = getKnightValidMoves(tile, boardState);
                } else if (boardState[tile].type === 'bishop'){
                    validMoves = getBishopValidMoves(tile, boardState);
                }else if (boardState[tile].type === 'pawn'){
                    validMoves = getPawnValidMoves(tile, boardState);
                }else if (boardState[tile].type === 'queen'){
                    validMoves = getQueenValidMoves(tile, boardState);
                }else if (boardState[tile].type === 'pawn'){
                    validMoves = getPawnValidMoves(tile, boardState);
                }
                if (validMoves && validMoves.includes(Number(kingPosition))) {
                    return true;
                }
            }
        }
        return false;
    }

    function canCastle(fromTile, toTile, boardState) {
        const from = Number(fromTile);
        const to = Number(toTile);
        const king = boardState[from];
        console.log(king);

        if (king.hasMoved.toLowerCase() === 'true' || isKingInCheck(king.color, boardState)) {
            return false;
        }

        if (to === from + 2) {

            const rook = boardState[from + 3];
            if (rook && rook.type === 'rook' && rook.hasMoved.toLowerCase() === 'false') {
                if (!boardState[from + 1] && !boardState[from + 2]) {
                    for (let i = 0; i <= 2; i++) {
                        const intermediatePosition = from + i;
                        const intermediateBoardState = { ...boardState, [from]: null, [intermediatePosition]: king };
                        if (isKingInCheck(king.color, intermediateBoardState)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        }

        if (to === from - 2) {

            const rook = boardState[from - 4];
            if (rook && rook.type === 'rook' && rook.hasMoved.toLowerCase() === 'false') {
                if (!boardState[from - 1] && !boardState[from - 2] && !boardState[from - 3]) {
                    for (let i = 0; i >= -2; i--) {
                        const intermediatePosition = from + i;
                        if (isKingInCheck(king.color, { ...boardState, [from]: null, [intermediatePosition]: king})) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        }

        return false;
    }

    function canMove(fromTile, toTile, pieceType, boardState) {

        let hypotheticalBoardState = { ...boardState };
        hypotheticalBoardState[toTile] = hypotheticalBoardState[fromTile];
        hypotheticalBoardState[fromTile] = null;
        let team = document.getElementById('tile-' + fromTile).querySelector('.piece').dataset.team;
        if (isKingInCheck(team, hypotheticalBoardState)) {
            return false;
        }


        switch (pieceType) {
            case 'rook':
                const validRookMoves = getRookValidMoves(fromTile, boardState);
                return validRookMoves.includes(Number(toTile));

            case 'knight':
                const validKnightMoves = getKnightValidMoves(fromTile, boardState);
                return validKnightMoves.includes(Number(toTile));

            case 'bishop':
                const validBishopMoves = getBishopValidMoves(fromTile, boardState);
                return validBishopMoves.includes(Number(toTile));

            case 'queen':
                const validQueenMoves = getQueenValidMoves(fromTile, boardState);
                return validQueenMoves.includes(Number(toTile));

            case 'king':
                const validKingMoves = getKingValidMoves(fromTile, boardState);
                return validKingMoves.includes(Number(toTile)) || canCastle(fromTile, toTile, boardState);
            case 'pawn':
                const validPawnMoves = getPawnValidMoves(fromTile, boardState);
                return validPawnMoves.includes(Number(toTile));

            default:
                return false;
        }
    }


    let colorTeam = 'black';
    for (let i = 0; i < 64; i++) {
        if (i === 48){
            colorTeam = 'white'
        }
        let tile = document.getElementById('tile-' + (i + 1));
        if (pieces[i] !== '') {
            let piece = document.createElement('div');
            piece.dataset.moved = 'false';
            piece.classList.add('piece');
            piece.dataset.type = getPieceType(pieces[i]);
            tile.dataset.piece = getPieceType(pieces[i]);
            tile.style.cursor = 'pointer';
            let img = document.createElement('img');
            img.src = `${imgLocation}assets/${colorTeam}${piece.dataset.type}.png`;
            piece.dataset.team = getPieceTeam(pieces[i]);
            tile.dataset.team = piece.dataset.team;
            piece.appendChild(img);
            tile.appendChild(piece);
        }
        else {
            tile.dataset.team = '';
        }

        tile.addEventListener('click', handleTileClick);

    }

    function getPieceType(piece) {
        if (piece === '♜' || piece === '♖') {
            return 'rook';
        } else if (piece === '♞' || piece === '♘') {
            return 'knight';
        } else if (piece === '♝' || piece === '♗') {
            return 'bishop';
        } else if (piece === '♛' || piece === '♕') {
            return 'queen';
        } else if (piece === '♚' || piece === '♔') {
            return 'king';
        } else if (piece === '♟' || piece === '♙') {
            return 'pawn';
        }
    }

    function getPieceTeam(piece) {
        return (piece === '♔' || piece === '♕' || piece === '♖' ||
            piece === '♗' || piece === '♘' || piece === '♙') ?
            'white' : 'black';
    }
}

export {
    chessboard
}