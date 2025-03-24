import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnalogClock from './AnalogClock';
import DevLanguageSwitcher from './DevLanguageSwitcher';

interface Level {
  name: string;
  description: string;
  timeStep: number;
  points: number;
  formatTime: (hours: number, minutes: number) => string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f6f9fc 0%, #eef4f9 100%);
  font-family: 'Quicksand', 'Comic Sans MS', 'Arial', sans-serif;
  overflow-x: hidden;
  padding: 1rem;
`;

const Title = styled.h1`
  color: #2d3748;
  margin: 1rem 0;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  
  span {
    background: linear-gradient(45deg, #4a90e2, #7e57c2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 95%;
  max-width: 600px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LevelBadge = styled(motion.div)`
  background: linear-gradient(135deg, #4a90e2, #7e57c2);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 12px rgba(126, 87, 194, 0.2);
  letter-spacing: 0.5px;
`;

const ClockContainer = styled.div`
  margin: 0.5rem 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AnswerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  width: 100%;
  max-width: 500px;
  margin-top: 1.2rem;
  padding: 0.5rem;
`;

const AnswerButton = styled(motion.button)`
  padding: 1.2rem;
  font-size: 1.3rem;
  font-family: 'Quicksand', 'Comic Sans MS', 'Arial', sans-serif;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  background: white;
  color: #2d3748;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4a90e2, #7e57c2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(74, 144, 226, 0.2);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 1rem;
  }
`;

const Instructions = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
  max-width: 500px;
  text-align: center;
  backdrop-filter: blur(10px);

  h3 {
    color: #2d3748;
    margin-bottom: 1rem;
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(45deg, #4a90e2, #7e57c2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: #4a5568;
    margin-bottom: 1.2rem;
    font-size: 1.2rem;
    line-height: 1.6;
  }

  button {
    margin-top: 1rem;
    font-size: 1.2rem;
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #4a90e2, #7e57c2);
    color: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(126, 87, 194, 0.2);
    transition: all 0.3s ease;
    font-weight: 600;
    font-family: 'Quicksand', 'Comic Sans MS', 'Arial', sans-serif;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(126, 87, 194, 0.3);
    }
  }
`;

const HorseCharacter = styled.div`
  position: fixed;
  bottom: 30px;
  right: 20px;
  font-size: 4rem;
  filter: drop-shadow(2px 2px 2px rgba(139, 69, 19, 0.3));
  z-index: 100;
`;

const RaceTrack = styled.div`
  width: 100%;
  height: 60px;
  background: linear-gradient(to right, #f0f5fa, #e6eef7);
  border-radius: 30px;
  margin: 30px 0;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(74, 144, 226, 0.2);
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: repeating-linear-gradient(
      90deg,
      rgba(74, 144, 226, 0.2),
      rgba(74, 144, 226, 0.2) 20px,
      transparent 20px,
      transparent 40px
    );
    transform: translateY(-50%);
  }
`;

const HorseProgress = styled(motion.div)`
  position: absolute;
  left: -10px;
  top: -10%;
  transform: translateY(-50%);
  font-size: 42px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  z-index: 2;

  &::after {
    content: '';
    position: absolute;
    left: 100%;
    width: 80px;
    height: 60px;
    background: linear-gradient(90deg, 
      rgba(240, 245, 250, 0.8),
      rgba(240, 245, 250, 0.4),
      transparent
    );
    pointer-events: none;
  }
`;

const ProgressText = styled.div`
  position: absolute;
  top: -35px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
`;

const SpeechBubble = styled(motion.div)`
  position: fixed;
  bottom: 120px;
  right: 100px;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  font-size: 1.4rem;
  color: #2d3748;
  max-width: 280px;
  text-align: center;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-weight: 600;
  line-height: 1.4;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HorseImage = styled.div<{ state: 'idle' | 'happy' | 'encouraging' | 'celebrating' }>`
  font-size: 48px;
  transition: transform 0.3s ease;
  transform: ${props => {
    switch (props.state) {
      case 'happy':
        return 'scale(1.1)';
      case 'encouraging':
        return 'scale(0.9)';
      default:
        return 'scale(1)';
    }
  }};
`;

const LevelUpOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 55, 72, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const LevelUpContent = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  margin: 0 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LevelUpTitle = styled.h2`
  background: linear-gradient(45deg, #4a90e2, #7e57c2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-weight: 700;
`;

const LevelUpMessage = styled.p`
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #4a5568;
  line-height: 1.5;
  font-weight: 500;
`;

const NextButton = styled.button`
  background: linear-gradient(135deg, #4a90e2, #7e57c2);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 16px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Quicksand', 'Comic Sans MS', 'Arial', sans-serif;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(126, 87, 194, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(126, 87, 194, 0.3);
  }
`;

const ClockGame: React.FC = () => {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentTime, setCurrentTime] = useState({ hours: 12, minutes: 0 });
  const [answers, setAnswers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const questionsToNextLevel = 5;
  const totalLevels = 8;
  const correctSound = React.useRef<HTMLAudioElement | null>(null);
  const wrongSound = React.useRef<HTMLAudioElement | null>(null);
  const levelUpSound = React.useRef<HTMLAudioElement | null>(null);
  const [horseState, setHorseState] = useState<'idle' | 'happy' | 'encouraging' | 'celebrating'>('idle');
  const [horseMessage, setHorseMessage] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    // Initialize audio elements
    const audioPath = window.electron?.getResourcePath?.() || '';
    correctSound.current = new Audio(audioPath + 'correct.mp3');
    wrongSound.current = new Audio(audioPath + 'wrong.mp3');
    levelUpSound.current = new Audio(audioPath + 'level-up.mp3');
  }, []);

  useEffect(() => {
    if (horseState !== 'idle') {
      const timer = setTimeout(() => setHorseState('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [horseState]);

  const levels: Level[] = React.useMemo(() => [
    { 
      name: t('levels.level1.name'), 
      description: t('levels.level1.description'), 
      timeStep: 60, 
      points: 10,
      formatTime: (h: number) => `${h} ${t('clock.hours')}`.toLowerCase()
    },
    { 
      name: t('levels.level2.name'), 
      description: t('levels.level2.description'), 
      timeStep: 30, 
      points: 20,
      formatTime: (hours: number, minutes: number) => (minutes === 30 
        ? `${t('clock.half')} ${hours === 12 ? 1 : hours + 1}`
        : `${hours} ${t('clock.hours')}`).toLowerCase()
    },
    { 
      name: t('levels.level3.name'), 
      description: t('levels.level3.description'), 
      timeStep: 15, 
      points: 30,
      formatTime: (h: number, m: number) => {
        if (m === 0) return `${h} ${t('clock.hours')}`.toLowerCase();
        if (m === 15) return `${t('clock.quarter')} ${t('clock.past')} ${h}`.toLowerCase();
        if (m === 30) return `${t('clock.half')} ${h === 12 ? 1 : h + 1}`.toLowerCase();
        if (m === 45) return `${t('clock.quarter')} ${t('clock.to')} ${h === 12 ? 1 : h + 1}`.toLowerCase();
        return `${h}:${m.toString().padStart(2, '0')}`.toLowerCase();
      }
    },
    { 
      name: t('levels.level4.name'), 
      description: t('levels.level4.description'), 
      timeStep: 5, 
      points: 40,
      formatTime: (h: number, m: number) => {
        const nextHour = h === 12 ? 1 : h + 1;
        let result = '';

        if (m === 0) result = `${h} ${t('clock.hours')}`;
        else if (m === 15) result = `${t('clock.quarter')} ${t('clock.past')} ${h}`;
        else if (m === 30) result = `${t('clock.half')} ${nextHour}`;
        else if (m === 45) result = `${t('clock.quarter')} ${t('clock.to')} ${nextHour}`;
        // Special handling for Dutch time expressions
        else if (t('clock.language') === 'nl') {
          if (m < 30) {
            if (m === 10) result = `tien over ${h}`;
            else if (m === 20) result = `tien voor half ${nextHour}`;
            else if (m === 25) result = `vijf voor half ${nextHour}`;
            else result = `${m} ${t('clock.past')} ${h}`;
          } else {
            const minutesToNext = 60 - m;
            if (m === 35) result = `vijf over half ${nextHour}`;
            else if (m === 40) result = `tien over half ${nextHour}`;
            else if (minutesToNext === 5) result = `vijf voor ${nextHour}`;
            else if (minutesToNext === 10) result = `tien voor ${nextHour}`;
            else if (minutesToNext === 15) result = `${t('clock.quarter')} ${t('clock.to')} ${nextHour}`;
            else result = `${minutesToNext} ${t('clock.to')} ${nextHour}`;
          }
        }
        // German uses similar expressions to Dutch for some times
        else if (t('clock.language') === 'de') {
          if (m < 30) {
            if (m === 15) result = `viertel nach ${h}`;
            else result = `${m} nach ${h}`;
          } else {
            const minutesToNext = 60 - m;
            if (m === 30) result = `halb ${nextHour}`;
            else if (m === 45) result = `viertel vor ${nextHour}`;
            else result = `${minutesToNext} vor ${nextHour}`;
          }
        }
        // French uses specific expressions
        else if (t('clock.language') === 'fr') {
          if (m === 0) result = `${h} heures`;
          else if (m === 30) result = `${h} heures et demie`;
          else if (m === 15) result = `${h} heures et quart`;
          else if (m === 45) result = `${h} heures moins le quart`;
          else if (m < 30) result = `${h} heures ${m}`;
          else result = `${nextHour} heures moins ${60 - m}`;
        }
        // Spanish uses specific expressions
        else if (t('clock.language') === 'es') {
          if (m === 0) result = `${h} en punto`;
          else if (m === 30) result = `${h} y media`;
          else if (m === 15) result = `${h} y cuarto`;
          else if (m === 45) result = `${nextHour} menos cuarto`;
          else if (m < 30) result = `${h} y ${m}`;
          else result = `${nextHour} menos ${60 - m}`;
        }
        // Default English format
        else {
          if (m < 30) result = `${m} ${t('clock.past')} ${h}`;
          else result = `${60 - m} ${t('clock.to')} ${nextHour}`;
        }

        return result.toLowerCase();
      }
    },
  ], [t]);

  const generateLevelConfig = (levelNumber: number): Level => {
    const baseLevel = Math.min(3, Math.floor(levelNumber / 4)); // Cycle through base levels 0-3
    const difficulty = Math.floor(levelNumber / 4) + 1; // Increases every 4 levels
    const basePoints = levels[baseLevel].points;
    
    return {
      name: `${t('levels.level1.name').split(' ')[0]} ${levelNumber + 1}`,
      description: levels[baseLevel].description,
      timeStep: levels[baseLevel].timeStep,
      points: basePoints * difficulty,
      formatTime: levels[3].formatTime // Always use level 4's formatTime for advanced levels
    };
  };

  const getCurrentLevel = () => {
    if (currentLevel < 4) {
      return levels[currentLevel];
    }
    return generateLevelConfig(currentLevel);
  };

  const startGame = () => {
    setGameStarted(true);
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * (60 / getCurrentLevel().timeStep)) * getCurrentLevel().timeStep;
    setCurrentTime({ hours, minutes });
    setAnswers(generateAnswers(hours, minutes));
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === getCurrentLevel().formatTime(currentTime.hours, currentTime.minutes);
    const isLevelUp = questionsAnswered + 1 >= questionsToNextLevel;

    if (isCorrect) {
      correctSound.current?.play();
      setHorseState('happy');
      setHorseMessage(t('correct'));
      
      // Generate new question immediately
      const hours = Math.floor(Math.random() * 12) + 1;
      const minutes = Math.floor(Math.random() * (60 / getCurrentLevel().timeStep)) * getCurrentLevel().timeStep;
      setCurrentTime({ hours, minutes });
      setAnswers(generateAnswers(hours, minutes));
    } else {
      wrongSound.current?.play();
      setHorseState('encouraging');
      setHorseMessage(t('incorrect'));
    }

    setQuestionsAnswered(prev => prev + 1);

    if (isLevelUp) {
      levelUpSound.current?.play();
      setShowLevelUp(true);
      setHorseState('happy');
      setHorseMessage(t('levelUp'));
    } else {
      setTimeout(() => {
        setHorseState('idle');
        setHorseMessage('');
      }, 2000);
    }
  };

  const generateAnswers = (correctHours: number, correctMinutes: number) => {
    const currentLevelConfig = getCurrentLevel();
    const correctAnswer = currentLevelConfig.formatTime(correctHours, correctMinutes);
    const wrongAnswers = new Set<string>();

    while (wrongAnswers.size < 3) {
      let h = Math.floor(Math.random() * 12) + 1;
      let m = Math.floor(Math.random() * (60 / currentLevelConfig.timeStep)) * currentLevelConfig.timeStep;
      
      const wrongAnswer = currentLevelConfig.formatTime(h, m);
      if (wrongAnswer !== correctAnswer) {
        wrongAnswers.add(wrongAnswer);
      }
    }

    const allAnswers = [correctAnswer, ...wrongAnswers];
    return allAnswers.sort(() => Math.random() - 0.5);
  };

  const calculateTotalProgress = () => {
    const completedLevelsProgress = currentLevel * questionsToNextLevel;
    const currentLevelProgress = questionsAnswered;
    const totalQuestions = totalLevels * questionsToNextLevel;
    return ((completedLevelsProgress + currentLevelProgress) / totalQuestions) * 100;
  };

  const getHorseEmoji = () => {
    switch (horseState) {
      case 'happy': return '🦄';
      case 'encouraging': return '🐴';
      case 'celebrating': return '🎠';
      default: return '🐴';
    }
  };

  const handleNextLevel = () => {
    setShowLevelUp(false);
    setCurrentLevel(prev => prev + 1);
    setQuestionsAnswered(0);
    setHorseState('idle');
    setHorseMessage('');
  };

  return (
    <Container>
      <Title>
        <span>🐴 {t('app.title')}</span>
      </Title>
      <GameContainer>
        <LevelBadge
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getCurrentLevel().name}
        </LevelBadge>
        {!gameStarted ? (
          <Instructions
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{t('settings.title')}</h3>
            <button onClick={startGame}>{t('game.start')}</button>
          </Instructions>
        ) : (
          <>
            <ClockContainer>
              <AnalogClock time={currentTime} />
            </ClockContainer>
            <AnswerGrid>
              {answers.map((answer, index) => (
                <AnswerButton
                  key={index}
                  onClick={() => handleAnswer(answer)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {answer}
                </AnswerButton>
              ))}
            </AnswerGrid>
          </>
        )}
        <RaceTrack>
          <ProgressText>
            {t('progress.text', { 
              current: questionsAnswered, 
              total: questionsToNextLevel, 
              level: currentLevel + 1 
            })}
          </ProgressText>
          <HorseProgress
            initial={{ x: '-5%' }}
            animate={{ x: `${Math.min(calculateTotalProgress(), 93)}%` }}
            transition={{ 
              type: 'spring',
              stiffness: 100,
              damping: 15,
              mass: 1
            }}
          >
            {horseState === 'happy' ? '🦄' : '🐎'}
          </HorseProgress>
        </RaceTrack>
      </GameContainer>
      <HorseCharacter>
        <HorseImage state={horseState}>
          {getHorseEmoji()}
        </HorseImage>
      </HorseCharacter>
      {horseMessage && (
        <SpeechBubble
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          {horseMessage}
        </SpeechBubble>
      )}
      {showLevelUp && (
        <LevelUpOverlay>
          <LevelUpContent>
            <LevelUpTitle>{t('levelUp.title')}</LevelUpTitle>
            <LevelUpMessage>{t('levelUp.message', { level: currentLevel + 2 })}</LevelUpMessage>
            <NextButton onClick={handleNextLevel}>{t('levelUp.continue')}</NextButton>
          </LevelUpContent>
        </LevelUpOverlay>
      )}
      <DevLanguageSwitcher />
    </Container>
  );
};

export default ClockGame; 