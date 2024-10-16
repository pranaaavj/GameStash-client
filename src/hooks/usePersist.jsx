import { useEffect, useMemo, useState } from 'react';

export const usePersist = (value, id) => {
  const initialValue = useMemo(() => {
    const stateFromStorage = localStorage.getItem(`state: ${id}`);

    if (stateFromStorage) {
      return JSON.parse(stateFromStorage);
    }

    return value;
  }, [value, id]);

  const [state, setState] = useState(initialValue);

  useEffect(() => {
    const stringifiedState = JSON.stringify(state);

    localStorage.setItem(`state: ${id}`, stringifiedState);
  }, [state, id]);

  return [state, setState];
};
