import { getValidMoves as getRookMoves } from './rook.js';
import { getValidMoves as getBishopMoves } from './bishop.js';

export function getValidMoves(fromTile, boardState) {
    const piece = boardState[Number(fromTile)];
    if (piece.type !== 'queen') {
        console.error('Not a queen');
        return [];
    }

    const rookMoves = getRookMoves(fromTile, boardState);
    const bishopMoves = getBishopMoves(fromTile, boardState);

    return [...new Set([...rookMoves, ...bishopMoves])];
}