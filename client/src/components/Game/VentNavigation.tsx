// client/src/components/Game/VentNavigation.tsx
import React from 'react';
import './VentNavigation.scss';

interface VentNavigationProps {
  ventConnections: string[];
  onSelectVent: (ventId: string) => void;
  onCancel: () => void;
}

const VentNavigation: React.FC<VentNavigationProps> = ({
  ventConnections,
  onSelectVent,
  onCancel
}) => {
  return (
    <div className="vent-navigation">
      <h3 className="vent-navigation__title">SELECIONAR SAÍDA</h3>
      
      <div className="vent-navigation__buttons">
        {ventConnections.map((ventId) => (
          <button
            key={ventId}
            className="vent-navigation__btn"
            onClick={() => onSelectVent(ventId)}
          >
            Vent {ventId}
          </button>
        ))}
      </div>
      
      <button className="vent-navigation__cancel" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  );
};

export default VentNavigation;
