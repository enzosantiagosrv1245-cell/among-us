// client/src/components/Game/SabotageMenu.tsx
import React from 'react';
import './SabotageMenu.scss';

interface SabotageMenuProps {
  onLights: () => void;
  onReactor: () => void;
  onO2: () => void;
  onComms: () => void;
  onDoors: () => void;
}

const SabotageMenu: React.FC<SabotageMenuProps> = ({
  onLights,
  onReactor,
  onO2,
  onComms,
  onDoors
}) => {
  return (
    <div className="sabotage-menu">
      <h3 className="sabotage-menu__title">SABOTAR</h3>
      
      <button className="sabotage-menu__btn" onClick={onLights}>
        <span className="sabotage-menu__icon">💡</span>
        Luzes
      </button>
      
      <button className="sabotage-menu__btn" onClick={onReactor}>
        <span className="sabotage-menu__icon">⚛️</span>
        Reator
      </button>
      
      <button className="sabotage-menu__btn" onClick={onO2}>
        <span className="sabotage-menu__icon">💨</span>
        O2
      </button>
      
      <button className="sabotage-menu__btn" onClick={onComms}>
        <span className="sabotage-menu__icon">📡</span>
        Comunicação
      </button>
      
      <button className="sabotage-menu__btn" onClick={onDoors}>
        <span className="sabotage-menu__icon">🚪</span>
        Portas
      </button>
    </div>
  );
};

export default SabotageMenu;
