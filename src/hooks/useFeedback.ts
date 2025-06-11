import { useCallback, useEffect, useRef, useState } from 'react';

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showFeedback = useCallback((message: string) => {
    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setFeedback(message);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setFeedback(null);
      timeoutRef.current = null;
    }, 2000);
  }, []); // No dependencies - this prevents the useCallback from recreating

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { feedback, showFeedback };
};
