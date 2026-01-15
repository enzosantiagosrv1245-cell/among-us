// client/src/components/Tasks/TaskMinigame.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { socketService } from '../../services/SocketService';
import { SoundManager } from '../../utils/SoundManager';
import { Task, TaskType } from '@shared/types';
import './TaskMinigame.scss';

interface TaskMinigameProps {
  task: Task;
}

const TaskMinigame: React.FC<TaskMinigameProps> = ({ task }) => {
  const { setTaskOpen } = useGameStore();
  const [isCompleting, setIsCompleting] = useState(false);
  
  const handleClose = () => {
    setTaskOpen(false);
  };
  
  const handleComplete = () => {
    setIsCompleting(true);
    SoundManager.play('sfx-task-complete');
    
    setTimeout(() => {
      socketService.completeTask(task.id);
      setTaskOpen(false);
    }, 1000);
  };
  
  const handleBombTriggered = (): void => {
    SoundManager.play('sfx-explosion');
    setTaskOpen(false);
  };
  
  const renderTask = () => {
    switch (task.type) {
      case TaskType.FIX_WIRING:
        return (
          <div className="task-content">
            <h2>Consertar Fiação</h2>
            <p>Conecte os fios da mesma cor</p>
            <button onClick={handleComplete}>Completo</button>
          </div>
        );
      case TaskType.SWIPE_CARD:
        return (
          <div className="task-content">
            <h2>Passar Cartão</h2>
            <p>Passe seu cartão pelo leitor</p>
            <button onClick={handleComplete}>Completo</button>
          </div>
        );
      case TaskType.SUBMIT_SCAN:
        return (
          <div className="task-content">
            <h2>Enviar Varredura</h2>
            <p>Fique no escaneador de corpos</p>
            <button onClick={handleComplete}>Completo</button>
          </div>
        );
      case TaskType.DIVERT_POWER:
        return (
          <div className="task-content">
            <h2>Desviar Energia</h2>
            <p>Distribua a energia adequadamente</p>
            <button onClick={handleComplete}>Completo</button>
          </div>
        );
      case TaskType.CHART_COURSE:
        return (
          <div className="task-content">
            <h2>Plotar Rota</h2>
            <p>Navegue até o destino</p>
            <button onClick={handleComplete}>Completo</button>
          </div>
        );
      default:
        return (
          <div className="task-content">
            <h2>{task.type}</h2>
            <p>Tarefa em desenvolvimento...</p>
            <button onClick={handleComplete}>Completo</button>
          </div>
        );
    }
  };
  
  return (
    <motion.div
      className="task-minigame"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="task-minigame__overlay" onClick={handleClose} />
      
      <motion.div
        className="task-minigame__container"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <button className="task-minigame__close" onClick={handleClose}>
          ✕
        </button>
        
        <div className="task-minigame__content">
          {renderTask()}
        </div>
        
        <AnimatePresence>
          {isCompleting && (
            <motion.div
              className="task-minigame__complete-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="task-minigame__complete-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                ✓
              </motion.div>
              <span>TAREFA COMPLETA!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TaskMinigame;
