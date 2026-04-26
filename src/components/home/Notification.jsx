"use client";
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  fetchAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/redux/notificationsSlice';
import { useTranslations } from 'next-intl';

const pickFirst = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== '') ?? '';

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const getNotificationId = (notification) => pickFirst(notification?.id, notification?._id);

const isNotificationRead = (notification) =>
  Boolean(notification?.readAt || notification?.isRead || notification?.read);

const getNotificationPerson = (notification) => {
  const actor =
    notification?.actor ||
    notification?.sender ||
    notification?.user ||
    notification?.createdBy ||
    notification?.maintainer ||
    notification?.admin ||
    {};

  return {
    name: pickFirst(
      actor?.name,
      actor?.fullName,
      actor?.email,
      notification?.title,
      notification?.name,
      'Notification'
    ),
    image: pickFirst(actor?.avatar, actor?.image, actor?.profileImage, notification?.image, '/BProfile.png'),
  };
};

const mapNotification = (notification, t) => {
  const person = getNotificationPerson(notification);

  return {
    id: getNotificationId(notification),
    name: person.name,
    message: pickFirst(
      notification?.message,
      notification?.body,
      notification?.description,
      notification?.content,
      notification?.text,
      t('noMessage')
    ),
    date: formatDate(pickFirst(notification?.createdAt, notification?.updatedAt, notification?.date)),
    image: person.image,
    isRead: isNotificationRead(notification),
  };
};

const NotificationSection = () => {
  const dispatch = useDispatch();
  const t = useTranslations('Notifications');
  
  const {
    notifications,
    status,
    error,
    markReadStatus,
    markAllReadStatus,
    markReadError,
  } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchAdminNotifications());
  }, [dispatch]);

  const notificationItems = useMemo(
    () => notifications.map((n) => mapNotification(n, t)),
    [notifications, t]
  );
  const unreadCount = notificationItems.filter((notification) => !notification.isRead).length;

  const handleMarkRead = (notification) => {
    if (!notification.id || notification.isRead || markReadStatus === 'loading') {
      return;
    }

    dispatch(markNotificationRead({ id: notification.id }));
  };

  const handleMarkAllRead = () => {
    if (!unreadCount || markAllReadStatus === 'loading') {
      return;
    }

    dispatch(markAllNotificationsRead());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={!unreadCount || markAllReadStatus === 'loading'}
          >
            {markAllReadStatus === 'loading' ? t('marking') : t('markAllRead')}
          </Button>
        </div>

        {status === 'loading' ? (
          <p className="text-sm text-gray-500">{t('loading')}</p>
        ) : null}

        {status === 'failed' ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : null}

        {markReadError ? (
          <p className="mb-4 text-sm text-red-500">{markReadError}</p>
        ) : null}

        <div className="space-y-4">
          {notificationItems.map((notification) => (
            <Card
              key={notification.id}
              className={`border transition-shadow hover:shadow-md ${
                notification.isRead ? 'border-gray-200 bg-white' : 'border-[#4FB2FE] bg-white'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <img 
                      src={notification.image} 
                      alt={notification.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {!notification.isRead ? (
                          <span className="h-2 w-2 rounded-full bg-[#4FB2FE]" />
                        ) : null}
                        <h3 className="font-semibold text-gray-900 text-base">{notification.name}</h3>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{notification.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                    {!notification.isRead ? (
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[#1677B8]"
                          onClick={() => handleMarkRead(notification)}
                          disabled={markReadStatus === 'loading'}
                        >
                          {t('markAsRead')}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {status === 'succeeded' && !notificationItems.length ? (
            <Card className="border border-gray-200">
              <CardContent className="p-8 text-center text-sm text-gray-500">
                {t('noNotifications')}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;
