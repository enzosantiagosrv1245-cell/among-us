// client/src/components/Game/ActionButtons.tsx (continuação)
import React from 'react';
import { motion } from 'framer-motion';
import { SoundManager } from '../../utils/SoundManager';
import './ActionButtons.scss';

interface ActionButtonsProps {
  isImpostor: boolean;
  canKill: boolean;
  canReport: boolean;
  canUse: boolean;
  canVent: boolean;
  onKill: () => void;
  onReport: () => void;
  onUse: () => void;
  onVent: () => void;
  onSabotage: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isImpostor,
  canKill,
  canReport,
  canUse,
  canVent,
  onKill,
  onReport,
  onUse,
  onVent,
  onSabotage
}) => {
  const handleButtonHover = () => {
    SoundManager.play('sfx-button-hover', { volume: 0.2 });
  };
  
  const handleButtonClick = (callback: () => void, enabled: boolean) => {
    if (enabled) {
      SoundManager.play('sfx-button-click');
      callback();
    }
  };
  
  return (
    <div className="action-buttons">
      {/* Use Button - Always visible */}
      <motion.button
        className={`action-btn action-btn--use ${canUse ? 'action-btn--active' : ''}`}
        onClick={() => handleButtonClick(onUse, canUse)}
        onMouseEnter={handleButtonHover}
        whileHover={canUse ? { scale: 1.1 } : {}}
        whileTap={canUse ? { scale: 0.95 } : {}}
        disabled={!canUse}
      >
        <div className="action-btn__icon">
          <img src="/assets/ui/button-use.png" alt="Use" />
        </div>
        <span className="action-btn__label">USE</span>
        <span className="action-btn__key">E</span>
      </motion.button>
      
      {/* Report Button */}
      <motion.button
        className={`action-btn action-btn--report ${canReport ? 'action-btn--active' : ''}`}
        onClick={() => handleButtonClick(onReport, canReport)}
        onMouseEnter={handleButtonHover}
        whileHover={canReport ? { scale: 1.1 } : {}}
        whileTap={canReport ? { scale: 0.95 } : {}}
        disabled={!canReport}
      >
        <div className="action-btn__icon">
          <img src="/assets/ui/button-report.png" alt="Report" />
        </div>
        <span className="action-btn__label">REPORT</span>
        <span className="action-btn__key">R</span>
      </motion.button>
      
      {/* Impostor-only buttons */}
      {isImpostor && (
        <>
          {/* Kill Button */}
          <motion.button
            className={`action-btn action-btn--kill ${canKill ? 'action-btn--active' : ''}`}
            onClick={() => handleButtonClick(onKill, canKill)}
            onMouseEnter={handleButtonHover}
            whileHover={canKill ? { scale: 1.1 } : {}}
            whileTap={canKill ? { scale: 0.95 } : {}}
            disabled={!canKill}
          >
            <div className="action-btn__icon">
              <img src="/assets/ui/button-kill.png" alt="Kill" />
            </div>
            <span className="action-btn__label">KILL</span>
            <span className="action-btn__key">Q</span>
            {/* Cooldown overlay */}
            <div className="action-btn__cooldown">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" />
              </svg>
            </div>
          </motion.button>
          
          {/* Vent Button */}
          <motion.button
            className={`action-btn action-btn--vent ${canVent ? 'action-btn--active' : ''}`}
            onClick={() => handleButtonClick(onVent, canVent)}
            onMouseEnter={handleButtonHover}
            whileHover={canVent ? { scale: 1.1 } : {}}
            whileTap={canVent ? { scale: 0.95 } : {}}
            disabled={!canVent}
          >
            <div className="action-btn__icon">
              <img src="/assets/ui/button-vent.png" alt="Vent" />
            </div>
            <span className="action-btn__label">VENT</span>
            <span className="action-btn__key">V</span>
          </motion.button>
          
          {/* Sabotage Button */}
          <motion.button
            className="action-btn action-btn--sabotage action-btn--active"
            onClick={() => handleButtonClick(onSabotage, true)}
            onMouseEnter={handleButtonHover}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="action-btn__icon">
              <img src="/assets/ui/button-sabotage.png" alt="Sabotage" />
            </div>
            <span className="action-btn__label">SABOTAGE</span>
          </motion.button>
        </>
      )}
    </div>
  );
};

export default ActionButtons;