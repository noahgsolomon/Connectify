import React, {useEffect, useState} from "react";

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
                            <img src={`src/pages/chess/assets/${(tile.piece.team)}${tile.piece.type}.png`}  alt={`${tile.piece.team} ${getPieceType(tile.piece.type)}`}/>
                        </div>
                    }
                </div>
            ))}
        </>
    )
}

export default Chessboard;