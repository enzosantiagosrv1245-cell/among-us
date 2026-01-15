// client/src/components/Game/MeetingUI.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { socketService } from '../../services/SocketService';
import { SoundManager } from '../../utils/SoundManager';
import { Player, GamePhase } from '@shared/types';
import { PLAYER_COLORS } from '@shared/constants';
import './MeetingUI.scss';

const MeetingUI: React.FC = () => {
  const {
    players,
    playerId,
    phase,
    eliminationVote,
    setEliminationVote,
    settings,
    messages
  } = useGameStore();
  
  const [discussionTime, setDiscussionTime] = useState(settings.discussionTime);
  const [votingTime, setVotingTime] = useState(settings.votingTime);
  const [chatMessage, setChatMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const isDiscussion = phase === GamePhase.EMERGENCY_MEETING && discussionTime > 0;
  const isVoting = phase === GamePhase.ELIMINATION_VOTING || discussionTime === 0;
  
  useEffect(() => {
    SoundManager.playMusic('music-meeting');
    SoundManager.play('sfx-emergency');
    
    return () => {
      SoundManager.stopMusic();
    };
  }, []);
  
  useEffect(() => {
    // Discussion timer
    if (discussionTime > 0) {
      const timer = setInterval(() => {
        setDiscussionTime(prev => {
          if (prev <= 1) {
            SoundManager.play('sfx-timer-end');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [discussionTime]);
  
  useEffect(() => {
    // Voting timer
    if (!isDiscussion && votingTime > 0) {
      const timer = setInterval(() => {
        setVotingTime(prev => {
          if (prev <= 1) {
            handleAutoVote();
            return 0;
          }
          if (prev <= 10) {
            SoundManager.play('sfx-timer-tick');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isDiscussion, votingTime]);
  
  useEffect(() => {
    // Auto-scroll chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleAutoVote = () => {
    if (!hasVoted) {
      handleSkipVote();
    }
  };
  
  const handleVote = (targetId: string) => {
    if (isDiscussion || hasVoted) return;
    
    SoundManager.play('sfx-vote');
    setEliminationVote(targetId);
    setHasVoted(true);
    socketService.submitEliminationVote(targetId);
  };
  
  const handleSkipVote = () => {
    if (isDiscussion || hasVoted) return;
    
    SoundManager.play('sfx-vote');
    setHasVoted(true);
    socketService.skipVote();
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    SoundManager.play('sfx-chat');
    socketService.sendMessage(chatMessage);
    setChatMessage('');
  };
  
  const getColorHex = (colorId: string): string => {
    return PLAYER_COLORS.find(c => c.id === colorId)?.hex || '#ffffff';
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const alivePlayers = Array.from(players.values()).filter(p => p.isAlive);
  const deadPlayers = Array.from(players.values()).filter(p => !p.isAlive);
  const localPlayer = players.get(playerId!);
  
  return (
    <motion.div
      className="meeting-ui"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="meeting-ui__overlay" />
      
      <div className="meeting-ui__container">
        {/* Header */}
        <div className="meeting-ui__header">
          <h1>{isDiscussion ? 'QUEM É O IMPOSTOR?' : 'VOTAÇÃO'}</h1>
          <div className={`meeting-ui__timer ${(isDiscussion ? discussionTime : votingTime) <= 10 ? 'meeting-ui__timer--warning' : ''}`}>
            <span>{isDiscussion ? 'Discussão' : 'Votação'}</span>
            <span className="meeting-ui__timer-value">
              {formatTime(isDiscussion ? discussionTime : votingTime)}
            </span>
          </div>
        </div>
        
        <div className="meeting-ui__content">
          {/* Left side - Players to vote */}
          <div className="meeting-ui__voting-section">
            <div className="meeting-ui__players-grid">
              {alivePlayers.map(player => {
                const isSelected = eliminationVote === player.id;
                const isSelf = player.id === playerId;
                
                return (
                  <motion.div
                    key={player.id}
                    className={`meeting-ui__player-card ${isSelected ? 'meeting-ui__player-card--selected' : ''} ${isSelf ? 'meeting-ui__player-card--self' : ''}`}
                    onClick={() => !isSelf && handleVote(player.id)}
                    whileHover={!isSelf && !hasVoted && !isDiscussion ? { scale: 1.03 } : {}}
                    whileTap={!isSelf && !hasVoted && !isDiscussion ? { scale: 0.98 } : {}}
                  >
                    <div 
                      className="meeting-ui__player-avatar"
                      style={{ borderColor: getColorHex(player.color) }}
                    >
                      <img 
                        src={`/assets/sprites/characters/${player.color}/avatar.png`}
                        alt={player.name}
                      />
                    </div>
                    <span className="meeting-ui__player-name">{player.name}</span>
                    {isSelf && <span className="meeting-ui__self-badge">VOCÊ</span>}
                    
                    {/* Vote indicator */}
                    {player.votesReceived > 0 && (
                      <div className="meeting-ui__votes-received">
                        {Array.from({ length: player.votesReceived }).map((_, i) => (
                          <div key={i} className="meeting-ui__vote-pip" />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* Skip vote button */}
              <motion.div
                className={`meeting-ui__player-card meeting-ui__skip-card ${eliminationVote === 'skip' ? 'meeting-ui__player-card--selected' : ''}`}
                onClick={handleSkipVote}
                whileHover={!hasVoted && !isDiscussion ? { scale: 1.03 } : {}}
                whileTap={!hasVoted && !isDiscussion ? { scale: 0.98 } : {}}
              >
                <div className="meeting-ui__skip-icon">✕</div>
                <span className="meeting-ui__player-name">PULAR</span>
              </motion.div>
            </div>
            
            {/* Dead players */}
            {deadPlayers.length > 0 && (
              <div className="meeting-ui__dead-section">
                <h3>MORTOS</h3>
                <div className="meeting-ui__dead-players">
                  {deadPlayers.map(player => (
                    <div 
                      key={player.id}
                      className="meeting-ui__dead-player"
                    >
                      <img 
                        src={`/assets/sprites/characters/${player.color}/avatar.png`}
                        alt={player.name}
                      />
                      <span>{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right side - Chat */}
          <div className="meeting-ui__chat-section">
            <div className="meeting-ui__chat-messages">
              {messages.filter(m => !m.isGhostChat).map(message => (
                <div 
                  key={message.id}
                  className={`meeting-ui__message ${message.senderId === playerId ? 'meeting-ui__message--self' : ''}`}
                >
                  <span 
                    className="meeting-ui__message-sender"
                    style={{ color: getColorHex(players.get(message.senderId)?.color || 'white') }}
                  >
                    {message.senderName}:
                  </span>
                  <span className="meeting-ui__message-content">{message.content}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            {/* Chat input (only if alive) */}
            {localPlayer?.isAlive && (
              <form className="meeting-ui__chat-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  maxLength={200}
                />
                <button type="submit">ENVIAR</button>
              </form>
            )}
          </div>
        </div>
        
        {/* Voting status */}
        {hasVoted && (
          <div className="meeting-ui__voted-status">
            VOTO REGISTRADO - AGUARDANDO OUTROS JOGADORES...
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MeetingUI;