// client/src/components/Lobby/PlayerList.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@shared/types';
import { PLAYER_COLORS } from '@shared/constants';
import { useGameStore } from '../../stores/gameStore';
import './PlayerList.scss';

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  const { playerId } = useGameStore();
  
  const getColorHex = (colorId: string): string => {
    return PLAYER_COLORS.find(c => c.id === colorId)?.hex || '#ffffff';
  };
  
  return (
    <div className="player-list">
      <AnimatePresence>
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            className={`player-list__item ${player.id === playerId ? 'player-list__item--self' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className="player-list__avatar"
              style={{ 
                backgroundImage: `url(/assets/sprites/characters/${player.color}-mini.png)`,
                borderColor: getColorHex(player.color)
              }}
            />
            
            <div className="player-list__info">
              <span className="player-list__name">{player.name}</span>
              {player.isHost && (
                <span className="player-list__badge player-list__badge--host">
                  HOST
                </span>
              )}
              {player.id === playerId && (
                <span className="player-list__badge player-list__badge--you">
                  VOCÊ
                </span>
              )}
            </div>
            
            <div 
              className="player-list__color-indicator"
              style={{ backgroundColor: getColorHex(player.color) }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Empty slots */}
      {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, i) => (
        <div key={`empty-${i}`} className="player-list__item player-list__item--empty">
          <div className="player-list__avatar player-list__avatar--empty" />
          <div className="player-list__info">
            <span className="player-list__name player-list__name--empty">
              Aguardando jogador...
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;