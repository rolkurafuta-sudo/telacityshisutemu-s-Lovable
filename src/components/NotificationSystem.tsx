import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationTriangle, 
  faInfoCircle, 
  faTimesCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  useEffect(() => {
    notifications.forEach(notification => {
      const duration = notification.duration || 3000;
      setTimeout(() => {
        onRemove(notification.id);
      }, duration);
    });
  }, [notifications, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faTimesCircle;
      case 'warning':
        return faExclamationTriangle;
      default:
        return faInfoCircle;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-accent border-accent text-accent-foreground';
      case 'error':
        return 'bg-destructive border-destructive text-destructive-foreground';
      case 'warning':
        return 'bg-yellow-600 border-yellow-600 text-white';
      default:
        return 'bg-secondary border-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`gaming-notification flex items-center gap-3 min-w-80 ${getStyles(notification.type)}`}
        >
          <FontAwesomeIcon icon={getIcon(notification.type)} className="text-lg" />
          <span className="flex-1 font-medium">{notification.message}</span>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-current hover:opacity-70 transition-opacity"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;