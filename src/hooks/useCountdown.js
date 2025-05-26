// hooks/useCountdown.js
import { useState, useEffect } from 'react';

function useCountdown(targetTimestamp) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetTimestamp - now);
      setSecondsLeft(Math.floor(difference / 1000));
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [targetTimestamp]);

  useEffect(() => {
    const days = Math.floor(secondsLeft / (60 * 60 * 24));
    const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
    const seconds = secondsLeft % 60;

    const formattedDays = days > 0 ? `${days} วัน ` : '';
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    setTimeDisplay(`${formattedDays}${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
  }, [secondsLeft]);

  return timeDisplay;
}

export default useCountdown;