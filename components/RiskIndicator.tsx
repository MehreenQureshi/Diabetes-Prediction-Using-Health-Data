
import React from 'react';
import { RiskLevel } from '../types';

interface RiskIndicatorProps {
  risk: RiskLevel;
}

const riskStyles = {
  [RiskLevel.Low]: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-500',
  },
  [RiskLevel.Medium]: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/50',
    text: 'text-yellow-800 dark:text-yellow-200',
    border: 'border-yellow-500',
  },
  [RiskLevel.High]: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-500',
  },
};

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ risk }) => {
  const styles = riskStyles[risk];

  return (
    <div className={`p-4 rounded-lg text-center border-l-4 ${styles.bg} ${styles.border}`}>
      <p className={`text-xl font-bold ${styles.text}`}>{risk}</p>
    </div>
  );
};

export default RiskIndicator;
