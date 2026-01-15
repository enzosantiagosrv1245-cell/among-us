// client/src/components/Lobby/Lobby.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { socketService } from '../../services/SocketService';
import { SoundManager } from '../../utils/SoundManager';
import { PlayerColor, PLAYER_COLORS } from '@shared/types';
import ColorPicker from '../ColorPicker/ColorPicker';
import SettingsPanel from './SettingsPanel';
import PlayerList from './PlayerList';
import './Lobby.scss';

interface LobbyProps {
  onStartGame: () => void;
  onBack: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ onStartGame, onBack }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { 
    currentRoom, 
    isHost, 
    players, 
    settings, 
    playerColor,
    phase
  } = useGameStore();
  
  useEffect(() => {
    SoundManager.playMusic('music-lobby');
    
    return () => {
      SoundManager.stopMusic();
    };
  }, []);
  
  const handleCopyCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom);
      setCopied(true);
      SoundManager.play('sfx-button-click');
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleColorChange = (color: PlayerColor) => {
    socketService.changeColor(color);
  };
  
  const handleStartGame = () => {
    if (players.size >= 4) {
      SoundManager.play('sfx-game-start');
      socketService.startGame();
    }
  };
  
  const handleLeave = () => {
    SoundManager.play('sfx-leave');
    socketService.leaveRoom();
    onBack();
  };
  
  const disabledColors = Array.from(players.values())
    .filter(p => p.id !== useGameStore.getState().playerId)
    .map(p => p.color);
  
  const canStart = isHost && players.size >= 4;
  
  return (
    <motion.div 
      className="lobby"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background - Spaceship interior */}
      <div className="lobby__background">
        <img 
          src="/assets/maps/lobby/spaceship.png" 
          alt="Lobby" 
          className="lobby__ship-bg"
        />
        <div className="lobby__overlay"></div>
      </div>
      
      <div className="lobby__content">
        {/* Header with room code */}
        <motion.div 
          className="lobby__header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="lobby__code-section">
            <span className="lobby__code-label">CÓDIGO DA SALA</span>
            <motion.div 
              className="lobby__code"
              onClick={handleCopyCode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentRoom}
              <span className="lobby__copy-hint">
                {copied ? 'COPIADO!' : 'Clique para copiar'}
              </span>
            </motion.div>
          </div>
          
          <div className="lobby__map-info">
            <img 
              src={`/assets/maps/${settings.map.toLowerCase()}/preview.png`} 
              alt={settings.map}
              className="lobby__map-preview"
            />
            <span className="lobby__map-name">{settings.map.replace('_', ' ')}</span>
          </div>
        </motion.div>
        
        {/* Main content area */}
        <div className="lobby__main">
          {/* Left side - Player list */}
          <motion.div 
            className="lobby__players-section"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="panel">
              <div className="panel__header">
                JOGADORES ({players.size}/{settings.maxPlayers})
              </div>
              <div className="panel__content">
                <PlayerList players={Array.from(players.values())} />
              </div>
            </div>
          </motion.div>
          
          {/* Center - Character customization */}
          <motion.div 
            className="lobby__character-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="lobby__character-display">
              <div 
                className="lobby__character-sprite"
                style={{
                  backgroundImage: `url(/assets/sprites/characters/${playerColor}-idle.png)`
                }}
              />
            </div>
            
            <div className="panel">
              <div className="panel__header">ESCOLHA SUA COR</div>
              <div className="panel__content">
                <ColorPicker
                  selectedColor={playerColor}
                  onColorSelect={handleColorChange}
                  disabledColors={disabledColors}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Settings (host only) or game info */}
          <motion.div 
            className="lobby__settings-section"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isHost ? (
              <div className="panel">
                <div className="panel__header">CONFIGURAÇÕES</div>
                <div className="panel__content">
                  <SettingsPanel 
                    settings={settings}
                    onSettingsChange={(newSettings) => {
                      socketService.changeSettings(newSettings);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="panel">
                <div className="panel__header">INFORMAÇÕES DO JOGO</div>
                <div className="panel__content">
                  <div className="lobby__info-item">
                    <span className="lobby__info-label">Mapa:</span>
                    <span className="lobby__info-value">{settings.map.replace('_', ' ')}</span>
                  </div>
                  <div className="lobby__info-item">
                    <span className="lobby__info-label">Impostores:</span>
                    <span className="lobby__info-value">{settings.impostorCount}</span>
                  </div>
                  <div className="lobby__info-item">
                    <span className="lobby__info-label">Duração:</span>
                    <span className="lobby__info-value">{settings.gameDuration} dias</span>
                  </div>
                  <div className="lobby__info-item">
                    <span className="lobby__info-label">Tarefas/Dia:</span>
                    <span className="lobby__info-value">{settings.tasksPerDay}</span>
                  </div>
                  <div className="lobby__waiting">
                    Aguardando o host iniciar o jogo...
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Bottom buttons */}
        <motion.div 
          className="lobby__actions"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="btn btn--ghost"
            onClick={handleLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SAIR
          </motion.button>
          
          {isHost && (
            <motion.button
              className={`btn btn--primary btn--large ${!canStart ? 'btn--disabled' : ''}`}
              onClick={handleStartGame}
              disabled={!canStart}
              whileHover={canStart ? { scale: 1.05 } : {}}
              whileTap={canStart ? { scale: 0.95 } : {}}
            >
              {players.size < 4 
                ? `PRECISA DE ${4 - players.size} JOGADORES` 
                : 'INICIAR JOGO'
              }
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Lobby;