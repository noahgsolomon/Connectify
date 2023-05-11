export function getValidMoves(fromTile, boardState) {
    const currentTile = Number(fromTile);
    const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];
    const possibleMoves = [];

    for (let move of knightMoves) {
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
    return Math.abs(fromColumn - toColumn) > 2;
}

function isFriendlyPiece(fromTile, toTile, boardState) {
    const piece = boardState[toTile];
    const currentColor = boardState[fromTile].color;
    if (piece) {
        return piece.color === currentColor;
    }
    return false;
}