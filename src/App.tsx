import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#50C9CE' },
    background: { default: '#2E382E', paper: '#2E382E' },
    text: { primary: '#50C9CE' }
  },
  typography: {
    fontFamily: '"Courier New", "Monaco", monospace',
    h3: { fontWeight: 'bold', textShadow: '0 0 10px #50C9CE' },
    h4: { fontWeight: 'bold' },
    h6: { fontWeight: 'bold' }
  }
});

const sampleText: string = "The quick brown fox jumps over the lazy dog. This is a sample text for typing practice. Keep typing to improve your speed and accuracy.";

interface TypingStats {
  wpm: number;
  accuracy: number;
  wordsTyped: number;
}

const App: React.FC = () => {
  const [text] = useState<string>(sampleText);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [wordsTyped, setWordsTyped] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    if (userInput.length > 0) {
      const minutes: number = timeElapsed / 60000;
      const typedWords: number = userInput.trim().split(' ').length;
      setWordsTyped(typedWords);
      
      if (minutes > 0) {
        setWpm(Math.round(typedWords / minutes));
      }

      let correctChars: number = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === text[i]) {
          correctChars++;
        }
      }
      setAccuracy(Math.round((correctChars / userInput.length) * 100));
    }

    if (userInput === text) {
      setIsActive(false);
    }
  }, [userInput, timeElapsed, text, startTime]);

  const handleReset = (): void => {
    setUserInput('');
    setStartTime(null);
    setIsActive(false);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setWordsTyped(0);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };

  const renderText = (): JSX.Element[] => {
    return text.split('').map((char: string, index: number) => {
      let color: string = '#646669';
      if (index < userInput.length) {
        color = userInput[index] === char ? '#d1d0c5' : '#ca4754';
      } else if (index === userInput.length) {
        color = '#50C9CE';
      }
      return (
        <span key={index} style={{ color, backgroundColor: index === userInput.length ? '#50C9CE' : 'transparent' }}>
          {char}
        </span>
      );
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ 
          color: '#50C9CE',
          textShadow: '0 0 20px #50C9CE, 0 0 40px #50C9CE',
          fontFamily: '"Courier New", monospace',
          letterSpacing: '2px',
          mb: 4
        }}>
          >>> MONKEYTYPE RETRO <<<
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              border: '2px solid #50C9CE',
              borderRadius: 0,
              boxShadow: '0 0 15px rgba(80, 201, 206, 0.3)',
              background: 'linear-gradient(45deg, #2E382E 0%, #1a2a1a 100%)'
            }}>
              <Typography variant="h6" sx={{ color: '#50C9CE', textShadow: '0 0 5px #50C9CE' }}>WPM</Typography>
              <Typography variant="h4" sx={{ color: '#50C9CE', fontFamily: 'monospace' }}>{wpm}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              border: '2px solid #50C9CE',
              borderRadius: 0,
              boxShadow: '0 0 15px rgba(80, 201, 206, 0.3)',
              background: 'linear-gradient(45deg, #2E382E 0%, #1a2a1a 100%)'
            }}>
              <Typography variant="h6" sx={{ color: '#50C9CE', textShadow: '0 0 5px #50C9CE' }}>ACCURACY</Typography>
              <Typography variant="h4" sx={{ color: '#50C9CE', fontFamily: 'monospace' }}>{accuracy}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              border: '2px solid #50C9CE',
              borderRadius: 0,
              boxShadow: '0 0 15px rgba(80, 201, 206, 0.3)',
              background: 'linear-gradient(45deg, #2E382E 0%, #1a2a1a 100%)'
            }}>
              <Typography variant="h6" sx={{ color: '#50C9CE', textShadow: '0 0 5px #50C9CE' }}>WORDS</Typography>
              <Typography variant="h4" sx={{ color: '#50C9CE', fontFamily: 'monospace' }}>{wordsTyped}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ 
          p: 3, 
          mb: 3,
          border: '2px solid #50C9CE',
          borderRadius: 0,
          boxShadow: 'inset 0 0 20px rgba(80, 201, 206, 0.1), 0 0 20px rgba(80, 201, 206, 0.2)',
          background: 'linear-gradient(135deg, #1a2a1a 0%, #2E382E 100%)'
        }}>
          <Typography variant="h6" sx={{ 
            fontSize: '1.5rem', 
            lineHeight: 1.8, 
            fontFamily: '"Courier New", monospace',
            textShadow: '0 0 3px rgba(80, 201, 206, 0.5)'
          }}>
            {renderText()}
          </Typography>
        </Paper>

        <TextField
          fullWidth
          multiline
          rows={4}
          value={userInput}
          onChange={handleInputChange}
          placeholder=">>> START TYPING HERE <<<"
          variant="outlined"
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              fontFamily: '"Courier New", monospace',
              fontSize: '1.1rem',
              border: '2px solid #50C9CE',
              borderRadius: 0,
              boxShadow: 'inset 0 0 10px rgba(80, 201, 206, 0.1)',
              background: 'linear-gradient(135deg, #1a2a1a 0%, #2E382E 100%)',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' }
            },
            '& .MuiInputBase-input': {
              color: '#50C9CE',
              textShadow: '0 0 3px rgba(80, 201, 206, 0.5)'
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#50C9CE',
              opacity: 0.7
            }
          }}
          disabled={userInput === text}
          ref={inputRef}
        />

        <Box textAlign="center">
          <Button 
            variant="contained" 
            onClick={handleReset} 
            size="large"
            sx={{
              fontFamily: '"Courier New", monospace',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              letterSpacing: '1px',
              borderRadius: 0,
              border: '2px solid #50C9CE',
              boxShadow: '0 0 15px rgba(80, 201, 206, 0.3)',
              background: 'linear-gradient(45deg, #2E382E 0%, #1a2a1a 100%)',
              color: '#50C9CE',
              textShadow: '0 0 5px #50C9CE',
              '&:hover': {
                background: 'linear-gradient(45deg, #1a2a1a 0%, #2E382E 100%)',
                boxShadow: '0 0 25px rgba(80, 201, 206, 0.5)'
              }
            }}
          >
            >>> RESET TEST <<<
          </Button>
        </Box>

        {userInput === text && (
          <Paper sx={{ 
            p: 3, 
            mt: 3, 
            textAlign: 'center',
            border: '2px solid #50C9CE',
            borderRadius: 0,
            boxShadow: '0 0 30px rgba(80, 201, 206, 0.5)',
            background: 'linear-gradient(45deg, #2E382E 0%, #1a2a1a 100%)'
          }}>
            <Typography variant="h5" sx={{ 
              color: '#50C9CE', 
              fontFamily: '"Courier New", monospace',
              textShadow: '0 0 10px #50C9CE',
              letterSpacing: '2px',
              mb: 1
            }}>>>> TEST COMPLETE! <<<<</Typography>
            <Typography sx={{ 
              color: '#50C9CE', 
              fontFamily: 'monospace',
              fontSize: '1.1rem'
            }}>FINAL WPM: {wpm} | ACCURACY: {accuracy}% | WORDS: {wordsTyped}</Typography>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;