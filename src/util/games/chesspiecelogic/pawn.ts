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
    const moves: number[] = [];
    const fromTileRow = Math.floor(fromTile / 8) + 1; // calculate row based on 0 index

    const piece = boardState[fromTile]?.piece;
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
    if (oneStepForward >= 0 && oneStepForward < 64 && !(boardState[oneStepForward]?.piece)) {
        moves.push(oneStepForward);
    }

    // Check two steps forward for the first move
    if ((piece.team === 'WHITE' && fromTileRow === 7) || (piece.team === 'BLACK' && fromTileRow === 2)) {
        let twoStepsForward = fromTile + (16 * direction);
        if (twoStepsForward >= 0 && twoStepsForward < 64 && !(boardState[twoStepsForward]?.piece)) {
            moves.push(twoStepsForward);
        }
    }

    // Check diagonal moves for capturing
    const diagonals = [fromTile + (7 * direction), fromTile + (9 * direction)];
    diagonals.forEach(diagonal => {
        if (diagonal >= 0 && diagonal < 64 && boardState[diagonal]?.piece?.team !== piece.team) {
            moves.push(diagonal);
        }
    });

    console.log(moves);
    return moves;
}