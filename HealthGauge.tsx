import React from 'react';

interface HealthGaugeProps {
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  status?: string;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({ score, size = 'md', status }) => {
  if (score === undefined || score === null) {
    return (
      <div className="flex flex-col items-center justify-center p-3">
        <span className="text-xs text-gray-400">No Data</span>
      </div>
    );
  }

  const roundedScore = Math.round(score * 10) / 10;
  
  let colorClass = 'text-green-600 stroke-green-600';
  let badgeBg = 'bg-green-50 text-green-700 border-green-200';

  if (roundedScore < 40) {
    colorClass = 'text-red-600 stroke-red-600';
    badgeBg = 'bg-red-50 text-red-700 border-red-200';
  } else if (roundedScore < 60) {
    colorClass = 'text-amber-500 stroke-amber-500';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (roundedScore < 80) {
    colorClass = 'text-blue-600 stroke-blue-600';
    badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  const dimensions = {
    sm: { size: 64, stroke: 6, text: 'text-sm font-bold', label: 'text-[9px]' },
    md: { size: 96, stroke: 8, text: 'text-xl font-bold', label: 'text-xs' },
    lg: { size: 130, stroke: 10, text: 'text-3xl font-bold', label: 'text-xs' }
  }[size];

  const radius = (dimensions.size - dimensions.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roundedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90 transition-all duration-500"
        >
          {/* Background Circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            className="stroke-gray-200"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-700 ease-out`}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`${dimensions.text} text-gray-900`}>
            {roundedScore}
          </span>
          <span className={`${dimensions.label} text-gray-500`}>Health</span>
        </div>
      </div>

      {status && (
        <span className={`mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full border ${badgeBg}`}>
          {status}
        </span>
      )}
    </div>
  );
};
