import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FFD700' },
    background: { default: '#000000', paper: '#000000' },
    text: { primary: '#FFD700' }
  },
  typography: {
    fontFamily: '"Courier New", "Monaco", monospace',
    h3: { fontWeight: 'bold', textShadow: '0 0 10px #FFD700' },
    h4: { fontWeight: 'bold' },
    h6: { fontWeight: 'bold' }
  }
});

const sampleTexts: string[] = [
  "The quick brown fox jumps over the lazy dog. This is a sample text for typing practice. Keep typing to improve your speed and accuracy.",
  "In the digital age, technology has revolutionized how we communicate, work, and live. From smartphones to artificial intelligence, innovation continues to shape our future in ways we never imagined possible.",
  "Programming is the art of solving problems through code. It requires logical thinking, creativity, and patience. Every bug is a puzzle waiting to be solved, and every solution brings satisfaction."
];

const textTitles: string[] = [
  "Basic Practice",
  "Technology", 
  "Programming"
];

interface TypingStats {
  wpm: number;
  accuracy: number;
  wordsTyped: number;
}

const App: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [text, setText] = useState<string>(sampleTexts[0]);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [wordsTyped, setWordsTyped] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && startTime && !isCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime, isCompleted]);

  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    if (userInput.length > 0 && !isCompleted) {
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

    if (userInput.length === text.length && !isCompleted) {
      setIsActive(false);
      setIsCompleted(true);
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
    setIsCompleted(false);
  };

  const handleNewText = (): void => {
    const nextIndex = (currentTextIndex + 1) % sampleTexts.length;
    setCurrentTextIndex(nextIndex);
    setText(sampleTexts[nextIndex]);
    handleReset();
  };

  const handleTextSelect = (index: number): void => {
    setCurrentTextIndex(index);
    setText(sampleTexts[index]);
    handleReset();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };

  const renderText = (): JSX.Element[] => {
    return text.split('').map((char: string, index: number) => {
      let color: string = '#666666';
      if (index < userInput.length) {
        color = userInput[index] === char ? '#FFD700' : '#FF4444';
      } else if (index === userInput.length) {
        color = '#FFD700';
      }
      return (
        <span key={index} style={{ color, backgroundColor: index === userInput.length ? '#FFD700' : 'transparent' }}>
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
          color: '#FFD700',
          textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700',
          fontFamily: '"Courier New", monospace',
          letterSpacing: '2px',
          mb: 2
        }}>
          {'>>> MONKEYTYPE RETRO <<<'}
        </Typography>
        
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography sx={{ 
            fontSize: '3rem',
            mb: 1
          }}>
            🐵
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            {textTitles.map((title, index) => (
              <Paper 
                key={index} 
                onClick={() => handleTextSelect(index)}
                sx={{
                  px: 2,
                  py: 1,
                  border: `2px solid ${index === currentTextIndex ? '#FFD700' : '#666666'}`,
                  borderRadius: 0,
                  background: index === currentTextIndex ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  boxShadow: index === currentTextIndex ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    border: '2px solid #FFD700',
                    background: 'rgba(255, 215, 0, 0.05)',
                    boxShadow: '0 0 8px rgba(255, 215, 0, 0.2)'
                  }
                }}
              >
                <Typography sx={{
                  color: index === currentTextIndex ? '#FFD700' : '#666666',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textShadow: index === currentTextIndex ? '0 0 5px #FFD700' : 'none'
                }}>
                  {title}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              border: '2px solid #FFD700',
              borderRadius: 0,
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)'
            }}>
              <Typography variant="h6" sx={{ color: '#FFD700', textShadow: '0 0 5px #FFD700' }}>WPM</Typography>
              <Typography variant="h4" sx={{ color: '#FFD700', fontFamily: 'monospace' }}>{wpm}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              border: '2px solid #FFD700',
              borderRadius: 0,
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)'
            }}>
              <Typography variant="h6" sx={{ color: '#FFD700', textShadow: '0 0 5px #FFD700' }}>ACCURACY</Typography>
              <Typography variant="h4" sx={{ color: '#FFD700', fontFamily: 'monospace' }}>{accuracy}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              border: '2px solid #FFD700',
              borderRadius: 0,
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)'
            }}>
              <Typography variant="h6" sx={{ color: '#FFD700', textShadow: '0 0 5px #FFD700' }}>WORDS</Typography>
              <Typography variant="h4" sx={{ color: '#FFD700', fontFamily: 'monospace' }}>{wordsTyped}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ 
          p: 3, 
          mb: 3,
          border: '2px solid #FFD700',
          borderRadius: 0,
          boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.1), 0 0 20px rgba(255, 215, 0, 0.2)',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)'
        }}>
          <Typography variant="h6" sx={{ 
            fontSize: '1.5rem', 
            lineHeight: 1.8, 
            fontFamily: '"Courier New", monospace',
            textShadow: '0 0 3px rgba(255, 215, 0, 0.5)'
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
          placeholder="Start typing here..."
          variant="outlined"
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              fontFamily: '"Courier New", monospace',
              fontSize: '1.1rem',
              border: '2px solid #FFD700',
              borderRadius: 0,
              boxShadow: 'inset 0 0 10px rgba(255, 215, 0, 0.1)',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' }
            },
            '& .MuiInputBase-input': {
              color: '#FFD700',
              textShadow: '0 0 3px rgba(255, 215, 0, 0.5)'
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#FFD700',
              opacity: 0.7
            }
          }}
          disabled={userInput === text}
          ref={inputRef}
        />

        <Box textAlign="center" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
              border: '2px solid #FFD700',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)',
              color: '#FFD700',
              textShadow: '0 0 5px #FFD700',
              '&:hover': {
                background: 'linear-gradient(45deg, #1a1a1a 0%, #000000 100%)',
                boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)'
              }
            }}
          >
            {'>>> RESET TEST <<<'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleNewText} 
            size="large"
            sx={{
              fontFamily: '"Courier New", monospace',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              letterSpacing: '1px',
              borderRadius: 0,
              border: '2px solid #FFD700',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)',
              color: '#FFD700',
              textShadow: '0 0 5px #FFD700',
              '&:hover': {
                background: 'linear-gradient(45deg, #1a1a1a 0%, #000000 100%)',
                boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)'
              }
            }}
          >
            {'>>> NEW TEXT <<<'}
          </Button>
        </Box>

        {userInput === text && (
          <Paper sx={{ 
            p: 3, 
            mt: 3, 
            textAlign: 'center',
            border: '2px solid #FFD700',
            borderRadius: 0,
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)'
          }}>
            <Typography variant="h5" sx={{ 
              color: '#FFD700', 
              fontFamily: '"Courier New", monospace',
              textShadow: '0 0 10px #FFD700',
              letterSpacing: '2px',
              mb: 1
            }}>
              {'>>> TEST COMPLETE! <<<'}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#50C9CE', 
              fontFamily: '"Courier New", monospace',
              mt: 2
            }}>
              Final WPM: {wpm} | Accuracy: {accuracy}% | Words: {wordsTyped}
            </Typography>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;