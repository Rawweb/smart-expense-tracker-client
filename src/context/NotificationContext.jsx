import { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { getNotifications } from '../api/notifications.js';
import { useAuth } from './AuthContext.jsx';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Ticks up every time a socket alert arrives. Pages watch this and refetch.
  const [alertTick, setAlertTick] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Could not load notifications:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markOneAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // Called by SocketContext when an alert pushes in from another device.
  // useCallback keeps its identity stable, so the socket effect does not
  // rebuild itself every render.
  const bumpAlertTick = useCallback(() => {
    setAlertTick((prev) => prev + 1);
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    refetch: fetchNotifications,
    markOneAsRead,
    markAllRead,
    alertTick,
    bumpAlertTick,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used inside a NotificationProvider');
  }

  return context;
};
