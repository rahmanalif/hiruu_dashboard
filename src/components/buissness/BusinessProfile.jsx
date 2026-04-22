"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  Users,
  Briefcase,
  UserCheck,
  Ban,
  ChevronLeft,
  Globe,
  Mail,
  Calendar,
  Crown,
  Star,
} from 'lucide-react';
import BanBusinessModal from '@/components/modals/BanBusinessModal';
import { readStoredAuth, resolveAccessToken } from '@/lib/auth';

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
    return fallback;
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

const formatRating = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(1) : '0.0';
};

const getRingOffset = (value) => {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? Math.max(0, Math.min(5, numericValue)) : 0;
  const circumference = 176;
  return circumference - (safeValue / 5) * circumference;
};

const toTitleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getStatusBadge = (business) => {
  if (business?.isDeleted) {
    return {
      label: 'Inactive',
      className: 'bg-red-100 text-red-800 border-red-200',
    };
  }

  if (business?.isVerified) {
    return {
      label: 'Verified',
      className: 'bg-green-100 text-green-800 border-green-200',
    };
  }

  return {
    label: 'Unverified',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  };
};

const getPlanDetails = (subscriptions) => {
  const activeSubscription =
    toArray(subscriptions).find((subscription) => subscription?.status === 'active') || null;

  if (!activeSubscription) {
    return {
      planLabel: 'Free',
      startDate: 'N/A',
      endDate: 'N/A',
      statusLabel: 'No active subscription',
    };
  }

  return {
    planLabel: toTitleCase(pickFirst(activeSubscription?.plan?.tier, 'Premium')),
    startDate: formatDate(activeSubscription?.startDate),
    endDate: formatDate(activeSubscription?.endDate),
    statusLabel: `${toTitleCase(activeSubscription?.billingCycle)} billing`,
  };
};

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

