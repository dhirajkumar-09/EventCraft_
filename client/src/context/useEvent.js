import { useContext, createContext } from 'react';

export const EventContext = createContext();

/**
 * Accesses EventCraft AI master celebration context
 * @returns {Object} Event context state and actions
 */
export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}

export default useEvent;
