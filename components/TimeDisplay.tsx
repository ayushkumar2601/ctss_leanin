import React from 'react';
import { formatRelativeTime, formatExactTime } from '../lib/utils/timeFormat';

interface TimeDisplayProps {
  date: string | Date;
  className?: string;
  showTooltip?: boolean;
}

/**
 * Reusable component for displaying human-readable time with tooltip
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({ 
  date, 
  className = '', 
  showTooltip = true 
}) => {
  const relativeTime = formatRelativeTime(date);
  const exactTime = formatExactTime(date);

  if (!showTooltip) {
    return <span className={className}>{relativeTime}</span>;
  }

  return (
    <span 
      className={`cursor-help ${className}`}
      title={exactTime}
    >
      {relativeTime}
    </span>
  );
};

export default TimeDisplay;