const BusinessProfile = ({ business, onBack }) => {
  const [activeTab, setActiveTab] = useState('billing');
  const [activityFilter, setActivityFilter] = useState('all');
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [profileStatus, setProfileStatus] = useState('idle');
  const [profileError, setProfileError] = useState('');
  const [businessDetails, setBusinessDetails] = useState(null);
  const [activityLogStatus, setActivityLogStatus] = useState('idle');
  const [activityLogError, setActivityLogError] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);

  const businessId = pickFirst(business?.id, business?._id);

  useEffect(() => {
    const controller = new AbortController();

    const loadBusiness = async () => {
      if (!businessId) {
        setProfileStatus('failed');
        setProfileError('Missing business ID');
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
        const response = await fetch(`${baseUrl}/business/admin/${businessId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok || payload?.success === false) {
          throw new Error(payload?.message || 'Failed to load business details');
        }

        const data = payload?.data || payload?.business || payload;

        if (!data || typeof data !== 'object') {
          throw new Error('Business profile response was empty');
        }

        setBusinessDetails(data);
        setProfileStatus('succeeded');
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }

        setProfileStatus('failed');
        setProfileError(error?.message || 'Failed to load business details');
      }
    };

    loadBusiness();

    return () => controller.abort();
  }, [businessId]);

  useEffect(() => {
    const controller = new AbortController();

    const loadActivityLogs = async () => {
      if (!businessId) {
        setActivityLogStatus('failed');
        setActivityLogError('Missing business ID');
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
          businessId: String(businessId),
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
  }, [businessId]);

  const profile = useMemo(() => {
    const data = businessDetails || business || {};
    const address = data.address || {};
    const subscriptions = toArray(data.subscriptions);
    const employments = toArray(data.employments);
    const roles = toArray(data.roles);
    const recruitments = toArray(data.recruitments);
    const owner = data.owner || {};
    const planDetails = getPlanDetails(subscriptions);
    const status = getStatusBadge(data);
    const totalEmployees = data._count?.employments ?? employments.length;
    const totalJobs = data._count?.recruitments ?? recruitments.length;
    const businessRoles = roles.map((roleItem) => ({
      id: pickFirst(roleItem?.id, roleItem?.roleId),
      name: pickFirst(roleItem?.role?.name, roleItem?.name, 'Role'),
      count: roleItem?._count?.employments ?? 0,
    }));
    const members = employments.map((employment) => ({
      id: employment?.id,
      name: pickFirst(employment?.user?.name, employment?.user?.email, 'Unknown user'),
      role: pickFirst(employment?.role?.role?.name, employment?.role?.name, 'Employee'),
      avatar: employment?.user?.avatar || '',
    }));

    return {
      id: pickFirst(data.id, data._id, businessId),
      name: pickFirst(data.name, business?.name, 'Business'),
      description: pickFirst(data.description, 'No description available.'),
      logo: pickFirst(data.logo, business?.logo, '/BProfile.png'),
      coverPhoto: pickFirst(data.coverPhoto, business?.coverPhoto, ''),
      location: pickFirst(address.address, [address.state, address.country].filter(Boolean).join(', '), 'N/A'),
      phone: pickFirst([data.countryCode, data.phoneNumber].filter(Boolean).join(' '), business?.phone, 'N/A'),
      email: pickFirst(data.email, owner.email, 'N/A'),
      website: pickFirst(data.website, 'N/A'),
      joinedDate: formatDate(data.createdAt),
      status,
      ownerName: pickFirst(owner.name, business?.owner, 'N/A'),
      ownerAvatar: pickFirst(owner.avatar, ''),
      isRecruiting: Boolean(data.isRecruiting),
      totalEmployees,
      totalJobs,
      rating: formatRating(data.rating),
      ratingSummary: {
        workEnvironment: formatRating(data.ratingSummary?.workEnvironment),
        payOnTime: formatRating(data.ratingSummary?.payOnTime),
        communication: formatRating(data.ratingSummary?.communication),
        totalRatings: data.ratingSummary?.totalRatings ?? 0,
      },
      planDetails,
      roles: businessRoles,
      members,
      socialLinks: data.social || {},
    };
  }, [business, businessDetails, businessId]);

  const filteredActivityLogs = activityLogs.filter(
    (item) => activityFilter === 'all' || item.category === activityFilter
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {onBack ? (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 flex items-center pl-0 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to list
        </Button>
      ) : null}

      {profileStatus === 'failed' ? (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{profileError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-start space-x-4 rounded-3xl bg-[#ECF7FE] px-8 py-6">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-white">
                  <img
                    src={profile.logo}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center space-x-2">
                    <h2 className="text-lg font-semibold">{profile.name}</h2>
                    {businessDetails?.isPremium ? (
                      <Crown className="h-5 w-5 text-[#F1C400]" />
                    ) : null}
                  </div>
                  <div className="mb-2 flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1 h-4 w-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-xl border-2 border-[#3EBF5A] px-2 py-1 text-sm font-medium">
                      Store
                    </span>
                    <Badge variant="outline" className={profile.status.className}>
                      {profile.status.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center space-x-2">
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#E5F4FD]">
                    <Star className="h-5 w-5 text-[#111111]" />
                  </div>
                  <span className="text-sm font-semibold">Rating Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: 'work environment',
                      value: profile.ratingSummary.workEnvironment,
                      color: '#FBBF24',
                    },
                    {
                      label: 'pay on time',
                      value: profile.ratingSummary.payOnTime,
                      color: '#10B981',
                    },
                    {
                      label: 'communication',
                      value: profile.ratingSummary.communication,
                      color: '#EF4444',
                    },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="relative mx-auto mb-2 h-16 w-16">
                        <svg className="h-16 w-16 -rotate-90 transform">
                          <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke={item.color}
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="176"
                            strokeDashoffset={getRingOffset(item.value)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{item.value}/5</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-xs text-gray-500">
                  Total ratings: {profile.ratingSummary.totalRatings}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-sm font-semibold">About</h3>
                <p className="text-sm leading-relaxed text-gray-600">{profile.description}</p>
              </div>

              <div className="mb-6 space-y-3">
                <h3 className="mb-3 text-sm font-semibold">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Business Name :</span>
                    <span className="text-right text-gray-600">{profile.name}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Location:</span>
                    <span className="text-right text-gray-600">{profile.location}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Joined Date :</span>
                    <span className="text-right text-gray-600">{profile.joinedDate}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Business Status:</span>
                    <Badge variant="outline" className={profile.status.className}>
                      {profile.status.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Contact:</span>
                    <span className="text-right text-gray-600">{profile.phone}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Email :</span>
                    <span className="break-all text-right text-xs text-gray-600">{profile.email}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Website:</span>
                    <span className="break-all text-right text-gray-600">{profile.website}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Owner:</span>
                    <span className="text-right text-gray-600">{profile.ownerName}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-4 text-sm font-semibold">Team & Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Total Employee</span>
                    </div>
                    <span className="font-semibold">{profile.totalEmployees}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Active job posting</span>
                    </div>
                    <span className="font-semibold">{profile.totalJobs}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Actively Recruiting</span>
                    </div>
                    <Badge className={profile.isRecruiting ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                      {profile.isRecruiting ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Members</h3>
                  <span className="text-sm text-gray-500">{profile.members.length}</span>
                </div>
                <div className="space-y-2">
                  {profile.roles.length ? (
                    profile.roles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <UserCheck className="h-5 w-5 text-gray-600" />
                          <span className="text-sm text-gray-600">{role.name}</span>
                        </div>
                        <span className="font-semibold">{role.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No roles found.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                {/* <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setIsBanModalOpen(true)}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Ban
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="border-b">
              <div className="flex space-x-2 p-2">
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`rounded-lg px-6 py-3 text-sm font-medium ${
                    activeTab === 'billing'
                      ? 'border-2 border-[#4FB2FE] bg-[#ECF7FE] text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Billing & Plan
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`rounded-lg px-6 py-3 text-sm font-medium ${
                    activeTab === 'account'
                      ? 'border-2 border-[#4FB2FE] bg-[#ECF7FE] text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Activity Log
                </button>
              </div>
            </div>

            <CardContent className="p-6">
              {profileStatus === 'loading' ? (
                <p className="text-sm text-gray-500">Loading business profile...</p>
              ) : null}

              {activeTab === 'account' ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">User Business Activity Timeline</h2>
                  </div>

                  <div className="flex space-x-2 overflow-x-auto">
                    <Button
                      variant={activityFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivityFilter('all')}
                      className={activityFilter === 'all' ? 'mr-2 rounded-full border-0 bg-[#4FB2F3] text-white hover:bg-[#4FB2F3]' : 'mr-2 rounded-full'}
                    >
                      All
                    </Button>
                    <Button
                      variant={activityFilter === 'role' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivityFilter('role')}
                      className={activityFilter === 'role' ? 'mr-2 rounded-full bg-[#4FB2F3] hover:bg-[#4FB2F3]' : 'mr-2 rounded-full'}
                    >
                      Role Changes
                    </Button>
                    <Button
                      variant={activityFilter === 'ai' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivityFilter('ai')}
                      className={activityFilter === 'ai' ? 'mr-2 rounded-full bg-[#4FB2F3] hover:bg-[#4FB2F3]' : 'mr-2 rounded-full'}
                    >
                      AI Actions
                    </Button>
                    <Button
                      variant={activityFilter === 'tokens' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivityFilter('tokens')}
                      className={activityFilter === 'tokens' ? 'mr-2 rounded-full bg-[#4FB2F3] hover:bg-[#4FB2F3]' : 'mr-2 rounded-full'}
                    >
                      Tokens
                    </Button>
                    <Button
                      variant={activityFilter === 'premium' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivityFilter('premium')}
                      className={activityFilter === 'premium' ? 'mr-2 rounded-full bg-[#4FB2F3] hover:bg-[#4FB2F3]' : 'mr-2 rounded-full'}
                    >
                      Premium
                    </Button>
                    <Button
                      variant={activityFilter === 'job' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivityFilter('job')}
                      className={activityFilter === 'job' ? 'rounded-full bg-[#4FB2F3] hover:bg-[#4FB2F3]' : 'rounded-full'}
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
                      filteredActivityLogs.map((activity) => (
                        <div key={activity.id} className="rounded-lg border-l-4 border-[#4FB2F3] bg-blue-50 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="mb-1 font-medium text-gray-900">{activity.title}</h3>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <span className="ml-4 whitespace-nowrap text-xs text-gray-500">{activity.date}</span>
                          </div>
                        </div>
                      ))
                    ) : activityLogStatus === 'succeeded' ? (
                      <p className="text-sm text-gray-500">No activity logs found.</p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 font-semibold">Current Plan</h3>
                      <div className="space-y-2">
                        <p className="text-sm">Current Plan is {profile.planDetails.planLabel}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Active :</span> {profile.planDetails.startDate} till {profile.planDetails.endDate}
                        </p>
                        <p className="text-sm text-gray-600">{profile.planDetails.statusLabel}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 font-semibold">Quick Stats</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-gray-500">Employees</p>
                          <p className="mt-2 text-2xl font-bold">{profile.totalEmployees}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-gray-500">Recruitments</p>
                          <p className="mt-2 text-2xl font-bold">{profile.totalJobs}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-gray-500">Rating</p>
                          <p className="mt-2 text-2xl font-bold">{profile.rating}/5</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BanBusinessModal
        open={isBanModalOpen}
        onOpenChange={setIsBanModalOpen}
        businessName={profile.name}
        ownerName={profile.ownerName}
      />
    </div>
  );
};

export default BusinessProfile;
