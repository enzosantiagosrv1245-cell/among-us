// client/src/components/MainMenu/MainMenu.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socketService } from '../../services/SocketService';
import { SoundManager } from '../../utils/SoundManager';
import { useGameStore } from '../../stores/gameStore';
import { PlayerColor, PLAYER_COLORS } from '@shared/types';
import ColorPicker from '../ColorPicker/ColorPicker';
import './MainMenu.scss';

interface MainMenuProps {
  onJoinGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [oderId, setPlayerId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedColor, setSelectedColor] = useState<PlayerColor>(PlayerColor.RED);
  const [showJoinPanel, setShowJoinPanel] = useState(false);
  const [showHostPanel, setShowHostPanel] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  
  const { isConnected, setPlayerInfo, currentRoom } = useGameStore();
  
  useEffect(() => {
    SoundManager.playMusic('music-menu');
    
    // Connect to server on mount
    if (!isConnected) {
      socketService.connect().catch(err => {
        setError('Falha ao conectar ao servidor');
        console.error(err);
      });
    }
    
    return () => {
      SoundManager.stopMusic();
    };
  }, []);
  
  useEffect(() => {
    if (currentRoom) {
      onJoinGame();
    }
  }, [currentRoom, onJoinGame]);
  
  const handleButtonHover = () => {
    SoundManager.play('sfx-button-hover');
  };
  
  const handleButtonClick = () => {
    SoundManager.play('sfx-button-click');
  };
  
  const validateInput = (): boolean => {
    if (!playerName.trim()) {
      setError('Digite seu nome');
      return false;
    }
    if (playerName.length < 2 || playerName.length > 12) {
      setError('Nome deve ter entre 2 e 12 caracteres');
      return false;
    }
    if (!oderId.trim()) {
      setError('Digite seu ID');
      return false;
    }
    setError('');
    return true;
  };
  
  const handleHostGame = async () => {
    handleButtonClick();
    
    if (!validateInput()) return;
    
    setIsConnecting(true);
    try {
      if (!isConnected) {
        await socketService.connect();
      }
      setPlayerInfo(playerName, oderId, selectedColor);
      socketService.createRoom(playerName, oderId, selectedColor);
    } catch (err) {
      setError('Falha ao criar sala');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleJoinGame = async () => {
    handleButtonClick();
    
    if (!validateInput()) return;
    
    if (!roomCode.trim()) {
      setError('Digite o código da sala');
      return;
    }
    
    setIsConnecting(true);
    try {
      if (!isConnected) {
        await socketService.connect();
      }
      setPlayerInfo(playerName, oderId, selectedColor);
      socketService.joinRoom(roomCode.toUpperCase(), playerName, oderId, selectedColor);
    } catch (err) {
      setError('Falha ao entrar na sala');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleShowJoin = () => {
    handleButtonClick();
    setShowJoinPanel(true);
    setShowHostPanel(false);
  };
  
  const handleShowHost = () => {
    handleButtonClick();
    setShowHostPanel(true);
    setShowJoinPanel(false);
  };
  
  const handleBack = () => {
    handleButtonClick();
    setShowJoinPanel(false);
    setShowHostPanel(false);
    setError('');
  };
  
  return (
    <motion.div 
      className="main-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated stars background */}
      <div className="main-menu__background">
        <div className="stars stars--small"></div>
        <div className="stars stars--medium"></div>
        <div className="stars stars--large"></div>
      </div>
      
      {/* Floating astronauts */}
      <div className="main-menu__astronauts">
        <div className="astronaut astronaut--1"></div>
        <div className="astronaut astronaut--2"></div>
        <div className="astronaut astronaut--3"></div>
      </div>
      
      <div className="main-menu__content">
        {/* Logo */}
        <motion.div 
          className="main-menu__logo"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <img src="/assets/ui/logo.png" alt="Among Us 2.0" />
          <h2 className="main-menu__subtitle">TAREFAS DIÁRIAS</h2>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {!showJoinPanel && !showHostPanel ? (
            // Main buttons
            <motion.div 
              className="main-menu__buttons"
              key="main-buttons"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className="btn btn--primary btn--large main-menu__btn"
                onClick={handleShowHost}
                onMouseEnter={handleButtonHover}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn__icon">🚀</span>
                CRIAR JOGO
              </motion.button>
              
              <motion.button
                className="btn btn--secondary btn--large main-menu__btn"
                onClick={handleShowJoin}
                onMouseEnter={handleButtonHover}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn__icon">🎮</span>
                ENTRAR
              </motion.button>
              
              <motion.button
                className="btn btn--ghost btn--large main-menu__btn"
                onMouseEnter={handleButtonHover}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn__icon">⚙️</span>
                OPÇÕES
              </motion.button>
            </motion.div>
          ) : (
            // Join/Host panel
            <motion.div 
              className="main-menu__panel"
              key="input-panel"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="panel">
                <div className="panel__header">
                  {showHostPanel ? 'CRIAR JOGO' : 'ENTRAR NO JOGO'}
                </div>
                
                <div className="panel__content">
                  {/* Player Name Input */}
                  <div className="input-group">
                    <label>Nome do Jogador</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Seu nome..."
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      maxLength={12}
                    />
                  </div>
                  
                  {/* Player ID Input */}
                  <div className="input-group">
                    <label>ID do Jogador</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Seu ID único..."
                      value={oderId}
                      onChange={(e) => setPlayerId(e.target.value)}
                    />
                    <span className="input-hint">
                      IDs especiais desbloqueiam funções secretas!
                    </span>
                  </div>
                  
                  {/* Room Code (only for join) */}
                  {showJoinPanel && (
                    <div className="input-group">
                      <label>Código da Sala</label>
                      <input
                        type="text"
                        className="input input--code"
                        placeholder="ABCDEF"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        maxLength={6}
                      />
                    </div>
                  )}
                  
                  {/* Color Picker */}
                  <div className="input-group">
                    <label>Cor do Personagem</label>
                    <ColorPicker
                      selectedColor={selectedColor}
                      onColorSelect={setSelectedColor}
                      disabledColors={[]}
                    />
                  </div>
                  
                  {/* Error message */}
                  {error && (
                    <motion.div 
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="button-group">
                    <motion.button
                      className="btn btn--ghost"
                      onClick={handleBack}
                      onMouseEnter={handleButtonHover}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      VOLTAR
                    </motion.button>
                    
                    <motion.button
                      className={`btn ${showHostPanel ? 'btn--primary' : 'btn--secondary'}`}
                      onClick={showHostPanel ? handleHostGame : handleJoinGame}
                      onMouseEnter={handleButtonHover}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isConnecting}
                    >
                      {isConnecting ? 'CONECTANDO...' : (showHostPanel ? 'CRIAR' : 'ENTRAR')}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Version info */}
        <div className="main-menu__version">
          v2.0.0 - Tarefas Diárias
        </div>
      </div>
    </motion.div>
  );
};

export default MainMenu;