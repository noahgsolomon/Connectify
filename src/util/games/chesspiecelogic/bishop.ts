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
    const fromTileNumber = fromTile;
    const piece = boardState[boardState.findIndex(tile => tile.id === fromTileNumber)]?.piece;

    if (!piece || (piece.type !== "BISHOP" && piece.type !== "QUEEN")) {
        console.error("Not a bishop or queen");
        return moves;
    }

    const directions = [-9, -7, 7, 9];
    directions.forEach((direction) => {
        let nextTileId = fromTileNumber + direction;
        let nextTileIndex = boardState.findIndex(tile => tile.id === nextTileId);

        while (nextTileId >= 0 && nextTileId <= 63) {
            const fromTileRow = Math.floor(fromTileNumber / 8);
            const fromTileCol = fromTileNumber % 8;
            const nextTileRow = Math.floor(nextTileId / 8);
            const nextTileCol = nextTileId % 8;

            if (Math.abs(fromTileRow - nextTileRow) !== Math.abs(fromTileCol - nextTileCol)) {
                break;
            }

            const nextTilePiece = boardState[nextTileIndex]?.piece;

            if (nextTilePiece) {
                if (nextTilePiece.team === piece.team) {
                    break;
                } else {
                    moves.push(nextTileId);
                    break;
                }
            } else {
                moves.push(nextTileId);
            }

            nextTileId += direction;
            nextTileIndex = boardState.findIndex(tile => tile.id === nextTileId);
        }
    });

    console.log(moves);
    return moves;
}