"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { readStoredAuth, resolveAccessToken } from '@/lib/auth';
// Table components inline
const Table = ({ children, ...props }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm" {...props}>{children}</table>
  </div>
);
const TableHeader = ({ children, ...props }) => <thead className="border-b" {...props}>{children}</thead>;
const TableBody = ({ children, ...props }) => <tbody className="[&_tr:last-child]:border-0" {...props}>{children}</tbody>;
const TableRow = ({ children, ...props }) => <tr className="border-b transition-colors hover:bg-gray-50" {...props}>{children}</tr>;
const TableHead = ({ children, ...props }) => <th className="h-12 px-4 text-left align-middle font-medium text-gray-600" {...props}>{children}</th>;
const TableCell = ({ children, ...props }) => <td className="p-4 align-middle" {...props}>{children}</td>;
import { Badge } from '@/components/ui/badge';
import { ChartAreaStacked } from '@/components/ui/chart-area-stacked';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import BusinessProfile from '../buissness/BusinessProfile';
import { fetchBusinessesQuery } from '@/redux/businessesSlice';

const getAccessToken = () => resolveAccessToken(readStoredAuth()?.tokens);

const periodOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

const getFirstValue = (sources, keys, fallback = 0) => {
  for (const source of sources) {
    if (!source || typeof source !== 'object') {
      continue;
    }

    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null) {
        return value;
      }
    }
  }

  return fallback;
};

const toNumber = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const formatCount = (value) => new Intl.NumberFormat('en-US').format(toNumber(value));

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(toNumber(value));

const formatGrowth = (value) => {
  const numericValue = toNumber(value);
  const sign = numericValue > 0 ? '+' : '';
  return `${sign}${numericValue.toFixed(2)}%`;
};

const buildOverviewStats = (payload) => {
  const data = payload?.data || {};
  const metrics = data?.metrics || {};
  const sources = [metrics, data, data.summary, data.statistics, data.stats];

  const newUsersValue = getFirstValue(sources, [
    'newUsers',
    'newUser',
    'newUsersCount',
    'newUserCount',
  ]);
  const newUsersGrowth = getFirstValue(sources, [
    'newUsersGrowth',
    'newUserGrowth',
    'newUsersGrowthPercent',
    'newUserGrowthPercent',
  ]);

  const totalUsersValue = getFirstValue(sources, [
    'totalUsers',
    'totalUser',
    'users',
    'userCount',
    'totalUsersCount',
  ]);
  const totalUsersGrowth = getFirstValue(sources, [
    'totalUsersGrowth',
    'totalUserGrowth',
    'totalUsersGrowthPercent',
    'totalUserGrowthPercent',
    'usersGrowthPercent',
  ]);

  const newBusinessesValue = getFirstValue(sources, [
    'newBusinesses',
    'newBusiness',
    'newBusinessesCount',
    'newBusinessCount',
  ]);
  const newBusinessesGrowth = getFirstValue(sources, [
    'newBusinessesGrowth',
    'newBusinessGrowth',
    'newBusinessesGrowthPercent',
    'newBusinessGrowthPercent',
  ]);

  const paymentsValue = getFirstValue(sources, [
    'payments',
    'payment',
    'paymentAmount',
    'totalPayments',
    'totalPaymentAmount',
  ]);
  const paymentsGrowth = getFirstValue(sources, [
    'paymentsGrowth',
    'paymentGrowth',
    'paymentsGrowthPercent',
    'paymentGrowthPercent',
  ]);

  return [
    {
      title: 'New users',
      value: formatCount(getFirstValue([metrics.newUsers], ['current'], newUsersValue)),
      change: formatGrowth(getFirstValue([metrics.newUsers], ['growthPercent'], newUsersGrowth)),
      isPositive: toNumber(getFirstValue([metrics.newUsers], ['growthPercent'], newUsersGrowth)) >= 0,
    },
    {
      title: 'Total User',
      value: formatCount(getFirstValue([metrics.totalUsers], ['current'], totalUsersValue)),
      change: formatGrowth(getFirstValue([metrics.totalUsers], ['growthPercent'], totalUsersGrowth)),
      isPositive: toNumber(getFirstValue([metrics.totalUsers], ['growthPercent'], totalUsersGrowth)) >= 0,
    },
    {
      title: 'New Businesses',
      value: formatCount(getFirstValue([metrics.newBusinesses], ['current'], newBusinessesValue)),
      change: formatGrowth(getFirstValue([metrics.newBusinesses], ['growthPercent'], newBusinessesGrowth)),
      isPositive: toNumber(getFirstValue([metrics.newBusinesses], ['growthPercent'], newBusinessesGrowth)) >= 0,
    },
    {
      title: 'Payments',
      value: formatCurrency(getFirstValue([metrics.payments], ['currentAmount', 'current'], paymentsValue)),
      change: formatGrowth(getFirstValue([metrics.payments], ['growthPercent'], paymentsGrowth)),
      isPositive: toNumber(getFirstValue([metrics.payments], ['growthPercent'], paymentsGrowth)) >= 0,
    }
  ];
};

const buildPendingActions = (payload) => {
  const metrics = payload?.data?.metrics || {};

  const verificationCount = toNumber(metrics.verification);
  const supportChatCount = toNumber(metrics.supportChat);
  const reportsCount = toNumber(metrics.reports);
  const openCount = verificationCount + supportChatCount + reportsCount;

  return {
    openCount,
    queueStatus: `${openCount} items need review across verification, chat, and reports.`,
    actions: [
      {
        title: 'Verification',
        subtitle: `${verificationCount} stores awaiting verification`,
        action: 'Review',
        color: 'bg-blue-50 border-blue-100',
        icon: ShieldCheck,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        buttonColor: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        title: 'Support Chat',
        subtitle: `${supportChatCount} New Chat`,
        action: 'Respond',
        color: 'bg-orange-50 border-orange-100',
        icon: MessageSquare,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-100',
        buttonColor: 'bg-orange-500 hover:bg-orange-600'
      },
      {
        title: 'Reports',
        subtitle: `${reportsCount} new report`,
        action: 'Investigate',
        color: 'bg-red-50 border-red-100',
        icon: AlertCircle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-100',
        buttonColor: 'bg-red-500 hover:bg-red-600'
      }
    ]
  };
};

