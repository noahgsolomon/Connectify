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
    const piece = boardState[boardState.findIndex(tile => tile.id === fromTile)]?.piece;
    if (!piece || (piece.type !== 'ROOK' && piece.type !== 'QUEEN')) {
        console.error('Not a rook or queen');
        return moves;
    }

    const directions = [-8, -1, 1, 8]; // Up, left, right, down
    directions.forEach(direction => {
        let nextTileId = fromTile + direction;
        let nextTileIndex = boardState.findIndex(tile => tile.id === nextTileId);
        while (nextTileId >= 0 && nextTileId <= 63) {
            // Calculate row and column of the current tile and next tile
            const fromTileRow = Math.floor(fromTile / 8);
            const fromTileCol = fromTile % 8;
            const nextTileRow = Math.floor(nextTileId / 8);
            const nextTileCol = nextTileId % 8;

            // Check if the tile is on the same row or column
            if (fromTileRow !== nextTileRow && fromTileCol !== nextTileCol) {
                break;
            }

            // Check if the tile is valid and if it's empty or occupied by an opponent
            const nextTilePiece = boardState[nextTileIndex]?.piece;
            if (nextTilePiece) {
                if (nextTilePiece.team !== piece.team) {
                    moves.push(nextTileId); // Can capture the opponent's piece
                }
                break; // Cannot move further in this direction
            } else {
                moves.push(nextTileId); // Can move to an empty tile
            }

            nextTileId += direction;
            nextTileIndex = boardState.findIndex(tile => tile.id === nextTileId);
        }
    });

    console.log(moves);
    return moves;
}
