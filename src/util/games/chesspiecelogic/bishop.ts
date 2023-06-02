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
    const piece = boardState[fromTileNumber].tile.piece;

    if (piece.type !== "bishop" && piece.type !== "queen") {
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
                if (boardState[nextTile].tile.piece.team !== piece.team) {
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