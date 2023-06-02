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
    const piece = boardState[fromTileNumber]?.piece;

    if (piece && piece.type !== "bishop" && piece.type !== "queen") {
        console.error("Not a bishop or queen");
        return moves;
    }

    const directions = [-9, -7, 7, 9];
    directions.forEach((direction) => {
        let nextTile = fromTileNumber + direction;
        while (nextTile >= 1 && nextTile <= 64) {
            const fromTileRow = Math.floor((fromTileNumber - 1) / 8) + 1;
            const fromTileCol = ((fromTileNumber - 1) % 8) + 1;
            const nextTileRow = Math.floor((nextTile - 1) / 8) + 1;
            const nextTileCol = ((nextTile - 1) % 8) + 1;

            if (Math.abs(fromTileRow - nextTileRow) !== Math.abs(fromTileCol - nextTileCol)) {
                break;
            }

            if (boardState[nextTile]) {
                const nextTilePiece = boardState[nextTile]?.piece;
                if (nextTilePiece && piece && nextTilePiece.team !== piece.team) {
                    moves.push(nextTile);
                }
                break;
            } else {
                moves.push(nextTile);
            }

            nextTile += direction;
        }
    });

    return moves;
}