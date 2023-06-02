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
    const piece = boardState[fromTile]?.piece;
    if (!piece || (piece.type !== 'rook' && piece.type !== 'queen')) {
        console.error('Not a rook or queen');
        return moves;
    }

    const directions = [-8, -1, 1, 8]; // Up, left, right, down
    directions.forEach(direction => {
        let nextTile = fromTile + direction;
        while (nextTile >= 1 && nextTile <= 64) {
            // Calculate row and column of the current tile and next tile
            const fromTileRow = Math.floor((fromTile - 1) / 8) + 1;
            const fromTileCol = ((fromTile - 1) % 8) + 1;
            const nextTileRow = Math.floor((nextTile - 1) / 8) + 1;
            const nextTileCol = ((nextTile - 1) % 8) + 1;

            // Check if the tile is on the same row or column
            if (fromTileRow !== nextTileRow && fromTileCol !== nextTileCol) {
                break;
            }

            // Check if the tile is valid and if it's empty or occupied by an opponent
            const nextTilePiece = boardState[nextTile]?.piece;
            if (nextTilePiece) {
                if (nextTilePiece.team !== piece.team) {
                    moves.push(nextTile); // Can capture the opponent's piece
                }
                break; // Cannot move further in this direction
            } else {
                moves.push(nextTile); // Can move to an empty tile
            }

            nextTile += direction;
        }
    });

    return moves;
}