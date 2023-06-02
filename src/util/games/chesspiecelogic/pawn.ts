type Piece = {
    moved: boolean;
    type: string;
    team: string;
};

type Tile = {
    piece: Piece;
    color: string;
    id: number;
};

type BoardState = Array<{ tile: Tile; piece: Piece }>;

export function getValidMoves(fromTile: number, boardState: BoardState): number[] {
    const moves: number[] = [];
    const fromTileNumber = Number(fromTile);
    const fromTileRow = Math.floor((fromTileNumber - 1) / 8) + 1;
    // const fromTileCol = ((fromTileNumber - 1) % 8) + 1;

    const piece = boardState[fromTileNumber] && boardState[fromTileNumber].tile.piece;
    if (piece.type !== 'pawn') {
        console.error('Not a pawn');
        return moves;
    }

    const direction = piece.team === 'white' ? -1 : 1;

    // Check one step forward
    let oneStepForward = fromTileNumber + (8 * direction);
    if (oneStepForward >= 1 && oneStepForward <= 64 && !(boardState[oneStepForward] && boardState[oneStepForward].tile.piece)) {
        moves.push(oneStepForward);
    }

    // Check two steps forward for the first move
    if ((piece.team === 'white' && fromTileRow === 7) || (piece.team === 'black' && fromTileRow === 2)) {
        let twoStepsForward = fromTileNumber + (16 * direction);
        if (twoStepsForward >= 1 && twoStepsForward <= 64 && !(boardState[twoStepsForward] && boardState[twoStepsForward].tile.piece)) {
            moves.push(twoStepsForward);
        }
    }

    // Check diagonal moves for capturing
    const diagonals = [fromTileNumber + (7 * direction), fromTileNumber + (9 * direction)];
    diagonals.forEach(diagonal => {
        if (diagonal >= 1 && diagonal <= 64 && boardState[diagonal] && boardState[diagonal].tile.piece && boardState[diagonal].tile.piece.team !== piece.team) {
            moves.push(diagonal);
        }
    });
    console.log(moves);
    return moves;
}