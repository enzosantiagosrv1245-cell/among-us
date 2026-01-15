// client/src/components/Game/Minimap.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { MapType } from '@shared/types';
import './Minimap.scss';

const Minimap: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings, players, localPlayer, deadBodies } = useGameStore();
  
  const mapImage = `/assets/maps/${settings.map.toLowerCase().replace('_', '-')}/minimap.png`;
  
  // Scale player positions to minimap
  const scalePosition = (x: number, y: number, mapWidth: number, mapHeight: number, minimapSize: number) => {
    return {
      x: (x / mapWidth) * minimapSize,
      y: (y / mapHeight) * minimapSize
    };
  };
  
  const getMapDimensions = (mapType: MapType): { width: number; height: number } => {
    const dimensions: Record<MapType, { width: number; height: number }> = {
      [MapType.THE_SKELD]: { width: 1920, height: 1080 },
      [MapType.MIRA_HQ]: { width: 2048, height: 1024 },
      [MapType.POLUS]: { width: 2048, height: 1536 },
      [MapType.THE_AIRSHIP]: { width: 3072, height: 1536 },
      [MapType.THE_FUNGLE]: { width: 2048, height: 1024 }
    };
    return dimensions[mapType] || { width: 1920, height: 1080 };
  };
  
  const mapDimensions = getMapDimensions(settings.map);
  const minimapSize = isExpanded ? 400 : 150;
  
  return (
    <motion.div 
      className={`minimap ${isExpanded ? 'minimap--expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      layout
    >
      <div className="minimap__container" style={{ width: minimapSize, height: minimapSize * (mapDimensions.height / mapDimensions.width) }}>
        <img 
          src={mapImage} 
          alt="Map" 
          className="minimap__image"
        />
        
        {/* Dead bodies */}
        {deadBodies.map(body => {
          const pos = scalePosition(body.position.x, body.position.y, mapDimensions.width, mapDimensions.height, minimapSize);
          return (
            <div
              key={body.id}
              className="minimap__body"
              style={{ left: pos.x, top: pos.y }}
            />
          );
        })}
        
        {/* Player position */}
        {localPlayer && (
          <div
            className="minimap__player minimap__player--self"
            style={{
              left: scalePosition(localPlayer.position.x, localPlayer.position.y, mapDimensions.width, mapDimensions.height, minimapSize).x,
              top: scalePosition(localPlayer.position.x, localPlayer.position.y, mapDimensions.width, mapDimensions.height, minimapSize).y
            }}
          />
        )}
      </div>
      
      <div className="minimap__hint">
        {isExpanded ? 'Clique para minimizar' : 'Clique para expandir'}
      </div>
    </motion.div>
  );
};

export default Minimap;