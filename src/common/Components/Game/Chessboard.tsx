import React, {useEffect, useState} from "react";


import whitequeen from '../../../pages/chess/assets/whitequeen.png';
import whiteking from '../../../pages/chess/assets/whiteking.png';
import whitebishop from '../../../pages/chess/assets/whitebishop.png';
import whiteknight from '../../../pages/chess/assets/whiteknight.png';
import whiterook from '../../../pages/chess/assets/whiterook.png';
import whitepawn from '../../../pages/chess/assets/whitepawn.png';
import blackqueen from '../../../pages/chess/assets/blackqueen.png';
import blackking from '../../../pages/chess/assets/blackking.png';
import blackbishop from '../../../pages/chess/assets/blackbishop.png';
import blackknight from '../../../pages/chess/assets/blackknight.png';
import blackrook from '../../../pages/chess/assets/blackrook.png';
import blackpawn from '../../../pages/chess/assets/blackpawn.png';

const pieceImageMap: Record<string, any> = {
    whitequeen,
    whiteking,
    whitebishop,
    whiteknight,
    whiterook,
    whitepawn,
    blackqueen,
    blackking,
    blackbishop,
    blackknight,
    blackrook,
    blackpawn
};

console.log(whiteking);
console.log(pieceImageMap['whiteking']);

type ChessboardProps = {
    userColor?: string;
}

type PieceType = 'KNIGHT' | 'BISHOP' | 'ROOK' | 'QUEEN' | 'KING' | 'PAWN' | '';

type Team = 'WHITE' | 'BLACK';

type Piece = {
    moved: boolean,
    type: PieceType,
    team: Team
}

type Tile = {
    piece: PieceType,
    color: string,
    id: number
}

const Chessboard: React.FC<ChessboardProps> = ({ userColor = '' }) => {

    const [chessboard, setChessboard] = useState<Array<{tile: Tile, piece: Piece}>>([]);

    function getPieceType(piece: string) : PieceType{
        if (piece === '♜' || piece === '♖') {
            return 'ROOK';
        } else if (piece === '♞' || piece === '♘') {
            return 'KNIGHT';
        } else if (piece === '♝' || piece === '♗') {
            return 'BISHOP';
        } else if (piece === '♛' || piece === '♕') {
            return 'QUEEN';
        } else if (piece === '♚' || piece === '♔') {
            return 'KING';
        } else if (piece === '♟' || piece === '♙') {
            return 'PAWN';
        } else {
            return '';
        }
    }

    function getPieceTeam(piece: string) : Team {
        return (piece === '♔' || piece === '♕' || piece === '♖' ||
            piece === '♗' || piece === '♘' || piece === '♙') ?
            'WHITE' : 'BLACK';
    }

    const pieces = [
        '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
    ];

    useEffect(() => {

        if (userColor.toUpperCase() === 'BLACK') {
            let isLight = true;
            let board: {tile: Tile, piece: Piece}[] = [];
            for (let i = 64; i >= 1; i--) {
                isLight = !isLight;
                if (i % 8 === 0) {
                    isLight = !isLight;
                }
                const piece:Piece = {
                    moved: false,
                    type: getPieceType(pieces[i - 1]),
                    team: getPieceTeam(pieces[i - 1]),
                };
                const tile: Tile = {
                    id: i,
                    color: isLight ? 'light' : 'dark',
                    piece: piece.type
                };
                board.push({tile, piece});
            }
            setChessboard(board);
        }
        else{
            let isLight = false;
            let board: {tile: Tile, piece: Piece}[] = [];
            for (let i = 1; i <= 64; i++) {
                const piece:Piece = {
                    moved: false,
                    type: getPieceType(pieces[i - 1]),
                    team: getPieceTeam(pieces[i - 1]),
                };
                const tile: Tile = {
                    id: i,
                    color: isLight ? 'light' : 'dark',
                    piece: piece.type
                };
                board.push({tile, piece});
                isLight = !isLight;
                if (i % 8 === 0) {
                    isLight = !isLight;
                }
            }
            setChessboard(board);
        }
}, [userColor]);

    // useEffect(() => {
    //     let board = [];
    //     for (let i = 0; i < 64; i++) {
    //         const isLight = (Math.floor(i / 8) % 2 === 0) ? (i % 2 === 0) : (i % 2 === 1);
    //         const piece = pieces[i];
    //         board.push({tile: {piece: getPieceType(piece), color: isLight ? 'light' : 'dark', id: i + 1}, piece: {moved: false, type: getPieceType(piece), team: getPieceTeam(piece)}});
    //     }
    //     setChessboard(board);
    // }, []);

    function getPieceImage(team: Team, piece: PieceType) {
        if (team === 'WHITE') {
            switch (piece) {
                case 'QUEEN':
                    return whitequeen;
                case 'KING':
                    return whiteking;
                case 'BISHOP':
                    return whitebishop;
                case 'KNIGHT':
                    return whiteknight;
                case 'ROOK':
                    return whiterook;
                case 'PAWN':
                    return whitepawn;
            }
        } else if (team === 'BLACK') {
            switch (piece) {
                case 'QUEEN':
                    return blackqueen;
                case 'KING':
                    return blackking;
                case 'BISHOP':
                    return blackbishop;
                case 'KNIGHT':
                    return blackknight;
                case 'ROOK':
                    return blackrook;
                case 'PAWN':
                    return blackpawn;
            }
        }
    }

    return (
        <>
        {chessboard.map((tile, i) => (
                <div
                    key={i}
                    id={`tile-${i + 1}`}
                    className={`tile ${tile.tile.color}`}
                    data-color={tile.tile.color}
                    data-num={i + 1}
                    data-piece={tile.piece.type}
                    data-team={tile.piece.team}
                    style={{
                        backgroundColor: `var(--${tile.tile.color}-tile)`,
                        cursor: tile.piece ? 'pointer' : 'default'
                    }}
                >
                    {tile.piece.type !== '' &&
                        <div
                            data-moved="false"
                            className="piece"
                            data-piece-type={getPieceType(tile.piece.type)}
                            data-team={getPieceTeam(tile.piece.type)}
                        >
                            <img
                                src={getPieceImage(tile.piece.team, tile.piece.type)}
                                alt={`${tile.piece.team} ${getPieceType(tile.piece.type)}`}
                            />
                        </div>
                    }
                </div>
            ))}
        </>
    )
}

export default Chessboard;