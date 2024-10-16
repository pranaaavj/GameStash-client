import { useEffect, useState } from 'react';

export const useTimer = (initialTime, dependency) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let intervalId =
      time > 0 &&
      setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

    return () => clearInterval(intervalId);
  }, [time, dependency]);

  return time;
};
