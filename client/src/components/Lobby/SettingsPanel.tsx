// client/src/components/Lobby/SettingsPanel.tsx
import React from 'react';
import { GameSettings, MapType } from '@shared/types';
import './SettingsPanel.scss';

interface SettingsPanelProps {
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
}

const MAPS = [
  { id: MapType.THE_SKELD, name: 'The Skeld', image: '/assets/maps/the-skeld/preview.png' },
  { id: MapType.MIRA_HQ, name: 'MIRA HQ', image: '/assets/maps/mira-hq/preview.png' },
  { id: MapType.POLUS, name: 'Polus', image: '/assets/maps/polus/preview.png' },
  { id: MapType.THE_AIRSHIP, name: 'Airship', image: '/assets/maps/airship/preview.png' },
  { id: MapType.THE_FUNGLE, name: 'The Fungle', image: '/assets/maps/fungle/preview.png' }
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleMapChange = (map: MapType) => {
    onSettingsChange({ map });
  };
  
  const handleNumberChange = (key: keyof GameSettings, value: number) => {
    onSettingsChange({ [key]: value });
  };
  
  const handleToggle = (key: keyof GameSettings) => {
    onSettingsChange({ [key]: !settings[key] });
  };
  
  return (
    <div className="settings-panel">
      {/* Map Selection */}
      <div className="settings-panel__section">
        <h3 className="settings-panel__section-title">Mapa</h3>
        <div className="settings-panel__maps">
          {MAPS.map((map) => (
            <button
              key={map.id}
              className={`settings-panel__map-btn ${settings.map === map.id ? 'settings-panel__map-btn--active' : ''}`}
              onClick={() => handleMapChange(map.id)}
            >
              <img src={map.image} alt={map.name} />
              <span>{map.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Game Duration */}
      <div className="settings-panel__section">
        <h3 className="settings-panel__section-title">Configurações do Jogo</h3>
        
        <div className="settings-panel__option">
          <label>Duração do Jogo (dias)</label>
          <div className="settings-panel__slider">
            <input
              type="range"
              min="5"
              max="30"
              value={settings.gameDuration}
              onChange={(e) => handleNumberChange('gameDuration', parseInt(e.target.value))}
            />
            <span>{settings.gameDuration} dias</span>
          </div>
        </div>
        
        <div className="settings-panel__option">
          <label>Tarefas por Dia</label>
          <div className="settings-panel__slider">
            <input
              type="range"
              min="1"
              max="5"
              value={settings.tasksPerDay}
              onChange={(e) => handleNumberChange('tasksPerDay', parseInt(e.target.value))}
            />
            <span>{settings.tasksPerDay}</span>
          </div>
        </div>
        
        <div className="settings-panel__option">
          <label>Número de Impostores</label>
          <div className="settings-panel__slider">
            <input
              type="range"
              min="1"
              max="3"
              value={settings.impostorCount}
              onChange={(e) => handleNumberChange('impostorCount', parseInt(e.target.value))}
            />
            <span>{settings.impostorCount}</span>
          </div>
        </div>
        
        <div className="settings-panel__option">
          <label>Tempo de Discussão (s)</label>
          <div className="settings-panel__slider">
            <input
              type="range"
              min="0"
              max="120"
              step="15"
              value={settings.discussionTime}
              onChange={(e) => handleNumberChange('discussionTime', parseInt(e.target.value))}
            />
            <span>{settings.discussionTime}s</span>
          </div>
        </div>
        
        <div className="settings-panel__option">
          <label>Tempo de Votação (s)</label>
          <div className="settings-panel__slider">
            <input
              type="range"
              min="30"
              max="300"
              step="15"
              value={settings.votingTime}
              onChange={(e) => handleNumberChange('votingTime', parseInt(e.target.value))}
            />
            <span>{settings.votingTime}s</span>
          </div>
        </div>
      </div>
      
      {/* Player Settings */}
      <div className="settings-panel__section">
        <h3 className="settings-panel__section-title">Jogadores</h3>
        
        <div className="settings-panel__option">
          <label>Velocidade</label>
          <div className="settings-panel__slider">
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.25"
              value={settings.playerSpeed}
              onChange={(e) => handleNumberChange('playerSpeed', parseFloat(e.target.value))}
            />
            <span>{settings.playerSpeed}x</span>
          </div>
        </div>
        
        <div className="settings-panel__option">
          <label>Cooldown de Kill (s)</label>
          <div className="settings-panel__slider">
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={settings.killCooldown}
              onChange={(e) => handleNumberChange('killCooldown', parseInt(e.target.value))}
            />
            <span>{settings.killCooldown}s</span>
          </div>
        </div>
      </div>
      
      {/* Toggles */}
      <div className="settings-panel__section">
        <h3 className="settings-panel__section-title">Opções</h3>
        
        <div className="settings-panel__toggle">
          <label>Confirmar Ejeções</label>
          <button
            className={`toggle-btn ${settings.confirmEjects ? 'toggle-btn--on' : ''}`}
            onClick={() => handleToggle('confirmEjects')}
          >
            {settings.confirmEjects ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="settings-panel__toggle">
          <label>Votos Anônimos</label>
          <button
            className={`toggle-btn ${settings.anonymousVotes ? 'toggle-btn--on' : ''}`}
            onClick={() => handleToggle('anonymousVotes')}
          >
            {settings.anonymousVotes ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="settings-panel__toggle">
          <label>Tarefas Visuais</label>
          <button
            className={`toggle-btn ${settings.visualTasks ? 'toggle-btn--on' : ''}`}
            onClick={() => handleToggle('visualTasks')}
          >
            {settings.visualTasks ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;