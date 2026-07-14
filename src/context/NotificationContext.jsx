import { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { getNotifications } from '../api/notifications.js';
import { useAuth } from './AuthContext.jsx';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    // No user, nothing to fetch. This also stops a request firing on the
    // login page, which would 401 and bounce the user around.
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

  // Runs on mount, and again whenever the user changes, so logging out clears
  // the previous user's alerts rather than leaving them on screen.
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Called from the Alerts page. The bell in the Layout updates too, because
  // both read the same context.
  const markOneAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));

    // Never let this go negative if something is called twice.
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    refetch: fetchNotifications,
    markOneAsRead,
    markAllRead,
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
