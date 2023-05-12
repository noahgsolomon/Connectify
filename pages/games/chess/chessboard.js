import {getValidMoves as getKnightValidMoves} from "./pieces/knight.js";
import {getValidMoves as getBishopValidMoves} from "./pieces/bishop.js";
import {getValidMoves as getPawnValidMoves} from "./pieces/pawn.js";
import {getValidMoves as getQueenValidMoves} from "./pieces/queen.js";
import {getValidMoves as getRookValidMoves} from "./pieces/rook.js";
import {getValidMoves as getKingValidMoves} from "./pieces/king.js";

function chessboard(imgLocation = ""){
    let boardState = {
        turn: 'white'
    }

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

    function handleTileClick(event) {
        const currentBoard = getBoardState();
        const tile = event.currentTarget;
        const piece = tile.querySelector('.piece');
        console.log(piece);
        if (piece && !selectedPiece) {
            if (piece.dataset.team !== boardState.turn){
                return;
            }
            console.log(tile.dataset.piece);
            tile.style.backgroundColor = 'rgb(211,110,108)';
            selectedPiece = tile.querySelector('.piece');
            selectedTile = tile;
        }
        else {
            //if there is a piece selected, and the piece type can move to the tapped tile, and the tile is occupied by a different
            //colored piece or no piece
            if (selectedTile && (tile.dataset.team === '' || (tile.dataset.team !== selectedTile.dataset.team))
                && canMove(selectedTile.dataset.num, tile.dataset.num, selectedPiece.dataset.type, currentBoard)){

                if (piece){
                    piece.dataset.moved ='true';
                }

                selectedTile.style.cursor = 'default';
                tile.style.cursor = 'pointer';

                tile.dataset.team = selectedTile.dataset.team;
                if (selectedTile.dataset.color === 'light'){
                    selectedTile.style.backgroundColor = '#DDB892';
                }
                else {
                    selectedTile.style.backgroundColor = 'rgb(166, 109, 79)';
                }

                boardState.turn = boardState.turn === 'white' ? 'black' : 'white';
                console.log(getBoardState().turn);
                selectedTile.dataset.team = '';
                selectedTile.dataset.piece = '';
                tile.innerHTML = selectedTile.innerHTML;
                selectedTile.innerHTML = '';
                selectedTile = null;
                selectedPiece = null;
            }
            else if (piece && selectedPiece && piece.dataset.team === selectedPiece.dataset.team && tile !== selectedTile){
                if (selectedTile.dataset.color === 'light'){
                    selectedTile.style.backgroundColor = '#DDB892';
                }
                else {
                    selectedTile.style.backgroundColor = 'rgb(166, 109, 79)';
                }
                tile.style.backgroundColor = 'rgb(211,110,108)';
                selectedTile = tile;
                selectedPiece = piece;
            }
            //if the same tile is clicked again
            else if (selectedTile === tile){
                console.log('elle')
                if (tile.dataset.color === 'light'){
                    tile.style.backgroundColor = '#DDB892';
                }
                else {
                    tile.style.backgroundColor = 'rgb(166, 109, 79)';
                }
                selectedTile = null;
                selectedPiece = null;
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
                const hasMoved = piece.dataset.hasMoved;
                newState[i] = { type: pieceType, color: pieceColor, hasMoved: hasMoved };
            }
        }
        console.log(newState);
        return newState;
    }

    function isKingInCheck(team, boardState) {
        const kingPosition = Object.keys(boardState).find(key => boardState[key].type === 'king' && boardState[key].color === team);
        console.log(kingPosition);
        const opposingTeam = team === 'white' ? 'black' : 'white';

        for (const tile in boardState) {
            let validMoves;
            if (boardState[tile].color === opposingTeam) {
                if (boardState[tile].type === 'knight'){
                    validMoves = getKnightValidMoves(tile, boardState[tile].type, boardState);
                } else if (boardState[tile].type === 'bishop'){
                    validMoves = getBishopValidMoves(tile, boardState[tile].type, boardState);
                }else if (boardState[tile].type === 'pawn'){
                    validMoves = getPawnValidMoves(tile, boardState[tile].type, boardState);
                }else if (boardState[tile].type === 'queen'){
                    validMoves = getQueenValidMoves(tile, boardState[tile].type, boardState);
                }else if (boardState[tile].type === 'pawn'){
                    validMoves = getPawnValidMoves(tile, boardState[tile].type, boardState);
                }
                if (validMoves.includes(Number(kingPosition))) {
                    return true;
                }
            }
        }
        return false;
    }

    function canMove(fromTile, toTile, pieceType, boardState) {
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
                return validKingMoves.includes(Number(toTile));

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