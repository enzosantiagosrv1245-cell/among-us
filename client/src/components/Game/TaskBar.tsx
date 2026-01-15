// client/src/components/Game/TaskBar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import './TaskBar.scss';

interface TaskBarProps {
  completed: number;
  total: number;
}

const TaskBar: React.FC<TaskBarProps> = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <div className="task-bar">
      <div className="task-bar__label">
        TOTAL DE TAREFAS
      </div>
      
      <div className="task-bar__container">
        <div className="task-bar__background">
          <motion.div 
            className="task-bar__fill"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Segment markers */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i}
              className="task-bar__segment"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>
        
        <div className="task-bar__text">
          {completed} / {total}
        </div>
      </div>
    </div>
  );
};

export default TaskBar;