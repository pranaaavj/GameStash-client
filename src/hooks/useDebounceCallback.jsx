import { useRef, useCallback } from 'react';
import { debounce } from '@/utils';

export function useDebouncedCallback(callback, delay) {
  const debouncedCallback = useRef(debounce(callback, delay));

  return useCallback((...args) => {
    debouncedCallback.current(...args);
  }, []);
}
