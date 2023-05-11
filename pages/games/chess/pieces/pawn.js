export function getValidMoves(fromTile, boardState) {
    const moves = [];
    const fromTileNumber = Number(fromTile);
    const fromTileRow = Math.floor((fromTileNumber - 1) / 8) + 1;
    const fromTileCol = ((fromTileNumber - 1) % 8) + 1;

    const piece = boardState[fromTileNumber];
    if (piece.type !== 'pawn') {
        console.error('Not a pawn');
        return moves;
    }

    const direction = piece.color === 'white' ? -1 : 1;

    // Check one step forward
    let oneStepForward = fromTileNumber + (8 * direction);
    if (oneStepForward >= 1 && oneStepForward <= 64 && !boardState[oneStepForward]) {
        moves.push(oneStepForward);
    }

    // Check two steps forward for the first move
    if ((piece.color === 'white' && fromTileRow === 7) || (piece.color === 'black' && fromTileRow === 2)) {
        let twoStepsForward = fromTileNumber + (16 * direction);
        if (twoStepsForward >= 1 && twoStepsForward <= 64 && !boardState[twoStepsForward]) {
            moves.push(twoStepsForward);
        }
    }

    // Check diagonal moves for capturing
    const diagonals = [fromTileNumber + (7 * direction), fromTileNumber + (9 * direction)];
    diagonals.forEach(diagonal => {
        if (diagonal >= 1 && diagonal <= 64 && boardState[diagonal] && boardState[diagonal].color !== piece.color) {
            moves.push(diagonal);
        }
    });
    console.log(moves);
    return moves;
}