/**
 * Notification Store - Global Snackbar State
 * @module shared/lib/notification
 * 
 * Per Code_Cleanup_Guidelines.md: Replace console.log/alert with global notification
 */

import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    autoHideDuration?: number;
}

interface NotificationState {
    notifications: Notification[];

    // Actions
    showNotification: (message: string, type?: NotificationType, duration?: number) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

let notificationId = 0;

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],

    showNotification: (message, type = 'info', duration = 5000) => {
        const id = `notification-${++notificationId}`;
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id, message, type, autoHideDuration: duration },
            ],
        }));

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            }, duration);
        }
    },

    showSuccess: (message) => {
        const id = `notification-${++notificationId}`;
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id, message, type: 'success', autoHideDuration: 4000 },
            ],
        }));
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 4000);
    },

    showError: (message) => {
        const id = `notification-${++notificationId}`;
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id, message, type: 'error', autoHideDuration: 8000 },
            ],
        }));
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 8000);
    },

    showWarning: (message) => {
        const id = `notification-${++notificationId}`;
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id, message, type: 'warning', autoHideDuration: 6000 },
            ],
        }));
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 6000);
    },

    showInfo: (message) => {
        const id = `notification-${++notificationId}`;
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id, message, type: 'info', autoHideDuration: 5000 },
            ],
        }));
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 5000);
    },

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearAll: () => set({ notifications: [] }),
}));

/**
 * Hook for components to trigger notifications
 */
export function useNotification() {
    const showNotification = useNotificationStore((state) => state.showNotification);
    const showSuccess = useNotificationStore((state) => state.showSuccess);
    const showError = useNotificationStore((state) => state.showError);
    const showWarning = useNotificationStore((state) => state.showWarning);
    const showInfo = useNotificationStore((state) => state.showInfo);

    return {
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}
