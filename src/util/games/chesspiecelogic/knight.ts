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

function isOffBoard(fromTile: number, toTile: number): boolean {
    const fromColumn = (fromTile - 1) % 8;
    const toColumn = (toTile - 1) % 8;
    return Math.abs(fromColumn - toColumn) > 2;
}

function isFriendlyPiece(fromTile: number, toTile: number, boardState: BoardState): boolean {
    const piece = boardState[toTile] && boardState[toTile].tile.piece;
    const currentColor = boardState[fromTile] && boardState[fromTile].tile.color;
    if (piece) {
        return piece.team === currentColor;
    }
    return false;
}

export function getValidMoves(fromTile: number, boardState: BoardState): number[] {
    const currentTile = Number(fromTile);
    const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];
    const possibleMoves: number[] = [];

    for (let move of knightMoves) {
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

    console.log(possibleMoves);
    return possibleMoves;
}