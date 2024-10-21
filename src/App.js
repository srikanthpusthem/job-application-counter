import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './App.css';

const App = () => {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(10);
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState(null);
  const [isMilestone, setIsMilestone] = useState(false);

  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem('applicationCount'), 10);
    const storedGoal = parseInt(localStorage.getItem('goal'), 10);
    const storedStreak = parseInt(localStorage.getItem('streak'), 10);
    const storedDate = localStorage.getItem('lastDate');

    if (!isNaN(storedCount)) setCount(storedCount);
    if (!isNaN(storedGoal)) setGoal(storedGoal);
    if (!isNaN(storedStreak)) setStreak(storedStreak);
    if (storedDate) setLastDate(new Date(storedDate));

    updateStreak();
  }, []);

  useEffect(() => {
    if ([Math.ceil(goal * 0.25), Math.ceil(goal * 0.5), Math.ceil(goal * 0.75), goal].includes(count)) {
      setIsMilestone(true);
      setTimeout(() => setIsMilestone(false), 2000);
    }
  }, [count, goal]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('applicationCount', newCount);
    updateStreak();
  };

  const handleReset = () => {
    setCount(0);
    localStorage.setItem('applicationCount', 0);
  };

  const handleGoalChange = (event) => {
    const newGoal = parseInt(event.target.value, 10);
    setGoal(newGoal);
    localStorage.setItem('goal', newGoal);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (lastDate === today) return;

    if (lastDate !== today) {
      setStreak(streak + 1);
      setLastDate(today);
      localStorage.setItem('lastDate', today);
      localStorage.setItem('streak', streak + 1);
    }
  };

  const getPraiseMessage = (count) => {
    if (count >= goal) return `Amazing! You've reached your goal of ${goal} applications!`;
    if (count >= Math.ceil(goal * 0.75)) return `Great job! You're 75% there!`;
    if (count >= Math.ceil(goal * 0.5)) return `Keep going! You're halfway to your goal!`;
    if (count >= Math.ceil(goal * 0.25)) return `Good start! You've hit 25% of your goal!`;
    return 'Start applying!';
  };

  const buttonAnimation = useSpring({
    from: { transform: 'scale(1)' },
    to: { transform: isMilestone ? 'scale(1.1)' : 'scale(1)' },
    config: { tension: 180, friction: 12 },
  });

  const ribbonsAnimation = useSpring({
    opacity: isMilestone ? 1 : 0,
    transform: isMilestone ? 'translateY(0)' : 'translateY(-20px)',
    config: { duration: 500 },
  });

  return (
    <div className="App">
      <div className="counter-box">
        <h1>Job Application Tracker</h1>
        <label>
          Set your goal:
          <input type="number" value={goal} onChange={handleGoalChange} />
        </label>
        <animated.div style={ribbonsAnimation} className="ribbons">
          🎉🎉🎉
        </animated.div>
        <animated.button style={buttonAnimation} className="counter-button" onClick={handleIncrement}>
          {count === 0 ? 'Click' : count}
        </animated.button>
        <p>{getPraiseMessage(count)}</p>
        <p>Current streak: {streak} day{streak !== 1 ? 's' : ''}</p>
        <button className="reset-button" onClick={handleReset}>
          <img src="../reset-icon.png" alt="Reset" className="reset-icon" />
        </button>
      </div>
    </div>
  );
};

export default App;
