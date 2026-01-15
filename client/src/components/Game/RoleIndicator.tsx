// client/src/components/Game/RoleIndicator.tsx
import React from 'react';
import { PlayerRole } from '@shared/types';
import './RoleIndicator.scss';

interface RoleIndicatorProps {
  role: PlayerRole | null;
}

const RoleIndicator: React.FC<RoleIndicatorProps> = ({ role }) => {
  if (!role) return null;

  const isImpostor = role === PlayerRole.IMPOSTOR;

  return (
    <div className={`role-indicator ${isImpostor ? 'role-indicator--impostor' : 'role-indicator--crewmate'}`}>
      <div className="role-indicator__icon">
        {isImpostor ? '💀' : '👤'}
      </div>
      <div className="role-indicator__text">
        {isImpostor ? 'IMPOSTOR' : 'TRIPULANTE'}
      </div>
    </div>
  );
};

export default RoleIndicator;
