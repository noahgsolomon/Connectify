import { getValidMoves as getRookMoves } from './rook';
import { getValidMoves as getBishopMoves } from './bishop';

type Team = 'WHITE' | 'BLACK' | '';

type Piece = {
    moved: boolean;
    type: string;
    team: Team;
};

type Tile = {
    piece: Piece | null;
    color: string;
    id: number;
};

export function getValidMoves(fromTile: number, boardState: Tile[]): number[] {
    const piece = boardState[boardState.findIndex(tile => tile.id === fromTile)].piece;
    if (!piece || piece.type !== 'QUEEN') {
        console.error('Not a queen');
        return [];
    }

    const rookMoves = getRookMoves(fromTile, boardState);
    const bishopMoves = getBishopMoves(fromTile, boardState);

    return [...new Set([...rookMoves, ...bishopMoves])];
}