// client/src/components/Game/RoleReveal.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayerRole } from '@shared/types';
import { SoundManager } from '../../utils/SoundManager';
import './RoleReveal.scss';

interface RoleRevealProps {
  role: PlayerRole;
  onComplete: () => void;
}

const ROLE_INFO: Record<PlayerRole, { title: string; description: string; color: string; icon: string }> = {
  [PlayerRole.INNOCENT]: {
    title: 'TRIPULANTE',
    description: 'Complete suas tarefas e encontre os impostores!',
    color: '#00ff00',
    icon: '/assets/icons/crewmate-icon.png'
  },
  [PlayerRole.IMPOSTOR]: {
    title: 'IMPOSTOR',
    description: 'Sabote e elimine a tripulação sem ser descoberto!',
    color: '#ff0000',
    icon: '/assets/icons/impostor-icon.png'
  },
  [PlayerRole.MEDIUM]: {
    title: 'MÉDIUM',
    description: 'Complete uma tarefa para conversar com os mortos e descobrir o impostor antes dos outros!',
    color: '#00ffff',
    icon: '/assets/icons/medium-icon.png'
  },
  [PlayerRole.GHOST_THIEF]: {
    title: 'LADRÃO FANTASMA',
    description: 'Descubra a função dos mortos e roube para si!',
    color: '#808080',
    icon: '/assets/icons/thief-icon.png'
  },
  [PlayerRole.CLOWN]: {
    title: 'PALHAÇO',
    description: 'Faça todos votarem em você para vencer! Cuidado para não morrer pelo impostor.',
    color: '#ff00ff',
    icon: '/assets/icons/clown-icon.png'
  }
};

const RoleReveal: React.FC<RoleRevealProps> = ({ role, onComplete }) => {
  useEffect(() => {
    SoundManager.play('sfx-role-reveal');
    
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  const roleInfo = ROLE_INFO[role];
  
  return (
    <motion.div
      className="role-reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="role-reveal__overlay" />
      
      <motion.div
        className="role-reveal__content"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="role-reveal__icon"
          style={{ borderColor: roleInfo.color }}
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <img src={roleInfo.icon} alt={roleInfo.title} />
        </motion.div>
        
        <motion.h1
          className="role-reveal__title"
          style={{ color: roleInfo.color }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {roleInfo.title}
        </motion.h1>
        
        <motion.p
          className="role-reveal__description"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {roleInfo.description}
        </motion.p>
        
        <motion.div
          className="role-reveal__glow"
          style={{ background: `radial-gradient(circle, ${roleInfo.color}40 0%, transparent 70%)` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ delay: 0.3, duration: 1 }}
        />
      </motion.div>
      
      {/* Special effects for impostor */}
      {role === PlayerRole.IMPOSTOR && (
        <motion.div
          className="role-reveal__impostor-effect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="blood-drip blood-drip--1" />
          <div className="blood-drip blood-drip--2" />
          <div className="blood-drip blood-drip--3" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default RoleReveal;