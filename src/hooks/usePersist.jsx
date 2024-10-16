import { useEffect, useMemo, useState } from 'react';

export const usePersist = (name, value, id) => {
  const initialValue = useMemo(() => {
    const stateFromStorage = localStorage.getItem(`${name}: ${id}`);
    if (stateFromStorage) {
      return JSON.parse(stateFromStorage);
    }
    return value;
  }, []);

  const [state, setState] = useState(initialValue);

  useEffect(() => {
    const stringifiedState = JSON.stringify(state);
    localStorage.setItem(`${name}: ${id}`, stringifiedState);
  }, [state]);

  return [state, setState];
};
