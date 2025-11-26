import React from 'react';

const SwarmConfidenceIndicator = ({ confidence = 0, size = 'medium' }) => {
  const getConfidenceLevel = (score) => {
    if (score < 40) return { level: 'low', color: '#ef4444' };
    if (score < 70) return { level: 'medium', color: '#eab308' };
    if (score < 90) return { level: 'high', color: '#00FFBF' };
    return { level: 'optimal', color: '#22c55e' };
  };

  const { level, color } = getConfidenceLevel(confidence);
  
  const sizes = {
    small: { width: 60, stroke: 4 },
    medium: { width: 100, stroke: 8 },
    large: { width: 140, stroke: 10 }
  };

  const { width, stroke } = sizes[size] || sizes.medium;
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = circumference;
  const dashOffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg 
          width={width} 
          height={width} 
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="#013B2B"
            strokeWidth={stroke}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {confidence}%
          </span>
        </div>
      </div>
      
      {/* Confidence level label */}
      <div 
        className="mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
        style={{ backgroundColor: color + '20', color }}
      >
        {level} Confidence
      </div>
    </div>
  );
};

export default SwarmConfidenceIndicator;
