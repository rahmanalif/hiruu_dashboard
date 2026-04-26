"use client";
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Coins,
  MessageCircle,
  Megaphone,
  Phone,
  RefreshCw,
  Settings,
  TicketCheck,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  fetchAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
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

const safeJsonParse = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getNotificationPerson = (notification) => {
  const metadata = safeJsonParse(notification?.metadata, {}) || {};
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
      metadata?.callerName,
      metadata?.requesterName,
      metadata?.applicantName,
      metadata?.invitedByName,
      notification?.title,
      notification?.name,
      'Notification'
    ),
    image: pickFirst(
      actor?.avatar,
      actor?.image,
      actor?.profileImage,
      metadata?.callerAvatar,
      metadata?.businessAvatar,
      notification?.image,
      '/BProfile.png'
    ),
  };
};

const EVENT_TONE = {
  business_announcement: {
    icon: Megaphone,
    className: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
    unreadClassName: 'border-cyan-200 bg-cyan-50/40',
  },
  support_ticket_update: {
    icon: TicketCheck,
    className: 'bg-violet-50 text-violet-700 ring-violet-100',
    unreadClassName: 'border-violet-200 bg-violet-50/40',
  },
  system_maintenance: {
    icon: Settings,
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
    unreadClassName: 'border-slate-300 bg-slate-50',
  },
  chat_message: {
    icon: MessageCircle,
    className: 'bg-sky-50 text-sky-700 ring-sky-100',
    unreadClassName: 'border-sky-200 bg-sky-50/50',
  },
  call_incoming: {
    icon: Phone,
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    unreadClassName: 'border-emerald-200 bg-emerald-50/50',
  },
  clock_in_reminder: {
    icon: CalendarClock,
    className: 'bg-amber-50 text-amber-700 ring-amber-100',
    unreadClassName: 'border-amber-200 bg-amber-50/50',
  },
  coins_earned: {
    icon: Coins,
    className: 'bg-yellow-50 text-yellow-700 ring-yellow-100',
    unreadClassName: 'border-yellow-200 bg-yellow-50/50',
  },
  achievement_unlocked: {
    icon: Award,
    className: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100',
    unreadClassName: 'border-fuchsia-200 bg-fuchsia-50/40',
  },
  shift_assigned: {
    icon: BriefcaseBusiness,
    className: 'bg-blue-50 text-blue-700 ring-blue-100',
    unreadClassName: 'border-blue-200 bg-blue-50/40',
  },
  shift_cancelled: {
    icon: XCircle,
    className: 'bg-rose-50 text-rose-700 ring-rose-100',
    unreadClassName: 'border-rose-200 bg-rose-50/40',
  },
  shift_changed: {
    icon: RefreshCw,
    className: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    unreadClassName: 'border-indigo-200 bg-indigo-50/40',
  },
  shift_swap_requested: {
    icon: RefreshCw,
    className: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    unreadClassName: 'border-indigo-200 bg-indigo-50/40',
  },
  shift_swap_approved: {
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 ring-green-100',
    unreadClassName: 'border-green-200 bg-green-50/40',
  },
  shift_swap_rejected: {
    icon: XCircle,
    className: 'bg-red-50 text-red-700 ring-red-100',
    unreadClassName: 'border-red-200 bg-red-50/40',
  },
  leave_approved: {
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 ring-green-100',
    unreadClassName: 'border-green-200 bg-green-50/40',
  },
  leave_rejected: {
    icon: XCircle,
    className: 'bg-red-50 text-red-700 ring-red-100',
    unreadClassName: 'border-red-200 bg-red-50/40',
  },
};

const getEventTone = (type) =>
  EVENT_TONE[type] || {
    icon: Bell,
    className: 'bg-gray-100 text-gray-700 ring-gray-200',
    unreadClassName: 'border-[#4FB2FE] bg-sky-50/40',
  };

const LEGACY_EVENT_KEY_BY_TYPE = {
  business_announcement: 'businessUpdate',
  support_ticket_update: 'supportUpdate',
  system_maintenance: 'systemNotice',
  chat_message: 'chatMessage',
  call_incoming: 'incomingCall',
  clock_in_reminder: 'clockInReminder',
  coins_earned: 'coinsEarned',
  achievement_unlocked: 'achievementUnlocked',
  shift_assigned: 'shiftAssigned',
  shift_cancelled: 'shiftCancelled',
  shift_changed: 'shiftChanged',
  shift_swap_requested: 'shiftSwapRequested',
  shift_swap_approved: 'shiftSwapApproved',
  shift_swap_rejected: 'shiftSwapRejected',
  leave_approved: 'leaveApproved',
  leave_rejected: 'leaveRejected',
};

const getTranslatedText = (notification, t, metadata) => {
  const type = notification?.type;
  const event = notification?.event;
  const fallbackTitle = pickFirst(notification?.title, notification?.name, 'Notification');
  const fallbackBody = pickFirst(
    notification?.message,
    notification?.body,
    notification?.description,
    notification?.content,
    notification?.text,
    t('noMessage')
  );

  if (type && event) {
    const titleKey = `events.${type}.${event}.title`;
    const bodyKey = `events.${type}.${event}.body`;

    if (t.has(titleKey) || t.has(bodyKey)) {
      return {
        title: t.has(titleKey) ? t(titleKey, metadata) : fallbackTitle,
        body: t.has(bodyKey) ? t(bodyKey, metadata) : fallbackBody,
      };
    }
  }

  const legacyKey = LEGACY_EVENT_KEY_BY_TYPE[type];
  if (legacyKey) {
    const titleKey = `legacy.${legacyKey}.title`;
    const bodyKey = `legacy.${legacyKey}.body`;

    return {
      title: t.has(titleKey) ? t(titleKey, metadata) : fallbackTitle,
      body: t.has(bodyKey) ? t(bodyKey, metadata) : fallbackBody,
    };
  }

  return {
    title: fallbackTitle,
    body: fallbackBody,
  };
};

