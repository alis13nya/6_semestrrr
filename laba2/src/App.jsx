



import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Square({ value, onSquareClick }) {
  return (
    <Button 
  variant="contained" 
  onClick={onSquareClick} 
  sx={{ 
    width: '100%', 
    aspectRatio: '1 / 1', // Делает кнопку квадратной
    fontSize: '2rem' 
  }}
>
  {value}
</Button>
  );
}


function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || isDraw(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const draw = isDraw(squares);
  
  let status;
  if (winner) {
    status = `Победитель: ${winner}`;
  } else if (draw) {
    status = 'Ничья!!!';
  } else {
    status = `Следующий игрок: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {status}
      </Typography>

      <Grid container spacing={1} sx={{ aspectRatio: '1 / 1' }}>
        {[...Array(9)].map((_, i) => (
          <Grid item xs={4} key={i}>
            <Square 
              value={squares[i]} 
              onSquareClick={() => handleClick(i)} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function isDraw(squares) {
  return squares.every(square => square !== null) && !calculateWinner(squares);
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    const description = move ? `Переместиться на шаг #${move}` : 'Начать сначала';
    return (
      <li key={move}>
        <Button 
          variant="outlined" 
          onClick={() => jumpTo(move)}
          sx={{ marginY: 0.5, width: '100%' }}
        >
          {description}
        </Button>
      </li>
    );
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: 4, 
      minHeight: '100vh' 
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 10,
          width: '100%',
          maxWidth: 1000 
        }}
      >
        {/* Игровое поле */}
        <Box sx={{ flex: '0 0 50%', maxWidth: 400, width: '100%' }}>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </Box>

        {/* История ходов */}
        <Box sx={{ flex: '0 0 50%' }}>
          <Typography 
            variant="h5" 
            sx={{ marginBottom: 2 }}
          >
            История ходов
          </Typography>
          <ul style={{ 
            listStyleType: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8 
          }}>
            {moves}
          </ul>
        </Box>
      </Box>
    </Box>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

