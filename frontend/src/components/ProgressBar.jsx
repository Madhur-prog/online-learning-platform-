import React from 'react';

const ProgressBar = ({ progress = 0, size = 'md', showLabel = true, labelPrefix = '' }) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-600">
          <span>{labelPrefix ? `${labelPrefix}: ` : ''}{clampedProgress}% Complete</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
