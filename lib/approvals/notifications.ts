export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  documentId: string;
  createdAt: string;
  read: boolean;
}

const notifications: InAppNotification[] = [];

export function notifyAuthor(
  authorUserId: string,
  documentId: string,
  documentName: string,
  message: string,
): InAppNotification {
  const notification: InAppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: authorUserId,
    title: 'Document review update',
    message: `${documentName}: ${message}`,
    documentId,
    createdAt: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(notification);
  console.info('[notification:author]', notification);
  return notification;
}

export function notifyNextReviewer(
  reviewerUserId: string,
  documentId: string,
  documentName: string,
): InAppNotification {
  const notification: InAppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: reviewerUserId,
    title: 'Approval required',
    message: `${documentName} is ready for your review.`,
    documentId,
    createdAt: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(notification);
  console.info('[notification:reviewer]', notification);
  return notification;
}

export function getNotificationsForUser(userId: string): InAppNotification[] {
  return notifications.filter((n) => n.userId === userId);
}
