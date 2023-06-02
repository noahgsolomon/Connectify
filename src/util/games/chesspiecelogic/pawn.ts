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
    const fromTileNumber = Number(fromTile);
    const fromTileRow = Math.floor((fromTileNumber - 1) / 8) + 1;
    // const fromTileCol = ((fromTileNumber - 1) % 8) + 1;

    const piece = boardState[fromTileNumber] && boardState[fromTileNumber].piece;
    if (!piece){
        console.error('No piece');
        return moves;
    }
    if (piece.type !== 'pawn') {
        console.error('Not a pawn');
        return moves;
    }

    const direction = piece.team === 'white' ? -1 : 1;

    // Check one step forward
    let oneStepForward = fromTileNumber + (8 * direction);
    if (oneStepForward >= 1 && oneStepForward <= 64 && !(boardState[oneStepForward] && boardState[oneStepForward].piece)) {
        moves.push(oneStepForward);
    }

    // Check two steps forward for the first move
    if ((piece.team === 'white' && fromTileRow === 7) || (piece.team === 'black' && fromTileRow === 2)) {
        let twoStepsForward = fromTileNumber + (16 * direction);
        if (twoStepsForward >= 1 && twoStepsForward <= 64 && !(boardState[twoStepsForward] && boardState[twoStepsForward].piece)) {
            moves.push(twoStepsForward);
        }
    }

    // Check diagonal moves for capturing
    const diagonals = [fromTileNumber + (7 * direction), fromTileNumber + (9 * direction)];
    diagonals.forEach(diagonal => {
        if (diagonal >= 1 && diagonal <= 64 && boardState[diagonal] && boardState[diagonal].piece && boardState[diagonal].piece?.team !== piece.team) {
            moves.push(diagonal);
        }
    });
    console.log(moves);
    return moves;
}