import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

export const useAutoLogout = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (isAuthenticated) {
        logout();
        alert('You have been logged out due to inactivity.');
      }
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Events to track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Reset timer on any user activity
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);
};
