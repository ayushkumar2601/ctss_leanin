/**
 * Time formatting utilities for human-readable timestamps
 */

/**
 * Format a date as relative time (e.g., "3 minutes ago", "2 hours ago")
 * @param date - Date string or Date object
 * @returns Human-readable relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  // Handle future dates
  if (diffInSeconds < 0) {
    return 'just now';
  }

  // Just now (0-10 seconds)
  if (diffInSeconds < 10) {
    return 'just now';
  }

  // Seconds (10-59 seconds)
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  // Minutes (1-59 minutes)
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }

  // Hours (1-23 hours)
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }

  // Days (1-6 days)
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  // Weeks (1-3 weeks)
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
  }

  // Months (1-11 months)
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }

  // Years
  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
}

/**
 * Format a date as exact timestamp for tooltips
 * @param date - Date string or Date object
 * @returns Formatted exact timestamp (e.g., "Jan 30, 2026, 14:22 UTC")
 */
export function formatExactTime(date: string | Date): string {
  const dateObj = new Date(date);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(dateObj);
}

/**
 * Format a date for activity feed (action-specific)
 * @param date - Date string or Date object
 * @param action - Action type (minted, sold, listed, etc.)
 * @returns Formatted string with action (e.g., "Minted 3 minutes ago")
 */
export function formatActivityTime(date: string | Date, action: string): string {
  const relativeTime = formatRelativeTime(date);
  const actionCapitalized = action.charAt(0).toUpperCase() + action.slice(1);
  return `${actionCapitalized} ${relativeTime}`;
}
