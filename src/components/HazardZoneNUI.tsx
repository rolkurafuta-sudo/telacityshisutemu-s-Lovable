import React, { useState, useEffect } from 'react';
import RaidJoinUI from './RaidJoinUI';
import RankingUI from './RankingUI';
import SkillManagerUI from './SkillManagerUI';
import ResultUI from './ResultUI';
import NotificationSystem from './NotificationSystem';

// Font Awesome setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NUIMessage {
  type: string;
  data?: any;
  message?: string;
}

const HazardZoneNUI: React.FC = () => {
  const [currentUI, setCurrentUI] = useState<string | null>(null);
  const [uiData, setUIData] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data: NUIMessage = event.data;
      
      switch (data.type) {
        case 'showRaidJoin':
          setCurrentUI('raidJoin');
          setUIData(data.data);
          break;
        case 'showRanking':
          setCurrentUI('ranking');
          setUIData(data.data);
          break;
        case 'showSkillManager':
          setCurrentUI('skillManager');
          setUIData(data.data);
          break;
        case 'showResult':
          setCurrentUI('result');
          setUIData(data.data);
          break;
        case 'showNotification':
          showNotification(data.message || '', data.type as any || 'info');
          break;
        case 'hideUI':
          closeUI();
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    // ESC key to close UI
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeUI();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeUI = () => {
    setCurrentUI(null);
    setUIData(null);
    
    // Notify server that UI is closed
    fetch(`https://${getResourceName()}/closeUI`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    }).catch(() => {
      // Ignore fetch errors in development
    });
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      message,
      type,
      duration: 3000
    };
    
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getResourceName = () => {
    return window.location.hostname || 'hazard_zone';
  };

  const sendNUIMessage = (action: string, data: any = {}) => {
    fetch(`https://${getResourceName()}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).catch(() => {
      // Ignore fetch errors in development
    });
  };

  const handleJoinRaid = (role: string, weaponPack?: string) => {
    sendNUIMessage('joinRaid', { role, weaponPack });
    closeUI();
  };

  const handleAllocateSkill = (skillName: string, points: number) => {
    sendNUIMessage('allocateSkillPoints', { skillName, points });
  };

  const handleResetSkills = () => {
    if (window.confirm('スキルをリセットしますか？\n費用: $10,000')) {
      sendNUIMessage('resetSkills', {});
    }
  };

  const handleChangeJob = (jobName: string) => {
    sendNUIMessage('changeSpecialJob', { jobName });
  };

  if (!currentUI) {
    return <NotificationSystem notifications={notifications} onRemove={removeNotification} />;
  }

  return (
    <div className="w-screen h-screen">
      {currentUI === 'raidJoin' && (
        <RaidJoinUI 
          data={uiData} 
          onClose={closeUI} 
          onJoinRaid={handleJoinRaid}
        />
      )}
      
      {currentUI === 'ranking' && (
        <RankingUI 
          data={uiData || []} 
          onClose={closeUI}
        />
      )}
      
      {currentUI === 'skillManager' && (
        <SkillManagerUI 
          data={uiData} 
          onClose={closeUI}
          onAllocateSkill={handleAllocateSkill}
          onResetSkills={handleResetSkills}
          onChangeJob={handleChangeJob}
        />
      )}
      
      {currentUI === 'result' && (
        <ResultUI 
          data={uiData} 
          onClose={closeUI}
        />
      )}
      
      <NotificationSystem notifications={notifications} onRemove={removeNotification} />
    </div>
  );
};

export default HazardZoneNUI;