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
    const fromColumn = fromTile % 8;
    const toColumn = toTile % 8;
    const columnDifference = Math.abs(fromColumn - toColumn);
    return columnDifference > 2 || columnDifference === 0;
}

function isFriendlyPiece(fromTile: number, toTile: number, boardState: Tile[]): boolean {
    const fromPiece = boardState[boardState.findIndex(tile => tile.id === fromTile)]?.piece;
    const toPiece = boardState[boardState.findIndex(tile => tile.id === toTile)]?.piece;
    if (toPiece) {
        return toPiece.team === fromPiece?.team;
    }
    return false;
}

export function getValidMoves(fromTile: number, boardState: Tile[]): number[] {
    const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];
    const possibleMoves: number[] = [];

    for (let move of knightMoves) {
        const newTile = fromTile + move;

        // Check if newTile is valid and not occupied by a friendly piece
        if (
            newTile >= 0 &&
            newTile <= 63 &&
            !isOffBoard(fromTile, newTile) &&
            !isFriendlyPiece(fromTile, newTile, boardState)
        ) {
            possibleMoves.push(newTile);
        }
    }

    console.log(possibleMoves);
    return possibleMoves;
}