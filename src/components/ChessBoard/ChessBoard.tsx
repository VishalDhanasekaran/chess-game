import React, { useRef, useState } from 'react';
import './ChessBoard.css';
import Tile from '../Tile/Tile'


const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];

interface Piece
{
    image: string;
    x: number;
    y: number;
};

const initialBoardState: Piece[] = [];
for(let p=0; p<2; p++)
{
    const type = (p===0)? 'black' : 'white';
    const y = (p===0)? 7 : 0;

    initialBoardState.push({image:`assets/image-src/${type}Rock.png`, x:0, y}); 
    initialBoardState.push({image:`assets/image-src/${type}Knight.png`, x:1, y}); 
    initialBoardState.push({image:`assets/image-src/${type}Bishop.png`, x:2, y}); 
    initialBoardState.push({image:`assets/image-src/${type}Queen.png`, x:3, y}); 
    initialBoardState.push({image:`assets/image-src/${type}King.png`, x:4, y}); 
    initialBoardState.push({image:`assets/image-src/${type}Bishop.png`, x:5, y}); 
    initialBoardState.push({image:`assets/image-src/${type}Knight.png`, x:6, y}); 
    initialBoardState.push({image:`assets/image-src/${type}Rock.png`, x:7, y}); 
}
for(let i=0; i<8; i++)
{
    //white Pawn
    initialBoardState.push({image:'assets/image-src/whitePawn.png', x:i, y:1});
}
for(let i=0; i<8; i++)
{
    initialBoardState.push({image:'assets/image-src/blackPawn.png', x:i, y:6}); //black pawn

}

export default function Chessboard()
{
    //const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState)
    const chessboardRef = useRef<HTMLDivElement>(null);
    let activePiece: HTMLElement | null = null;

    function grabPiece(e: React.MouseEvent)
    {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        //we are looking wheather it is a chesspiece && chessboard is available
        if(element.classList.contains('chess-piece') && chessboard)
        {
            setGridX( Math.floor((e.clientX - chessboard.offsetLeft) / 100));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));
            const x = e.clientX - 50;
            const y = e.clientY - 50;

            element.style.position = 'absolute';
            element.style.left = `${x}px`;
            element.style.top =  `${y}px`;

            //after grabing the piece set the activePiece
            //setActivePiece(element);
            activePiece = element;
        }
    }

    function movePiece(e: React.MouseEvent)
    {
        const chessboard = chessboardRef.current;
        
        if(activePiece && chessboard)
        {
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 25;

            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;

            activePiece.style.position = 'absolute';
            // if x is smaller than minimum  amoutn  
            if(x < minX)
            {
                activePiece.style.left = `${minX}px`;
            }
            else if(x > maxX) //if x is bigger than max amt
            {
                activePiece.style.left = `${maxX}px`;
            }
            else //if x is in the constraints
            {
                activePiece.style.left = `${x}px`;
            }
            
            if(y < minY) //if y is smaller than minimum amount
            {
                activePiece.style.top = `${minY}px`;
            }
            else if(y > maxY) //if y is bigger than max amt
            {
                activePiece.style.top = `${maxY}px`;
            }
            else  //if y is in the constraints
            {
                activePiece.style.top = `${y}px`;
            }
       }
    }
    console.log(activePiece);

    function dropPiece(e: React.MouseEvent)
    {
        const chessboard = chessboardRef.current;
       if(activePiece && chessboard)
        {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800)) / 100);
    
            setPieces((value) => {
                const pieces = value.map((p)=> {
                        if(p.x === gridX && p.y === gridY)
                        {
                            p.x = x;
                            p.y = y;
                            console.log(x,", ", y);
                        }
                    
                        return p;
                    });
                return pieces;
            });

//            setActivePiece(null);
            activePiece = null;
            
        }
    }

    let board = [];
    for(let j=verticalAxis.length - 1; j >= 0; j--)
    {
        for(let i=0; i<horizontalAxis.length; i++)
        {
            let n = i+j+2;
            let image = undefined;

            pieces.forEach((p) => { 
                if(p.x === i && p.y === j)
                {
                    image = p.image;
                }
                });

            board.push(<Tile key={`${j}, ${i}`} number={n} image={image} />); 
       } 
    }
    return (
                <div 
                    onMouseMove={(e)=>movePiece(e)} 
                    onMouseDown={e=>grabPiece(e)} 
                    onMouseUp={e=>dropPiece(e)}
                    id="chessboard"
                    ref={chessboardRef}
                    >
                        {board}
                </div>
            );
}