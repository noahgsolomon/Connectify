type Piece = {
    moved: boolean;
    type: string;
    team: string;
};

type Tile = {
    piece: Piece | null;
    color: string;
    id: number;
};

export function getValidMoves(fromTile: number, boardState: Tile[]): number[] {
    fromTile = Number(fromTile);
    const moves: number[] = [];
    const fromTileRow = Math.floor(fromTile / 8); // 0-indexed row

    const piece = boardState[boardState.findIndex(tile => tile.id === fromTile)]?.piece;
    if (!piece) {
        console.error('No piece');
        return moves;
    }
    if (piece.type !== 'PAWN') {
        console.error('Not a pawn');
        return moves;
    }

    const direction = piece.team === 'WHITE' ? -1 : 1;

    // Check one step forward
    let oneStepForward = fromTile + (8 * direction);
    let oneStepForwardTile = boardState[boardState.findIndex(tile => tile.id === oneStepForward)];
    if (oneStepForward >= 0 && oneStepForward < 64 && !(oneStepForwardTile?.piece)) {
        moves.push(oneStepForward);
    }

    // Check two steps forward for the first move
    if (!piece.moved && ((piece.team === 'WHITE' && fromTileRow === 6) || (piece.team === 'BLACK' && fromTileRow === 1))) {
        let twoStepsForward = fromTile + (16 * direction);
        let twoStepsForwardTile = boardState[boardState.findIndex(tile => tile.id === twoStepsForward)];
        if (twoStepsForward >= 0 && twoStepsForward < 64 && !(twoStepsForwardTile?.piece)) {
            moves.push(twoStepsForward);
        }
    }

    // Check diagonal moves for capturing
    const diagonals = [fromTile + (7 * direction), fromTile + (9 * direction)];
    diagonals.forEach(diagonal => {
        let diagonalTile = boardState[boardState.findIndex(tile => tile.id === diagonal)];
        if (diagonal >= 0 && diagonal < 64 && diagonalTile?.piece?.team !== piece.team && diagonalTile?.piece !== null) {
            moves.push(diagonal);
        }
    });

    console.log(moves);
    return moves;
}