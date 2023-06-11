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
    return Math.abs(fromColumn - toColumn) > 1;
}

function isFriendlyPiece(fromTile: number, toTile: number, boardState: Tile[]): boolean {
    const fromTileIndex = boardState.findIndex(tile => tile.id === fromTile);
    const toTileIndex = boardState.findIndex(tile => tile.id === toTile);

    const piece = boardState[toTileIndex] && boardState[toTileIndex]?.piece;
    const currentColor = boardState[fromTileIndex] && boardState[fromTileIndex].piece?.team;
    if (piece) {
        return piece.team === currentColor;
    }
    return false;
}

export function getValidMoves(fromTile: number, boardState: Tile[]): number[] {
    const kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
    const possibleMoves: number[] = [];

    for (let move of kingMoves) {
        const newTile = fromTile + move;
        const newTileIndex = boardState.findIndex(tile => tile.id === newTile);

        // Check if newTile is valid and not occupied by a friendly piece
        if (
            newTile >= 0 &&
            newTile <= 63 &&
            !isOffBoard(fromTile, newTile) &&
            !isFriendlyPiece(fromTile, newTile, boardState) &&
            newTileIndex !== -1
        ) {
            possibleMoves.push(newTile);
        }
    }

    console.log(possibleMoves);
    return possibleMoves;
}