const getActionHref = (action, notification) => {
  const targetId = pickFirst(action?.targetId, notification.relatedEntityId);
  const query = targetId ? `?id=${encodeURIComponent(targetId)}` : '';

  switch (action?.key) {
    case 'open_chat':
    case 'join_call':
      return `/support-chat${query}`;
    case 'view_achievement':
      return `/reward${query}`;
    case 'view_business_update':
      return `/business-store${query}`;
    case 'view_system_notice':
      return `/setting${query}`;
    case 'view_shift_assignment':
    case 'review_shift_request':
      return `/users${query}`;
    default:
      return '';
  }
};

const getActionLabel = (action, t) => {
  const key = action?.key;
  if (key && t.has(`actions.${key}`)) {
    return t(`actions.${key}`);
  }

  return pickFirst(action?.label, t('actions.open'));
};

const mapNotification = (notification, t) => {
  const person = getNotificationPerson(notification);
  const type = notification?.type;
  const event = notification?.event;
  const metadata = safeJsonParse(notification?.metadata, {}) || {};
  const parsedActions = safeJsonParse(notification?.actions, []);
  const actions = Array.isArray(parsedActions) ? parsedActions : [];
  const tone = getEventTone(type);
  const { title, body } = getTranslatedText(notification, t, metadata);

  return {
    id: getNotificationId(notification),
    title,
    body,
    type,
    event,
    eventKey: type && event ? `${type}.${event}` : type || '',
    date: formatDate(pickFirst(notification?.createdAt, notification?.updatedAt, notification?.date)),
    image: person.image,
    actorName: person.name,
    metadata,
    actions,
    tone,
    businessName: pickFirst(metadata?.businessName, notification?.business?.name),
    businessAvatar: pickFirst(metadata?.businessAvatar, notification?.business?.avatar, notification?.business?.image),
    shiftDate: pickFirst(metadata?.shiftDate, metadata?.startsAt),
    rewardCoins: metadata?.rewardCoins,
    rank: metadata?.rank,
    isRead: isNotificationRead(notification),
    raw: notification,
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
    deleteStatus,
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

  const handleDelete = (id) => {
    if (!id || deleteStatus === 'loading') {
      return;
    }

    if (window.confirm('Are you sure you want to delete this notification?')) {
      dispatch(deleteNotification(id));
    }
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

        <div className="space-y-3">
          {notificationItems.map((notification) => (
            <Card
              key={notification.id}
              className={`overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-md ${
                notification.isRead ? 'border-gray-200 bg-white' : notification.tone.unreadClassName
              }`}
            >
              <CardContent className="p-0">
                <div className="grid grid-cols-[4px_1fr]">
                  <div className={notification.isRead ? 'bg-gray-200' : 'bg-[#4FB2FE]'} />
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-start gap-3 sm:flex-1">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 ${notification.tone.className}`}>
                          <notification.tone.icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {!notification.isRead ? (
                              <span className="h-2 w-2 rounded-full bg-[#4FB2FE]" aria-label={t('unread')} />
                            ) : null}
                            <h3 className="min-w-0 text-base font-semibold leading-6 text-gray-950">
                              {notification.title}
                            </h3>
                          </div>

                          <p className="mt-1 text-sm leading-6 text-gray-600">{notification.body}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {notification.businessName ? (
                              <Badge variant="outline" className="gap-1.5 border-sky-100 bg-sky-50 text-sky-800">
                                {notification.businessAvatar ? (
                                  <img
                                    src={notification.businessAvatar}
                                    alt=""
                                    className="h-4 w-4 rounded-full object-cover"
                                  />
                                ) : null}
                                {notification.businessName}
                              </Badge>
                            ) : null}

                            {notification.shiftDate ? (
                              <Badge variant="outline" className="border-amber-100 bg-amber-50 text-amber-800">
                                <CalendarClock className="h-3 w-3" />
                                {notification.shiftDate}
                              </Badge>
                            ) : null}

                            {notification.rewardCoins ? (
                              <Badge variant="outline" className="border-yellow-100 bg-yellow-50 text-yellow-800">
                                <Coins className="h-3 w-3" />
                                {notification.rewardCoins}
                              </Badge>
                            ) : null}

                            {notification.rank ? (
                              <Badge variant="outline" className="border-fuchsia-100 bg-fuchsia-50 text-fuchsia-800">
                                #{notification.rank}
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{notification.date}</span>
                        <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-gray-200">
                          <img
                            src={notification.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                      {notification.actions.map((action) => {
                        const href = getActionHref(action, notification.raw);
                        const label = getActionLabel(action, t);

                        if (!href) {
                          return null;
                        }

                        return (
                          <Button
                            key={`${notification.id}-${action.key}-${href}`}
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 border-[#B8E2FF] bg-white text-[#1677B8] hover:bg-sky-50 hover:text-[#0B5E96]"
                          >
                            <Link href={href}>{label}</Link>
                          </Button>
                        );
                      })}

                      {!notification.isRead ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-[#1677B8] hover:bg-sky-50 hover:text-[#0B5E96]"
                          onClick={() => handleMarkRead(notification)}
                          disabled={markReadStatus === 'loading'}
                        >
                          {t('markAsRead')}
                        </Button>
                      ) : null}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(notification.id)}
                        disabled={deleteStatus === 'loading'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t('delete')}
                      </Button>
                    </div>
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
