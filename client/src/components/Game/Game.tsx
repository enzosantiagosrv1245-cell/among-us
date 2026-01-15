// client/src/components/Game/Game.tsx
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GamePhase } from '@shared/types';
import { gameConfig } from '../../game/config';
import GameUI from './GameUI';
import RoleReveal from './RoleReveal';
import DailyVoting from './DailyVoting';
import MeetingUI from './MeetingUI';
import EjectionScreen from './EjectionScreen';
import GameOverScreen from './GameOverScreen';
import TaskMinigame from '../Tasks/TaskMinigame';
import './Game.scss';

interface GameProps {
  onGameEnd: () => void;
}

const Game: React.FC<GameProps> = ({ onGameEnd }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const { phase, isTaskOpen, currentTask, playerRole, eliminatedPlayer, gameResult } = useGameStore();
  const [showRoleReveal, setShowRoleReveal] = useState(true);
  
  useEffect(() => {
    if (gameContainerRef.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        ...gameConfig,
        parent: gameContainerRef.current
      };
      
      gameRef.current = new Phaser.Game(config);
    }
    
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (phase === GamePhase.ROLE_REVEAL) {
      setShowRoleReveal(true);
      // Auto-hide after animation
      const timer = setTimeout(() => {
        setShowRoleReveal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [phase]);
  
  const handleRoleRevealComplete = () => {
    setShowRoleReveal(false);
  };
  
  return (
    <motion.div 
      className="game"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Phaser Game Container */}
      <div ref={gameContainerRef} className="game__container" />
      
      {/* Game UI Overlay */}
      <GameUI />
      
      {/* Role Reveal */}
      <AnimatePresence>
        {showRoleReveal && playerRole && (
          <RoleReveal 
            role={playerRole} 
            onComplete={handleRoleRevealComplete}
          />
        )}
      </AnimatePresence>
      
      {/* Daily Voting Phase */}
      <AnimatePresence>
        {phase === GamePhase.DAILY_VOTING && (
          <DailyVoting />
        )}
      </AnimatePresence>
      
      {/* Emergency Meeting / Body Report */}
      <AnimatePresence>
        {(phase === GamePhase.EMERGENCY_MEETING || phase === GamePhase.ELIMINATION_VOTING) && (
          <MeetingUI />
        )}
      </AnimatePresence>
      
      {/* Ejection Screen */}
      <AnimatePresence>
        {phase === GamePhase.EJECTION && eliminatedPlayer && (
          <EjectionScreen 
            eliminatedPlayer={eliminatedPlayer}
            wasImpostor={eliminatedPlayer.role === 'IMPOSTOR'}
            onComplete={() => {}} 
          />
        )}
      </AnimatePresence>
      
      {/* Task Minigame */}
      <AnimatePresence>
        {isTaskOpen && currentTask && (
          <TaskMinigame task={currentTask} />
        )}
      </AnimatePresence>
      
      {/* Game Over Screen */}
      <AnimatePresence>
        {phase === GamePhase.GAME_OVER && gameResult && (
          <GameOverScreen 
            isImpostorWin={gameResult.winner === 'IMPOSTOR'}
            winCondition={gameResult.reason}
            impostors={[]}
            survivors={[]}
            onBack={onGameEnd}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Game;