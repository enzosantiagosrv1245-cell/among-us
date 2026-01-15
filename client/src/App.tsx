// client/src/App.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MainMenu from './components/MainMenu/MainMenu';
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';
import { useGameStore } from './stores/gameStore';
import { AssetLoader } from './utils/AssetLoader';
import { SoundManager } from './utils/SoundManager';

type Screen = 'loading' | 'menu' | 'lobby' | 'game';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Inicializando...');
  const { isConnected } = useGameStore();

  useEffect(() => {
    const loadGame = async () => {
      try {
        // Load assets
        setLoadingText('Carregando sprites...');
        await AssetLoader.loadSprites((progress) => {
          setLoadingProgress(progress * 0.4);
        });

        setLoadingText('Carregando mapas...');
        await AssetLoader.loadMaps((progress) => {
          setLoadingProgress(40 + progress * 0.3);
        });

        setLoadingText('Carregando sons...');
        await SoundManager.initialize((progress) => {
          setLoadingProgress(70 + progress * 0.2);
        });

        setLoadingText('Preparando jogo...');
        setLoadingProgress(90);

        // Small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLoadingProgress(100);
        setLoadingText('Pronto!');

        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }

        setCurrentScreen('menu');
      } catch (error) {
        console.error('Error loading game:', error);
        setLoadingText('Erro ao carregar. Recarregue a página.');
      }
    };

    loadGame();
  }, []);

  // Update loading bar
  useEffect(() => {
    const loadingBar = document.getElementById('loading-bar');
    const loadingTextEl = document.getElementById('loading-text');
    
    if (loadingBar) {
      loadingBar.style.width = `${loadingProgress}%`;
    }
    if (loadingTextEl) {
      loadingTextEl.textContent = loadingText;
    }
  }, [loadingProgress, loadingText]);

  const handleJoinLobby = () => {
    setCurrentScreen('lobby');
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentScreen === 'menu' && (
          <MainMenu 
            key="menu"
            onJoinGame={handleJoinLobby}
          />
        )}
        
        {currentScreen === 'lobby' && (
          <Lobby 
            key="lobby"
            onStartGame={handleStartGame}
            onBack={handleBackToMenu}
          />
        )}
        
        {currentScreen === 'game' && (
          <Game 
            key="game"
            onGameEnd={handleBackToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;