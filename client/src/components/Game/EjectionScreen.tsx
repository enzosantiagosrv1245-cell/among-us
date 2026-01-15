// client/src/components/Game/EjectionScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@shared/types';
import './EjectionScreen.scss';
import { PLAYER_COLORS } from '@shared/types';

interface EjectionScreenProps {
  eliminatedPlayer: Player;
  wasImpostor: boolean;
  onComplete: () => void;
}

const EjectionScreen: React.FC<EjectionScreenProps> = ({
  eliminatedPlayer,
  wasImpostor,
  onComplete
}) => {
  const getColorHex = (colorId: string): string => {
    const color = PLAYER_COLORS.find(c => c.id === colorId);
    return color?.hex || '#ffffff';
  };

  React.useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="ejection-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="ejection-screen__overlay" />
      <motion.div
        className="ejection-screen__content"
        initial={{ scale: 0, y: -100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="ejection-screen__player">
          <div
            className="ejection-screen__avatar"
            style={{ backgroundColor: getColorHex(eliminatedPlayer.color) }}
          >
            {eliminatedPlayer.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="ejection-screen__name">{eliminatedPlayer.name}</h2>
        </div>

        <motion.div
          className="ejection-screen__result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {wasImpostor ? (
            <>
              <div className="ejection-screen__icon">💀</div>
              <h3 className="ejection-screen__text">ERA UM IMPOSTOR</h3>
              <p className="ejection-screen__subtitle">Crewmates venceram!</p>
            </>
          ) : (
            <>
              <div className="ejection-screen__icon">👤</div>
              <h3 className="ejection-screen__text">ERA UM TRIPULANTE</h3>
              <p className="ejection-screen__subtitle">Um tripulante foi eliminado</p>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EjectionScreen;
