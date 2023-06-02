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


function isOffBoard(fromTile: number, toTile: number): boolean {
    const fromColumn = (fromTile - 1) % 8;
    const toColumn = (toTile - 1) % 8;
    return Math.abs(fromColumn - toColumn) > 1;
}

function isFriendlyPiece(fromTile: number, toTile: number, boardState: Tile[]): boolean {
    const piece = boardState[toTile] && boardState[toTile]?.piece;
    const currentColor = boardState[fromTile].piece && piece && piece.team;
    if (piece) {
        return piece.team === currentColor;
    }
    return false;
}

export function getValidMoves(fromTile: number, boardState: Tile[]): number[] {
    const currentTile = Number(fromTile);
    const kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
    const possibleMoves: number[] = [];

    for (let move of kingMoves) {
        const newTile = currentTile + move;

        // Check if newTile is valid and not occupied by a friendly piece
        if (
            newTile >= 1 &&
            newTile <= 64 &&
            !isOffBoard(currentTile, newTile) &&
            !isFriendlyPiece(fromTile, newTile, boardState)
        ) {
            possibleMoves.push(newTile);
        }
    }

    return possibleMoves;
}