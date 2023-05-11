export function getValidMoves(fromTile, boardState) {
    const currentTile = Number(fromTile);
    const kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
    const possibleMoves = [];

    for (let move of kingMoves) {
        const newTile = currentTile + move;

        // Check if newTile is valid and not occupied by a friendly piece
        if (newTile >= 1 && newTile <= 64 && !isOffBoard(currentTile, newTile) && !isFriendlyPiece(fromTile, newTile, boardState)) {
            possibleMoves.push(newTile);
        }
    }

    console.log(possibleMoves);
    return possibleMoves;
}

function isOffBoard(fromTile, toTile) {
    const fromColumn = (fromTile - 1) % 8;
    const toColumn = (toTile - 1) % 8;
    return Math.abs(fromColumn - toColumn) > 1;
}

function isFriendlyPiece(fromTile, toTile, boardState) {
    const piece = boardState[toTile];
    const currentColor = boardState[fromTile].color;
    if (piece) {
        return piece.color === currentColor;
    }
    return false;
}