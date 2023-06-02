import { getValidMoves as getRookMoves } from './rook';
import { getValidMoves as getBishopMoves } from './bishop';

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
    const piece = boardState[fromTile]?.tile.piece;
    if (!piece || piece.type !== 'queen') {
        console.error('Not a queen');
        return [];
    }

    const rookMoves = getRookMoves(fromTile, boardState);
    const bishopMoves = getBishopMoves(fromTile, boardState);

    return [...new Set([...rookMoves, ...bishopMoves])];
}