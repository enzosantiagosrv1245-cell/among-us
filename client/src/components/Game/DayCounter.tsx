// client/src/components/Game/DayCounter.tsx
import React from 'react';
import { motion } from 'framer-motion';
import './DayCounter.scss';

interface DayCounterProps {
  currentDay: number;
  totalDays: number;
}

const DayCounter: React.FC<DayCounterProps> = ({ currentDay, totalDays }) => {
  return (
    <motion.div 
      className="day-counter"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <div className="day-counter__icon">📅</div>
      <div className="day-counter__content">
        <span className="day-counter__label">DIA</span>
        <span className="day-counter__value">
          <motion.span
            key={currentDay}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            {currentDay}
          </motion.span>
          <span className="day-counter__separator">/</span>
          <span className="day-counter__total">{totalDays}</span>
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="day-counter__progress">
        <div 
          className="day-counter__progress-fill"
          style={{ width: `${(currentDay / totalDays) * 100}%` }}
        />
      </div>
    </motion.div>
  );
};

export default DayCounter;