// client/src/components/Game/GameOverScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PlayerRole } from '@shared/types';
import './GameOverScreen.scss';

interface GameOverScreenProps {
  isImpostorWin: boolean;
  winCondition: string;
  impostors: string[];
  survivors: string[];
  onBack: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  isImpostorWin,
  winCondition,
  impostors,
  survivors,
  onBack
}) => {
  return (
    <motion.div
      className="game-over-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="game-over-screen__background" />

      <motion.div
        className="game-over-screen__content"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        {isImpostorWin ? (
          <>
            <div className="game-over-screen__title game-over-screen__title--impostor">
              IMPOSTORES VENCEM
            </div>
            <div className="game-over-screen__icon">💀</div>
          </>
        ) : (
          <>
            <div className="game-over-screen__title game-over-screen__title--crew">
              TRIPULANTES VENCEM
            </div>
            <div className="game-over-screen__icon">🎉</div>
          </>
        )}

        <div className="game-over-screen__reason">
          <p>{winCondition}</p>
        </div>

        <div className="game-over-screen__stats">
          <div className="game-over-screen__stat-group">
            <h3>Impostores</h3>
            <div className="game-over-screen__names">
              {impostors.length > 0 ? (
                impostors.map(name => (
                  <span key={name} className="game-over-screen__name game-over-screen__name--impostor">
                    {name}
                  </span>
                ))
              ) : (
                <span className="game-over-screen__name">Nenhum</span>
              )}
            </div>
          </div>

          <div className="game-over-screen__stat-group">
            <h3>Sobreviventes</h3>
            <div className="game-over-screen__names">
              {survivors.length > 0 ? (
                survivors.map(name => (
                  <span key={name} className="game-over-screen__name">
                    {name}
                  </span>
                ))
              ) : (
                <span className="game-over-screen__name">Nenhum</span>
              )}
            </div>
          </div>
        </div>

        <motion.button
          className="game-over-screen__button"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voltar ao Menu
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GameOverScreen;
