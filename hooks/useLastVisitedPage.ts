import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LAST_PAGE_KEY = 'voxrt_last_page';

// Pages that should be persisted (exclude detail pages and landing)
const PERSISTABLE_PAGES = ['/explore', '/mint', '/dashboard'];

/**
 * Hook to track and restore the last visited page
 * Automatically saves the current page and provides a function to restore it
 */
export function useLastVisitedPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Save current page to localStorage when it changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Only persist main navigation pages
    if (PERSISTABLE_PAGES.includes(currentPath)) {
      try {
        localStorage.setItem(LAST_PAGE_KEY, currentPath);
      } catch (error) {
        // Silently fail on storage errors
      }
    }
  }, [location.pathname]);

  // Function to restore last visited page
  const restoreLastPage = () => {
    try {
      const lastPage = localStorage.getItem(LAST_PAGE_KEY);
      if (lastPage && PERSISTABLE_PAGES.includes(lastPage)) {
        navigate(lastPage);
        return true;
      }
    } catch (error) {
      // Silently fail
    }
    return false;
  };

  return { restoreLastPage };
}

/**
 * Get the last visited page without using hooks (for initial load)
 */
export function getLastVisitedPage(): string | null {
  try {
    const lastPage = localStorage.getItem(LAST_PAGE_KEY);
    if (lastPage && PERSISTABLE_PAGES.includes(lastPage)) {
      return lastPage;
    }
  } catch (error) {
    // Silently fail
  }
  return null;
}