const Overview = () => {
  const dispatch = useDispatch();
  const { businesses, pagination, status: businessesStatus, error: businessesError } = useSelector((state) => state.businesses);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businessSearchTerm, setBusinessSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [statsData, setStatsData] = useState(() =>
    buildOverviewStats({
      data: {},
    })
  );
  const [pendingActionsData, setPendingActionsData] = useState(() =>
    buildPendingActions({
      data: {
        metrics: {},
      },
    })
  );
  const [statsStatus, setStatsStatus] = useState('idle');
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchBusinessesQuery({
          page: 1,
          limit: 8,
          search: businessSearchTerm.trim(),
        })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [businessSearchTerm, dispatch]);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboardAnalytics = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const accessToken = getAccessToken();

      if (!baseUrl) {
        setStatsStatus('failed');
        setStatsError('Missing NEXT_PUBLIC_API_BASE_URL');
        return;
      }

      if (!accessToken) {
        setStatsStatus('failed');
        setStatsError('Missing access token');
        return;
      }

      setStatsStatus('loading');
      setStatsError('');

      try {
        const params = new URLSearchParams({ period: selectedPeriod });
        const response = await fetch(`${baseUrl}/analytics/system/dashboard?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load dashboard analytics');
        }

        setStatsData(buildOverviewStats(payload));
        setPendingActionsData(buildPendingActions(payload));
        setStatsStatus('succeeded');
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }

        setStatsStatus('failed');
        setStatsError(error?.message || 'Failed to load dashboard analytics');
      }
    };

    loadDashboardAnalytics();

    return () => controller.abort();
  }, [selectedPeriod]);

  const businessData = useMemo(
    () =>
      businesses.map((business) => ({
        ...business,
        owner: business.owner?.name || 'N/A',
        employees: business._count?.employments || 0,
        phone: [business.countryCode, business.phoneNumber].filter(Boolean).join(' ') || 'N/A',
        status: business?.isDeleted ? 'Inactive' : business?.isVerified ? 'Verified' : 'Unverified',
        plan: business?.isPremium === true || business?.isPremium === 'true' || business?.isPremium === 1 ? 'Premium' : '-',
      })),
    [businesses]
  );

  const getStatusColor = (status) => {
    const colors = {
      'Verified': 'bg-green-100 text-green-800',
      'Active': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Unverified': 'bg-gray-100 text-gray-800',
      'Inactive': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (selectedBusiness) {
    return (
      <BusinessProfile 
        business={selectedBusiness} 
        onBack={() => {
          setSelectedBusiness(null);
          window.history.pushState(null, '', window.location.pathname);
        }} 
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <p className="mt-1 text-sm text-gray-500">
              Live growth analytics for users and payments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Filter</span>
              <select
                className="bg-transparent outline-none"
                value={selectedPeriod}
                onChange={(event) => setSelectedPeriod(event.target.value)}
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <div className={`flex items-center text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {statsStatus === 'loading' ? (
          <p className="-mt-4 mb-8 text-sm text-gray-500">Updating overview analytics...</p>
        ) : null}
        {statsStatus === 'failed' ? (
          <p className="-mt-4 mb-8 text-sm text-red-500">{statsError}</p>
        ) : null}

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="col-span-2">
            <ChartAreaStacked />
          </div>

          {/* Pending Actions */}
          <Card className="gap-0">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold">Pending Actions</CardTitle>
                  <p className="mt-2 text-sm text-gray-500">
                    Review the most urgent internal tasks waiting for action.
                  </p>
                </div>
                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {pendingActionsData.openCount} open
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex h-full flex-col">
              <div className="flex flex-col gap-3">
              {pendingActionsData.actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-lg border p-4 ${action.color}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`${action.iconBg} p-2 rounded-lg`}>
                        <Icon className={`w-5 h-5 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{action.title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{action.subtitle}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className={`${action.buttonColor} text-white rounded-full px-5 h-8 text-xs font-medium`}
                    >
                      {action.action}
                    </Button>
                  </div>
                );
              })}
              </div>
              <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                      Queue status
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {pendingActionsData.queueStatus}
                    </p>
                  </div>
                  {/* <Button variant="ghost" size="sm" className="h-8 px-3 text-sm text-gray-700">
                    View all
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recently Registered Business */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recently Registered Business</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64"
                    value={businessSearchTerm}
                    onChange={(event) => setBusinessSearchTerm(event.target.value)}
                  />
                </div>
                
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store ID</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessesStatus === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">Loading businesses...</TableCell>
                  </TableRow>
                ) : businessesError ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-red-500">{businessesError}</TableCell>
                  </TableRow>
                ) : businessData.length ? (
                  businessData.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">{business.id}</TableCell>
                      <TableCell>{business.name || 'N/A'}</TableCell>
                      <TableCell>{business.owner}</TableCell>
                      <TableCell>{business.employees}</TableCell>
                      <TableCell>{business.phone}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(business.status)} variant="secondary">
                          {business.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{business.plan}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedBusiness(business);
                            window.history.pushState(null, '', `?id=${business.id}`);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">No businesses found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">Total Business: {pagination?.total || 0}</p>
              <Button variant="link" className="text-blue-600">
                See more <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
