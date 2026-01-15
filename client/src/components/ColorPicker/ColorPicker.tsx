// client/src/components/ColorPicker/ColorPicker.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PlayerColor } from '@shared/types';
import { PLAYER_COLORS } from '@shared/constants';
import { SoundManager } from '../../utils/SoundManager';
import './ColorPicker.scss';

interface ColorPickerProps {
  selectedColor: PlayerColor;
  onColorSelect: (color: PlayerColor) => void;
  disabledColors: PlayerColor[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  disabledColors
}) => {
  const handleColorClick = (color: PlayerColor) => {
    if (!disabledColors.includes(color)) {
      SoundManager.play('sfx-button-click');
      onColorSelect(color);
    }
  };
  
  const handleColorHover = () => {
    SoundManager.play('sfx-button-hover', { volume: 0.2 });
  };
  
  return (
    <div className="color-picker">
      <div className="color-picker__grid">
        {PLAYER_COLORS.map((colorData) => {
          const isSelected = selectedColor === colorData.id;
          const isDisabled = disabledColors.includes(colorData.id as PlayerColor);
          
          return (
            <motion.button
              key={colorData.id}
              className={`color-picker__item ${isSelected ? 'color-picker__item--selected' : ''} ${isDisabled ? 'color-picker__item--disabled' : ''}`}
              style={{ backgroundColor: colorData.hex }}
              onClick={() => handleColorClick(colorData.id as PlayerColor)}
              onMouseEnter={handleColorHover}
              whileHover={!isDisabled ? { scale: 1.1 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              disabled={isDisabled}
              title={colorData.name}
            >
              {isSelected && (
                <motion.div 
                  className="color-picker__check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
              {isDisabled && (
                <div className="color-picker__x">✕</div>
              )}
              
              {/* Character preview */}
              <div 
                className="color-picker__preview"
                style={{
                  backgroundImage: `url(/assets/sprites/characters/${colorData.id}-mini.png)`
                }}
              />
            </motion.button>
          );
        })}
      </div>
      
      {/* Selected color name */}
      <div className="color-picker__selected-name">
        {PLAYER_COLORS.find(c => c.id === selectedColor)?.name}
      </div>
    </div>
  );
};

export default ColorPicker;