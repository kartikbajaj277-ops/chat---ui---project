import { useEffect, useState } from 'react';

// Returns `value` only after it stops changing for `delay` ms. Cleanup cancels the pending timer.
export default function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
