import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#50C9CE' },
    background: { default: '#2E382E', paper: '#2E382E' },
    text: { primary: '#50C9CE' }
  }
});

const textOptions = [
  "The quick brown fox jumps over the lazy dog. This is a sample text for typing practice. Keep typing to improve your speed and accuracy.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
  "To be or not to be, that is the question. Whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
  "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys house. The wife had discovered that the husband was carrying on an intrigue."
];

function App() {
  const [textIndex, setTextIndex] = useState(0);
  const [text, setText] = useState(textOptions[0]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    if (userInput.length > 0) {
      const minutes = timeElapsed / 60000;
      const typedWords = userInput.trim().split(' ').length;
      setWordsTyped(typedWords);
      
      if (minutes > 0) {
        setWpm(Math.round(typedWords / minutes));
      }

      let correctChars = 0;
      let errorCount = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === text[i]) {
          correctChars++;
        } else {
          errorCount++;
        }
      }
      const accuracyPercent = Math.round((correctChars / userInput.length) * 100);
      setAccuracy(accuracyPercent);
      setErrors(errorCount);
    }

      if (userInput === text) {
        setIsActive(false);
      }

  }, [userInput, timeElapsed, text, startTime]);

  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setIsActive(false);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setWordsTyped(0);
    setErrors(0);
    inputRef.current?.focus();
  };

  const handleTextChange = (index) => {
    setText(textOptions[index]);
    setTextIndex(index);
    handleReset();
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= userInput.length + 1 && newValue.length <= text.length) {
      setUserInput(newValue);
    }
  };

  const getCurrentWordIndex = () => {
    return userInput.split(' ').length - 1;
  };

  const renderedText = useMemo(() => {
    const words = text.split(' ');
    const currentWordIndex = getCurrentWordIndex();
    
    return words.map((word, wordIndex) => {
      const wordStart = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0);
      const isCurrentWord = wordIndex === currentWordIndex;
      
      return (
        <span key={wordIndex} style={{ backgroundColor: isCurrentWord ? 'rgba(80, 201, 206, 0.1)' : 'transparent', padding: '2px' }}>
          {word.split('').map((char, charIndex) => {
            const globalIndex = wordStart + charIndex;
            let color = '#646669';
            
            if (globalIndex < userInput.length) {
              color = userInput[globalIndex] === char ? '#d1d0c5' : '#ca4754';
            } else if (globalIndex === userInput.length) {
              color = '#50C9CE';
            }
            
            return (
              <span key={charIndex} style={{ 
                color, 
                backgroundColor: globalIndex === userInput.length ? '#50C9CE' : 'transparent',
                opacity: globalIndex === userInput.length ? 0.3 : 1
              }}>
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span style={{ color: wordStart + word.length < userInput.length ? 
              (userInput[wordStart + word.length] === ' ' ? '#d1d0c5' : '#ca4754') : '#646669' }}> </span>
          )}
        </span>
      );
    });
  }, [text, userInput]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#50C9CE' }}>
          MonkeyType Clone
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
          {textOptions.map((_, index) => (
            <Button
              key={index}
              variant={textIndex === index ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleTextChange(index)}
              disabled={userInput.length > 0}
            >
              Text {index + 1}
            </Button>
          ))}
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">WPM</Typography>
              <Typography variant="h4">{wpm}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">Accuracy</Typography>
              <Typography variant="h4">{accuracy}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">Words</Typography>
              <Typography variant="h4">{wordsTyped}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">Errors</Typography>
              <Typography variant="h4">{errors}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }} onClick={() => inputRef.current?.focus()}>
          <Typography variant="h6" sx={{ fontSize: '1.5rem', lineHeight: 1.8, fontFamily: 'monospace', cursor: 'text' }}>
            {renderedText}
          </Typography>
          <Box sx={{ mt: 2, height: 4, bgcolor: '#646669', borderRadius: 2 }}>
            <Box sx={{ height: '100%', bgcolor: 'primary.main', borderRadius: 2, width: `${(userInput.length / text.length) * 100}%`, transition: 'width 0.2s' }} />
          </Box>
        </Paper>

        <TextField
          fullWidth
          multiline
          rows={4}
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          variant="outlined"
          sx={{ mb: 2 }}
          disabled={userInput === text}
          ref={inputRef}
          autoFocus
          onBlur={() => setTimeout(() => inputRef.current?.focus(), 100)}
        />

        <Box textAlign="center" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={handleReset} size="large">
            Reset Test
          </Button>
          <Button variant="outlined" onClick={() => handleTextChange(Math.floor(Math.random() * textOptions.length))} size="large" disabled={userInput.length > 0}>
            Random Text
          </Button>
        </Box>

        {userInput === text && (
          <Paper sx={{ p: 2, mt: 3, textAlign: 'center', bgcolor: 'success.dark' }}>
            <Typography variant="h5">Test Complete!</Typography>
            <Typography>Final WPM: {wpm} | Accuracy: {accuracy}% | Words: {wordsTyped} | Errors: {errors}</Typography>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;