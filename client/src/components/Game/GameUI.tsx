// client/src/components/Game/GameUI.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { socketService } from '../../services/SocketService';
import { SoundManager } from '../../utils/SoundManager';
import { PlayerRole } from '@shared/types';
import ActionButtons from './ActionButtons';
import TaskBar from './TaskBar';
import Minimap from './Minimap';
import ChatBox from './ChatBox';
import DayCounter from './DayCounter';
import RoleIndicator from './RoleIndicator';
import SabotageMenu from './SabotageMenu';
import VentNavigation from './VentNavigation';
import './GameUI.scss';

const GameUI: React.FC = () => {
  const { 
    playerRole, 
    currentDay,
    canDoTaskToday,
    settings,
    tasks,
    myTasks
  } = useGameStore();
  
  const tasksCompleted = tasks.filter(t => t.isCompleted).length;
  const tasksTotal = tasks.length;
  
  const [showSabotageMenu, setShowSabotageMenu] = useState(false);
  const [showVentUI, setShowVentUI] = useState(false);
  const [ventConnections, setVentConnections] = useState<string[]>([]);
  const [nearbyInteractions, setNearbyInteractions] = useState<{
    nearTask: boolean;
    nearBody: boolean;
    nearVent: boolean;
    nearPlayer: boolean;
  }>({
    nearTask: false,
    nearBody: false,
    nearVent: false,
    nearPlayer: false
  });
  
  useEffect(() => {
    // Listen for interaction updates from Phaser
    const handleInteractionUpdate = (data: any) => {
      setNearbyInteractions({
        nearTask: !!data.nearTask,
        nearBody: !!data.nearBody,
        nearVent: !!data.nearVent,
        nearPlayer: !!data.nearPlayer
      });
    };
    
    const handleShowVentUI = (connections: string[]) => {
      setVentConnections(connections);
      setShowVentUI(true);
    };
    
    const handleHideVentUI = () => {
      setShowVentUI(false);
      setVentConnections([]);
    };
    
    // Subscribe to Phaser events
    window.addEventListener('phaser-interaction-update', handleInteractionUpdate as any);
    window.addEventListener('phaser-show-vent-ui', handleShowVentUI as any);
    window.addEventListener('phaser-hide-vent-ui', handleHideVentUI as any);
    
    return () => {
      window.removeEventListener('phaser-interaction-update', handleInteractionUpdate as any);
      window.removeEventListener('phaser-show-vent-ui', handleShowVentUI as any);
      window.removeEventListener('phaser-hide-vent-ui', handleHideVentUI as any);
    };
  }, []);
  
  const handleKill = () => {
    if (nearbyInteractions.nearPlayer) {
      SoundManager.play('sfx-kill');
      socketService.killPlayer('targetId'); // Get actual target ID
    }
  };
  
  const handleReport = () => {
    if (nearbyInteractions.nearBody) {
      SoundManager.play('sfx-report');
      socketService.reportBody('bodyId'); // Get actual body ID
    }
  };
  
  const handleUse = () => {
    if (nearbyInteractions.nearTask && canDoTaskToday) {
      // Open task minigame
      useGameStore.getState().setTaskOpen(true);
    }
  };
  
  const handleVent = () => {
    if (nearbyInteractions.nearVent) {
      SoundManager.play('sfx-vent-open');
      // Handle vent action through Phaser
    }
  };
  
  const handleSabotage = () => {
    setShowSabotageMenu(true);
  };
  
  const handleEmergency = () => {
    SoundManager.play('sfx-emergency');
    socketService.callEmergency();
  };
  
  const isImpostor = playerRole === PlayerRole.IMPOSTOR;
  
  return (
    <div className="game-ui">
      {/* Top bar */}
      <div className="game-ui__top">
        <DayCounter 
          currentDay={currentDay} 
          totalDays={settings.gameDuration} 
        />
        
        <RoleIndicator role={playerRole} />
        
        {canDoTaskToday && (
          <div className="game-ui__task-indicator">
            VOCÊ FOI ESCOLHIDO PARA FAZER TAREFAS HOJE!
          </div>
        )}
      </div>
      
      {/* Task bar */}
      <div className="game-ui__taskbar">
        <TaskBar 
          completed={tasksCompleted} 
          total={tasksTotal} 
        />
      </div>
      
      {/* Left side - Minimap */}
      <div className="game-ui__left">
        <Minimap />
      </div>
      
      {/* Right side - Chat */}
      <div className="game-ui__right">
        <ChatBox />
      </div>
      
      {/* Bottom - Action buttons */}
      <div className="game-ui__bottom">
        <ActionButtons
          isImpostor={isImpostor}
          canKill={nearbyInteractions.nearPlayer}
          canReport={nearbyInteractions.nearBody}
          canUse={nearbyInteractions.nearTask && canDoTaskToday}
          canVent={nearbyInteractions.nearVent && isImpostor}
          onKill={handleKill}
          onReport={handleReport}
          onUse={handleUse}
          onVent={handleVent}
          onSabotage={handleSabotage}
        />
      </div>
      
      {/* Sabotage Menu */}
      <AnimatePresence>
        {showSabotageMenu && isImpostor && (
          <SabotageMenu 
            onLights={() => socketService.startSabotage('LIGHTS')}
            onReactor={() => socketService.startSabotage('REACTOR')}
            onO2={() => socketService.startSabotage('O2')}
            onComms={() => socketService.startSabotage('COMMS')}
            onDoors={() => socketService.startSabotage('DOORS')}
          />
        )}
      </AnimatePresence>
      
      {/* Vent Navigation */}
      <AnimatePresence>
        {showVentUI && isImpostor && (
          <VentNavigation 
            ventConnections={ventConnections}
            onSelectVent={(ventId) => {
              socketService.moveToVent(ventId);
              setShowVentUI(false);
            }}
            onCancel={() => setShowVentUI(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameUI;