"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { ChevronLeft, Star, MapPin, Menu, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BanUserModal from '@/components/modals/BanUserModal';
import { readStoredAuth, resolveAccessToken } from '@/lib/auth';
import { createSupportChat, fetchSupportChats, setActiveChat } from '@/redux/supportChatSlice';

const getAccessToken = () => resolveAccessToken(readStoredAuth()?.tokens);

const pickFirst = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== '') ?? '';

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    return [value];
  }

  return [];
};

const formatDate = (value, fallback = 'N/A') => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : fallback;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const formatDateTime = (value, fallback = 'N/A') => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : fallback;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const toTitleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const summarizeLogDescription = (log) => {
  const directDescription = pickFirst(
    log.message,
    log.description,
    log.details,
    log.summary,
    log.metadata?.message,
    log.meta?.message
  );

  if (directDescription) {
    return directDescription;
  }

  const entityType = pickFirst(log.entityType, log.entity?.type);
  const entityId = pickFirst(log.entityId, log.entity?.id);
  const source = pickFirst(log.source, log.origin);

  const parts = [
    entityType ? `Entity: ${toTitleCase(entityType)}` : '',
    entityId ? `ID: ${entityId}` : '',
    source ? `Source: ${toTitleCase(source)}` : '',
  ].filter(Boolean);

  return parts.join(' | ') || 'Activity recorded';
};

const classifyActivityCategory = (log) => {
  const action = String(pickFirst(log.action, log.type, log.event, log.name)).toLowerCase();
  const entityType = String(pickFirst(log.entityType, log.entity?.type)).toLowerCase();
  const source = String(pickFirst(log.source, log.origin)).toLowerCase();
  const message = String(
    pickFirst(log.message, log.description, log.details, log.summary)
  ).toLowerCase();

  if (
    action.startsWith('employment.') ||
    action.startsWith('role.') ||
    action.includes('.role_') ||
    action.includes('permission') ||
    entityType === 'role' ||
    entityType === 'employment' ||
    source === 'employment' ||
    source === 'role' ||
    message.includes('role')
  ) {
    return 'role';
  }

  if (
    action.startsWith('ai.') ||
    entityType === 'ai' ||
    source === 'ai' ||
    message.includes(' ai')
  ) {
    return 'ai';
  }

  if (
    action.startsWith('token.') ||
    action.startsWith('coin.') ||
    action.startsWith('referral.') ||
    action.includes('token') ||
    action.includes('coin') ||
    entityType === 'token' ||
    entityType === 'coin' ||
    source === 'token' ||
    source === 'coin' ||
    message.includes('token') ||
    message.includes('coin')
  ) {
    return 'tokens';
  }

  if (
    action.startsWith('subscription.') ||
    action.startsWith('plan.') ||
    action.includes('premium') ||
    entityType === 'subscription' ||
    entityType === 'plan' ||
    source === 'subscription' ||
    message.includes('subscription') ||
    message.includes('premium') ||
    message.includes('plan')
  ) {
    return 'premium';
  }

  if (
    action.startsWith('recruitment.') ||
    action.startsWith('job.') ||
    action.startsWith('application.') ||
    action.includes('job') ||
    action.includes('apply') ||
    entityType === 'recruitment' ||
    entityType === 'job' ||
    entityType === 'application' ||
    source === 'recruitment' ||
    source === 'job' ||
    message.includes('job') ||
    message.includes('application') ||
    message.includes('apply')
  ) {
    return 'job';
  }

  return 'all';
};

const mapActivityLogItem = (log, index) => ({
  id: pickFirst(log.id, log._id, `${index}`),
  title: toTitleCase(pickFirst(log.action, log.type, log.event, log.name, 'Activity')),
  description: summarizeLogDescription(log),
  date: formatDateTime(pickFirst(log.occurredAt, log.createdAt, log.updatedAt)),
  category: classifyActivityCategory(log),
});

const getInitials = (name) => {
  if (!name) {
    return 'U';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
};

const getPopupPosition = (triggerRect, popupWidth) => {
  const viewportPadding = 16;
  const top = Math.min(triggerRect.bottom + 8, window.innerHeight - 80);
  const left = Math.min(
    Math.max(triggerRect.left, viewportPadding),
    window.innerWidth - popupWidth - viewportPadding
  );

  return { top, left };
};

const buildGradientBackground = (background) => {
  const colors = background?.gradient?.colors;

  if (!Array.isArray(colors) || colors.length === 0) {
    return 'linear-gradient(90deg, #C0FFCE 0%, #E5FDEE 100%)';
  }

  const start = background?.gradient?.start ?? { x: 0, y: 0 };
  const end = background?.gradient?.end ?? { x: 1, y: 0 };
  const dx = Number(end.x ?? 1) - Number(start.x ?? 0);
  const dy = Number(end.y ?? 0) - Number(start.y ?? 0);
  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
  const colorStops = colors.map((color, index) => {
    const stop = colors.length === 1 ? 0 : (index / (colors.length - 1)) * 100;
    return `${color} ${stop}%`;
  });

  return `linear-gradient(${angle}deg, ${colorStops.join(', ')})`;
};

const getPositionStyle = (position = {}) => {
  const style = {};

  ['top', 'right', 'bottom', 'left'].forEach((side) => {
    if (typeof position?.[side] === 'number') {
      style[side] = `${position[side]}px`;
    }
  });

  return style;
};

const getSizeStyle = (size = {}) => ({
  width: typeof size?.width === 'number' ? `${size.width}px` : undefined,
  height: typeof size?.height === 'number' ? `${size.height}px` : undefined,
});

const BADGE_TIER_IMAGE_MAP = {
  bronze: '/bronze.png',
  silver: '/silver.png',
  gold: '/gold.png',
  diamond: '/diamond.png',
};

const hasValue = (value) => value !== undefined && value !== null && value !== '';

const getBusinessTypeLabel = (business, employment) =>
  pickFirst(
    employment?.role?.role?.name,
    employment?.role?.name,
    business?.category,
    business?.industry,
    business?.subscriptions?.[0]?.plan?.tier ? `${toTitleCase(business.subscriptions[0].plan.tier)} Plan` : '',
    business?.ownerId && employment ? 'Employee' : '',
    business?.ownerId ? 'Owned Business' : '',
    'Business'
  );

export default function UserProfileActivity({ userId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [mainTab, setMainTab] = useState('billing');
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isUserIdOpen, setIsUserIdOpen] = useState(false);
  const [userIdPopupPosition, setUserIdPopupPosition] = useState(null);
  const [profileStatus, setProfileStatus] = useState('idle');
  const [profileError, setProfileError] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [activityLogStatus, setActivityLogStatus] = useState('idle');
  const [activityLogError, setActivityLogError] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [chatLaunchStatus, setChatLaunchStatus] = useState('idle');
  const [chatLaunchError, setChatLaunchError] = useState('');
  const [restrictionStatus, setRestrictionStatus] = useState('idle');
  const [restrictionError, setRestrictionError] = useState('');
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);

  useEffect(() => {
    const handleViewportChange = () => {
      setIsUserIdOpen(false);
      setUserIdPopupPosition(null);
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadUserProfile = async () => {
      if (!userId) {
        setProfileStatus('failed');
        setProfileError('Missing user ID');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const accessToken = getAccessToken();

      if (!baseUrl) {
        setProfileStatus('failed');
        setProfileError('Missing NEXT_PUBLIC_API_BASE_URL');
        return;
      }

      if (!accessToken) {
        setProfileStatus('failed');
        setProfileError('Missing access token');
        return;
      }

      setProfileStatus('loading');
      setProfileError('');

      try {
        const response = await fetch(`${baseUrl}/users/admin/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load user profile');
        }

        const data =
          payload?.data?.user ||
          payload?.data?.result ||
          payload?.data ||
          payload?.user ||
          payload?.result ||
          payload;

        if (!data || typeof data !== 'object') {
          throw new Error('User profile response was empty');
        }

        setUserDetails(data);
        setProfileStatus('succeeded');
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }

        setProfileStatus('failed');
        setProfileError(error?.message || 'Failed to load user profile');
      }
    };

    loadUserProfile();

    return () => controller.abort();
  }, [userId, profileRefreshKey]);

  useEffect(() => {
    const controller = new AbortController();

    const loadActivityLogs = async () => {
      if (!userId) {
        setActivityLogStatus('failed');
        setActivityLogError('Missing user ID');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const accessToken = getAccessToken();

      if (!baseUrl) {
        setActivityLogStatus('failed');
        setActivityLogError('Missing NEXT_PUBLIC_API_BASE_URL');
        return;
      }

      if (!accessToken) {
        setActivityLogStatus('failed');
        setActivityLogError('Missing access token');
        return;
      }

      setActivityLogStatus('loading');
      setActivityLogError('');

      try {
        const params = new URLSearchParams({
          userId: String(userId),
          sort: 'createdAt:desc',
          limit: '50',
        });

        const response = await fetch(`${baseUrl}/activity-logs?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok || payload?.success === false) {
          throw new Error(payload?.message || 'Failed to load activity logs');
        }

        const rawLogs =
          payload?.data?.logs ||
          payload?.data?.items ||
          payload?.data?.results ||
          payload?.data?.docs ||
          payload?.data ||
          payload?.logs ||
          payload?.items ||
          payload?.results ||
          payload;

        const logs = Array.isArray(rawLogs) ? rawLogs : [];

        setActivityLogs(logs.map(mapActivityLogItem));
        setActivityLogStatus('succeeded');
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }

        setActivityLogStatus('failed');
        setActivityLogError(error?.message || 'Failed to load activity logs');
      }
    };

    loadActivityLogs();

    return () => controller.abort();
  }, [userId]);

  const profile = useMemo(() => {
    const data = userDetails || {};
    const fullName = pickFirst(data.name, data.fullName, data.username, data.displayName);
    const email = pickFirst(data.email, data.emailAddress);
    const phone = pickFirst(
      [data.countryCode, data.phoneNumber].filter(Boolean).join(' '),
      data.phone,
      data.mobile,
      data.contactNumber
    );
    const country = pickFirst(data.country, data.countryName, data.location?.country, data.address?.country);
    const city = pickFirst(data.city, data.location?.city, data.address?.city);
    const state = pickFirst(data.state, data.location?.state, data.address?.state);
    const location = pickFirst(
      [city, state, country].filter(Boolean).join(', '),
      data.address?.address,
      data.locationName,
      data.addressLine
    );
    const roleLabel = pickFirst(data.role, data.userType);
    const joinedDate = formatDate(pickFirst(data.createdAt, data.joinedAt, data.joinDate), '');
    const statusRaw = pickFirst(
      data.status,
      typeof data.isActive === 'boolean' ? (data.isActive ? 'Active' : 'Inactive') : '',
      typeof data.isDeleted === 'boolean' ? (data.isDeleted ? 'Deleted' : '') : ''
    );
    const statusLabel = typeof statusRaw === 'string' ? statusRaw : String(statusRaw);
    const isRestricted =
      data.isRestricted === true ||
      data.isRestricted === 'true' ||
      data.restricted === true ||
      data.restricted === 'true' ||
      String(statusRaw).toLowerCase().includes('restrict') ||
      String(statusRaw).toLowerCase().includes('ban');
    const language = pickFirst(data.appSettings?.language, data.language, data.locale);
    const identifier = pickFirst(data.id, data._id, userId);
    const isPremium =
      data.isPremium === true ||
      data.isPremium === 'true' ||
      data.plan === 'Premium' ||
      data.subscription?.plan === 'Premium' ||
      data.subscriptions?.some((subscription) => subscription?.status === 'active');
    const activeSubscription =
      toArray(data.subscriptions).find((subscription) => subscription?.status === 'active') ||
      data.subscription ||
      null;
    const currentPlan = isPremium
      ? pickFirst(
          activeSubscription?.plan?.tier ? toTitleCase(activeSubscription.plan.tier) : '',
          data.plan,
          data.subscription?.plan,
          data.currentPlan
        )
      : pickFirst(data.plan, data.subscription?.plan, data.currentPlan);
    const planStarted = formatDate(
      pickFirst(activeSubscription?.startDate, data.subscription?.startDate, data.planStartDate),
      ''
    );
    const planEnds = formatDate(
      pickFirst(activeSubscription?.endDate, data.subscription?.endDate, data.planEndDate),
      ''
    );
    const ownedBusinesses = toArray(data.ownedBusinesses).map((business) => ({
      id: pickFirst(business?.id, business?._id),
      name: pickFirst(business?.name, business?.businessName),
      type: getBusinessTypeLabel(business, null),
      logo: pickFirst(business?.logo, business?.image, business?.coverPhoto),
    }));
    const employmentBusinesses = toArray(data.employments)
      .map((employment) => {
        const business = employment?.business;

        if (!business || typeof business !== 'object') {
          return null;
        }

        return {
          id: pickFirst(business?.id, business?._id),
          name: pickFirst(business?.name, business?.businessName),
          type: getBusinessTypeLabel(business, employment),
          logo: pickFirst(business?.logo, business?.image, business?.coverPhoto),
        };
      })
      .filter(Boolean);
    const businesses = [...ownedBusinesses, ...employmentBusinesses].filter(
      (business, index, items) =>
        business?.id &&
        items.findIndex((candidate) => candidate?.id === business.id) === index
    );
    const referrals = toArray(
      pickFirst(
        data.referrals,
        data.referralHistory,
        data.referralLogs,
        data.referralRewards,
        data.referralEarnings
      )
    )
      .map((referral, index) => ({
        id: pickFirst(referral?.id, referral?._id, `${index}`),
        user: pickFirst(
          referral?.user?.name,
          referral?.referredUser?.name,
          referral?.invitee?.name,
          referral?.name
        ),
        date: formatDate(
          pickFirst(
            referral?.earnedAt,
            referral?.createdAt,
            referral?.updatedAt,
            referral?.date
          ),
          ''
        ),
        tokens: pickFirst(
          referral?.tokens,
          referral?.coins,
          referral?.rewardAmount,
          referral?.amount
        ),
      }))
      .filter((referral) => hasValue(referral.user) || hasValue(referral.date) || hasValue(referral.tokens));
    const badges = Array.isArray(data.appearance?.badges)
      ? data.appearance.badges
      : Array.isArray(data.badges)
        ? data.badges
        : [];
    const equippedBadge =
      badges
        .filter((badge) => badge?.isEquipped)
        .sort((first, second) => (first?.equippedSlot ?? Number.MAX_SAFE_INTEGER) - (second?.equippedSlot ?? Number.MAX_SAFE_INTEGER))[0] ||
      badges[0] ||
      null;
    const badgeTier = String(pickFirst(equippedBadge?.tier, '')).toLowerCase();
    const rating = Number.isFinite(Number(data.rating)) ? Number(data.rating) : 0;
    const nameplate = data.appearance?.nameplate;
    const nameplateBorder = nameplate?.metadata?.border;
    const nameplateBackground = nameplate?.metadata?.background;
    const nameplateElement = nameplate?.metadata?.element;

    return {
      fullName,
      email,
      phone,
      country,
      location,
      roleLabel,
      joinedDate,
      statusLabel,
      isRestricted,
      language,
      identifier,
      currentPlan,
      planStarted,
      planEnds,
      rating,
      businesses,
      referrals,
      badgeTier,
      nameplateBorder,
      nameplateBackground,
      nameplateElement,
    };
  }, [userDetails, userId]);

  const statusTone = profile.statusLabel.toLowerCase();
  const statusClassName = statusTone.includes('active')
    ? 'text-green-600'
    : statusTone.includes('ban') || statusTone.includes('delete') || statusTone.includes('inactive')
      ? 'text-red-600'
      : 'text-gray-900';
  const filteredActivityLogs = activityLogs.filter(
    (item) => activeTab === 'all' || item.category === activeTab
  );
  const profileCardStyle = {
    background: buildGradientBackground(profile.nameplateBackground),
    borderColor: profile.nameplateBorder?.color || '#89BC94',
    borderTopWidth: `${profile.nameplateBorder?.width?.top ?? 1}px`,
    borderLeftWidth: `${profile.nameplateBorder?.width?.left ?? 1}px`,
    borderRightWidth: `${profile.nameplateBorder?.width?.right ?? 1}px`,
    borderBottomWidth: `${profile.nameplateBorder?.width?.bottom ?? 1}px`,
    borderRadius: `${profile.nameplateBorder?.radius ?? 16}px`,
  };
  const nameplateIcon = profile.nameplateElement?.icon;
  const nameplateOverlays = Array.isArray(profile.nameplateElement?.overlays)
    ? profile.nameplateElement.overlays
    : [];
  const equippedBadgeImage = BADGE_TIER_IMAGE_MAP[profile.badgeTier] || '/badge.png';
  const nameplateBorderColor = profile.nameplateBorder?.color || '#89BC94';
  const restrictionActionLabel = profile.isRestricted ? 'Unban' : 'Ban';

  const handleStartChat = async () => {
    if (!userId || chatLaunchStatus === 'loading') {
      return;
    }

    setChatLaunchStatus('loading');
    setChatLaunchError('');

    try {
      const chat = await dispatch(createSupportChat(userId)).unwrap();
      const chatId = pickFirst(chat?.id, chat?._id);

      if (!chatId) {
        throw new Error('Support chat was created without a chat id');
      }

      dispatch(setActiveChat(chatId));
      await dispatch(fetchSupportChats({ page: 1, limit: 20 }));
      router.push(`/support-chat?chatId=${chatId}`);
      setChatLaunchStatus('succeeded');
    } catch (error) {
      setChatLaunchStatus('failed');
      setChatLaunchError(error?.message || 'Failed to open support chat');
    }
  };

  const handleBanUser = async ({ isRestricted, reason }) => {
    if (!userId || restrictionStatus === 'loading') {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const accessToken = getAccessToken();

    if (!baseUrl) {
      setRestrictionStatus('failed');
      setRestrictionError('Missing NEXT_PUBLIC_API_BASE_URL');
      return;
    }

    if (!accessToken) {
      setRestrictionStatus('failed');
      setRestrictionError('Missing access token');
      return;
    }

    setRestrictionStatus('loading');
    setRestrictionError('');

    try {
      const response = await fetch(`${baseUrl}/admin/support/users/${userId}/restriction`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          isRestricted: Boolean(isRestricted),
          ...(Boolean(isRestricted) ? { reason: reason?.trim() || 'violated platform policy' } : {}),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.message || 'Failed to update user restriction');
      }

      setRestrictionStatus('succeeded');
      setIsBanModalOpen(false);
      setProfileRefreshKey((current) => current + 1);
    } catch (error) {
      setRestrictionStatus('failed');
      setRestrictionError(error?.message || 'Failed to update user restriction');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Button
            variant="ghost"
            className="mb-4 pl-0"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push('/users');
              }
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            User
          </Button>

          {profileStatus === 'failed' ? (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{profileError}</AlertDescription>
            </Alert>
          ) : null}

          <Card className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] shadow-[0_1px_4px_rgba(0,0,0,0.05),0_6px_24px_rgba(0,0,0,0.04)]">
            <CardContent className="space-y-4 p-[18px]">
              <div
                className="relative overflow-hidden border border-solid shadow-none"
                style={profileCardStyle}
              >
                {nameplateOverlays.map((overlay, index) => (
                  <img
                    key={pickFirst(overlay?.url, `${index}`)}
                    src={overlay?.url}
                    alt=""
                    className="pointer-events-none absolute z-0 object-contain"
                    style={{
                      ...getSizeStyle(overlay?.size),
                      ...getPositionStyle(overlay?.position),
                    }}
                  />
                ))}
                {nameplateIcon?.url ? (
                  <img
                    src={nameplateIcon.url}
                    alt=""
                    className="pointer-events-none absolute z-10 object-contain"
                    style={{
                      ...getSizeStyle(nameplateIcon?.size),
                      ...getPositionStyle(nameplateIcon?.position),
                    }}
                  />
                ) : null}
                <div className="flex min-h-[115px] items-center gap-[10px] px-[10px] py-[12px]">
                  <Avatar
                    className="relative z-20 h-[90px] w-[90px] shrink-0 rounded-full border-[2px] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.05)]"
                    style={{ borderColor: nameplateBorderColor }}
                  >
                    <AvatarImage
                      className="object-cover"
                      src={pickFirst(
                        userDetails?.avatar,
                        userDetails?.image,
                        userDetails?.photoUrl,
                        '/placeholder.svg'
                      )}
                    />
                    <AvatarFallback className="bg-[#4FB2F3] text-lg font-semibold text-white">
                      {getInitials(profile.fullName || userDetails?.email || userId)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="relative z-20 flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-[7px]">
                      <div className="flex items-center gap-[5px]">
                        <h2 className="truncate text-base font-normal leading-6 text-[#11293A]">
                          {profile.fullName}
                        </h2>
                        <BadgeCheck className="h-[22px] w-[22px] shrink-0 fill-[#4FB2F3] text-[#4FB2F3]" />
                      </div>

                      {hasValue(profile.location) ? (
                        <div className="flex items-center gap-[5px] text-[#11293A]">
                          <MapPin className="h-5 w-5 shrink-0 stroke-[1.8]" />
                          <span className="truncate text-sm font-normal leading-5">
                            {profile.location}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {hasValue(profile.roleLabel) || profile.badgeTier ? (
                      <div className="flex items-center gap-2">
                        {hasValue(profile.roleLabel) ? (
                          <div
                            className="rounded-[8px] border bg-white/50 px-3 py-1 text-sm font-semibold leading-5 text-[#11293A] shadow-[inset_0_1px_1px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.05),0_6px_24px_rgba(0,0,0,0.04)]"
                            style={{ borderColor: nameplateBorderColor }}
                          >
                            {profile.roleLabel}
                          </div>
                        ) : null}
                        {profile.badgeTier ? (
                          <img src={equippedBadgeImage} alt="" className="h-[34px] w-auto shrink-0" />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-[7px]">
                  <div className="flex items-center gap-[9px]">
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#E5F4FD]">
                      <Star className="h-5 w-5 text-[#11293A]" />
                    </div>
                    <span className="text-sm font-semibold leading-5 text-[#111111]">Rating Summary</span>
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={
                            star <= Math.round(profile.rating)
                              ? 'h-6 w-6 fill-[#F1C400] text-[#F1C400]'
                              : 'h-6 w-6 fill-transparent text-[#D1D5DB]'
                          }
                        />
                      ))}
                    </div>
                    {hasValue(profile.rating) ? (
                      <p className="mt-[7px] text-center text-sm font-normal leading-5 text-[#7A7A7A]">
                        Based on {profile.rating} overall rating
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-[18px] font-semibold leading-7 text-black">Details</h3>
                  <div className="border-t border-[#EBEBEB]" />
                  <div className="space-y-2 text-sm leading-5">
                    {hasValue(profile.fullName) ? (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-black">User name:</span>
                        <span className="text-[#7A7A7A]">{profile.fullName}</span>
                      </div>
                    ) : null}
                    {hasValue(profile.email) ? (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-[#11293A]">Email:</span>
                        <span className="min-w-0 break-all text-[#7A7A7A]">{profile.email}</span>
                      </div>
                    ) : null}
                    {hasValue(profile.statusLabel) ? (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-[#11293A]">Status:</span>
                        <span className={statusClassName === 'text-green-600' ? 'text-[#7A7A7A]' : statusClassName}>
                          {profile.statusLabel}
                        </span>
                      </div>
                    ) : null}
                    {hasValue(profile.identifier) ? (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-black">ID:</span>
                        <div className="relative min-w-0">
                          <button
                            type="button"
                            onClick={(event) => {
                              if (isUserIdOpen) {
                                setIsUserIdOpen(false);
                                setUserIdPopupPosition(null);
                                return;
                              }

                              setUserIdPopupPosition(
                                getPopupPosition(event.currentTarget.getBoundingClientRect(), 220)
                              );
                              setIsUserIdOpen(true);
                            }}
                            className="text-left text-[#7A7A7A] transition-colors hover:text-[#4FB2F3]"
                          >
                            {profile.identifier}
                          </button>
                          {isUserIdOpen && userIdPopupPosition ? (
                            <>
                              <button
                                type="button"
                                aria-label="Close full ID popup"
                                onClick={() => {
                                  setIsUserIdOpen(false);
                                  setUserIdPopupPosition(null);
                                }}
                                className="fixed inset-0 z-10 cursor-default"
                              />
                              <div
                                className="fixed z-20 max-w-[220px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-lg"
                                style={userIdPopupPosition}
                              >
                                Full ID: {profile.identifier}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                    {hasValue(profile.phone) ? (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-black">Contact:</span>
                        <span className="text-[#7A7A7A]">{profile.phone}</span>
                      </div>
                    ) : null}
                    {hasValue(profile.joinedDate) ? (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-black">Joined Date :</span>
                        <span className="text-[#7A7A7A]">{profile.joinedDate}</span>
                      </div>
                    ) : null}
                    {hasValue(profile.language) ? (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-black">Language:</span>
                        <span className="text-[#7A7A7A]">{profile.language}</span>
                      </div>
                    ) : null}
                    {hasValue(profile.country) ? (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-black">Country:</span>
                        <span className="text-[#7A7A7A]">{profile.country}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="border-t border-[#EBEBEB]" />

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold leading-6 text-[#11293A]">User Business</h3>
                  <div className="space-y-2">
                    {profile.businesses.length ? (
                      profile.businesses.map((business) => (
                        <div
                          key={business.id}
                          className="relative flex h-11 items-center gap-2 rounded-[12px] border border-[#EBEBEB] bg-white px-3 py-[6px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.05),0_6px_24px_rgba(0,0,0,0.04)]"
                        >
                          <img
                            src={business.logo || '/BProfile.png'}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                          />
                          <div className="min-w-0 text-[#11293A]">
                            {hasValue(business.name) ? (
                              <div className="truncate text-sm font-semibold leading-5">{business.name}</div>
                            ) : null}
                            {hasValue(business.type) ? (
                              <div className="truncate text-xs font-normal leading-4">{business.type}</div>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#7A7A7A]">No businesses found.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-12">
                <Button
                  className="h-8 rounded-[8px] bg-[#4FB2F3] px-4 py-1 text-sm font-normal text-white hover:bg-[#4FB2F3]"
                  onClick={handleStartChat}
                  disabled={chatLaunchStatus === 'loading' || profileStatus === 'loading'}
                >
                  {chatLaunchStatus === 'loading' ? 'Opening...' : 'Chat'}
                </Button>
                <Button
                  variant="destructive"
                  className="h-8 rounded-[8px] bg-[#F34F4F] px-4 py-1 text-sm font-normal text-white hover:bg-[#F34F4F]"
                  onClick={() => setIsBanModalOpen(true)}
                  disabled={restrictionStatus === 'loading'}
                >
                  {restrictionStatus === 'loading' ? 'Saving...' : restrictionActionLabel}
                </Button>
              </div>
              {chatLaunchError ? (
                <p className="text-center text-sm text-red-500">{chatLaunchError}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {profileStatus === 'loading' ? (
            <p className="mb-4 text-sm text-gray-500">Loading user profile...</p>
          ) : null}

          <Tabs value={mainTab} onValueChange={setMainTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent p-0">
              <TabsTrigger
                value="billing"
                className="border border-transparent bg-white data-[state=active]:border-2 data-[state=active]:border-[#4FB2FE] data-[state=active]:bg-[#ECF7FE] data-[state=active]:shadow-none"
              >
                Billing & Plan
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="border border-transparent bg-white data-[state=active]:border-2 data-[state=active]:border-[#4FB2FE] data-[state=active]:bg-[#ECF7FE] data-[state=active]:shadow-none"
              >
                Activity Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant={activeTab === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('all')}
                      className={activeTab === 'all' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                    >
                      All
                    </Button>
                    <Button
                      variant={activeTab === 'role' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('role')}
                      className={activeTab === 'role' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                    >
                      Role Changes
                    </Button>
                    <Button
                      variant={activeTab === 'ai' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('ai')}
                      className={activeTab === 'ai' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                    >
                      AI Actions
                    </Button>
                    <Button
                      variant={activeTab === 'tokens' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('tokens')}
                      className={activeTab === 'tokens' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                    >
                      Tokens
                    </Button>
                    <Button
                      variant={activeTab === 'premium' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('premium')}
                      className={activeTab === 'premium' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                    >
                      Premium
                    </Button>
                    <Button
                      variant={activeTab === 'job' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('job')}
                      className={activeTab === 'job' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                    >
                      Job Posts
                    </Button>
                  </div>

                  {activityLogStatus === 'loading' ? (
                    <p className="mb-4 text-sm text-gray-500">Loading activity logs...</p>
                  ) : null}
                  {activityLogStatus === 'failed' ? (
                    <p className="mb-4 text-sm text-red-500">{activityLogError}</p>
                  ) : null}

                  <div className="space-y-3">
                    {filteredActivityLogs.length ? (
                      filteredActivityLogs.map((item) => (
                        <div key={item.id} className="rounded-lg border-l-4 border-[#4FB2F3] bg-blue-50 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="mb-1 font-medium text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <span className="ml-4 whitespace-nowrap text-xs text-gray-500">{item.date}</span>
                          </div>
                        </div>
                      ))
                    ) : activityLogStatus === 'succeeded' ? (
                      <p className="text-sm text-gray-500">No activity logs found.</p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Referrals</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Tokens</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.referrals.length ? (
                          profile.referrals.map((referral) => (
                            <tr key={referral.id} className="border-b last:border-0">
                              <td className="px-4 py-3 text-sm">{referral.user || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{referral.date || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm">{hasValue(referral.tokens) ? referral.tokens : 'N/A'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-500" colSpan={3}>
                              N/A
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="mt-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="mb-1 text-sm font-medium">Current Plan is {profile.currentPlan}</p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Active :</span> {profile.planStarted} till {profile.planEnds}
                      </p>
                    </div>

                  </CardContent>
                </Card>

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertDescription>
                    <p className="mb-1 font-semibold text-orange-700">We need your attention!</p>
                    <p className="text-sm text-orange-600">This plan requires update</p>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BanUserModal
        open={isBanModalOpen}
        onOpenChange={(nextOpen) => {
          setIsBanModalOpen(nextOpen);
          if (!nextOpen) {
            setRestrictionError('');
            setRestrictionStatus('idle');
          }
        }}
        onConfirm={handleBanUser}
        userName={profile.fullName}
        isRestricted={profile.isRestricted}
        loading={restrictionStatus === 'loading'}
        error={restrictionError}
      />
    </div>
  );
}
