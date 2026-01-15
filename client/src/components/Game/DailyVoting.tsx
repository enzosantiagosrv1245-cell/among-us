// client/src/components/Game/DailyVoting.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { socketService } from '../../services/SocketService';
import { SoundManager } from '../../utils/SoundManager';
import { Player } from '@shared/types';
import { PLAYER_COLORS } from '@shared/constants';
import './DailyVoting.scss';

const DailyVoting: React.FC = () => {
  const { 
    players, 
    dailyVotes, 
    currentDay, 
    settings,
    playerId,
    addDailyVote,
    removeDailyVote
  } = useGameStore();
  
  const [timeLeft, setTimeLeft] = useState(settings.votingTime);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        if (prev <= 10) {
          SoundManager.play('sfx-timer-tick');
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleAutoSubmit = () => {
    if (!hasSubmitted) {
      handleSubmit();
    }
  };
  
  const handleVote = (votedPlayerId: string) => {
    if (hasSubmitted || votedPlayerId === playerId) return;
    
    SoundManager.play('sfx-button-click');
    
    if (dailyVotes.includes(votedPlayerId)) {
      removeDailyVote(votedPlayerId);
    } else if (dailyVotes.length < 3) {
      addDailyVote(votedPlayerId);
    }
  };
  
  const handleSubmit = () => {
    if (dailyVotes.length !== 3) {
      SoundManager.play('sfx-task-fail');
      return;
    }
    
    SoundManager.play('sfx-vote');
    setHasSubmitted(true);
    socketService.submitDailyVote(dailyVotes);
  };
  
  const alivePlayers = Array.from(players.values()).filter(p => p.isAlive);
  
  const getColorHex = (colorId: string): string => {
    return PLAYER_COLORS.find(c => c.id === colorId)?.hex || '#ffffff';
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <motion.div
      className="daily-voting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="daily-voting__overlay" />
      
      <div className="daily-voting__container">
        {/* Header */}
        <div className="daily-voting__header">
          <h1>VOTAÇÃO DIÁRIA</h1>
          <h2>DIA {currentDay}</h2>
          <p className="daily-voting__instruction">
            Escolha <strong>3 jogadores</strong> para fazer as tarefas de hoje
          </p>
        </div>
        
        {/* Timer */}
        <div className={`daily-voting__timer ${timeLeft <= 10 ? 'daily-voting__timer--warning' : ''}`}>
          <span className="daily-voting__timer-icon">⏱️</span>
          <span className="daily-voting__timer-value">{formatTime(timeLeft)}</span>
        </div>
        
        {/* Selected votes indicator */}
        <div className="daily-voting__selected-count">
          <span>Selecionados: </span>
          <div className="daily-voting__vote-dots">
            {[0, 1, 2].map(i => (
              <div 
                key={i}
                className={`daily-voting__vote-dot ${dailyVotes[i] ? 'daily-voting__vote-dot--filled' : ''}`}
                style={dailyVotes[i] ? { 
                  backgroundColor: getColorHex(players.get(dailyVotes[i])?.color || 'white')
                } : {}}
              />
            ))}
          </div>
          <span>{dailyVotes.length}/3</span>
        </div>
        
        {/* Players grid */}
        <div className="daily-voting__players">
          {alivePlayers.map((player, index) => {
            const isSelected = dailyVotes.includes(player.id);
            const isSelf = player.id === playerId;
            const selectionIndex = dailyVotes.indexOf(player.id);
            
            return (
              <motion.div
                key={player.id}
                className={`daily-voting__player ${isSelected ? 'daily-voting__player--selected' : ''} ${isSelf ? 'daily-voting__player--self' : ''}`}
                onClick={() => handleVote(player.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={!isSelf && !hasSubmitted ? { scale: 1.05 } : {}}
                whileTap={!isSelf && !hasSubmitted ? { scale: 0.98 } : {}}
              >
                {/* Selection order badge */}
                {isSelected && (
                  <div className="daily-voting__order-badge">
                    {selectionIndex + 1}
                  </div>
                )}
                
                {/* Player avatar */}
                <div 
                  className="daily-voting__player-avatar"
                  style={{ borderColor: getColorHex(player.color) }}
                >
                  <img 
                    src={`/assets/sprites/characters/${player.color}/avatar.png`} 
                    alt={player.name}
                  />
                </div>
                
                {/* Player name */}
                <span className="daily-voting__player-name">
                  {player.name}
                  {isSelf && <span className="daily-voting__you-badge">VOCÊ</span>}
                </span>
                
                {/* Selection indicator */}
                <div 
                  className="daily-voting__player-indicator"
                  style={{ backgroundColor: isSelected ? getColorHex(player.color) : 'transparent' }}
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* Submit button */}
        <motion.button
          className={`daily-voting__submit ${dailyVotes.length === 3 ? 'daily-voting__submit--ready' : ''}`}
          onClick={handleSubmit}
          disabled={dailyVotes.length !== 3 || hasSubmitted}
          whileHover={dailyVotes.length === 3 && !hasSubmitted ? { scale: 1.05 } : {}}
          whileTap={dailyVotes.length === 3 && !hasSubmitted ? { scale: 0.95 } : {}}
        >
          {hasSubmitted ? 'AGUARDANDO OUTROS...' : 
           dailyVotes.length === 3 ? 'CONFIRMAR VOTOS' : 
           `SELECIONE ${3 - dailyVotes.length} JOGADOR${3 - dailyVotes.length > 1 ? 'ES' : ''}`}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DailyVoting;