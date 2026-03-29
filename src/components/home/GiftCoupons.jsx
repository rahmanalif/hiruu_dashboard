"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import CouponWizardModal from '@/components/modals/AddNewOfferModal';
import ViewCouponModal from '@/components/modals/ViewCoupon';
import { fetchCoupons } from '@/redux/couponsSlice';

const formatDiscount = (coupon) =>
  coupon?.discountType === 'percent'
    ? `${coupon.discount}%`
    : `${coupon.discount} (Fixed)`;

const formatExpiry = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No expiry';

const normalizeCoupon = (coupon) => ({
  id: coupon.id,
  campaign: coupon.name || 'N/A',
  code: coupon.code || 'N/A',
  discount: formatDiscount(coupon),
  rawDiscount: coupon.discount,
  discountType: coupon.discountType || 'percent',
  uses: coupon.limit == null ? 'Unlimited' : String(coupon.limit),
  target: coupon.target || 'All',
  expiry: formatExpiry(coupon.expiredAt),
  expiredAt: coupon.expiredAt || null,
  isActive: Boolean(coupon.isActive),
  status: coupon.isActive ? 'Active' : 'Inactive',
});

const formatMetricValue = (value, { currency = false } = {}) => {
  const numericValue = typeof value === 'number' ? value : Number(value || 0);

  if (currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  }

  return new Intl.NumberFormat('en-US').format(numericValue);
};

const formatChange = (value) => {
  const numericValue = typeof value === 'number' ? value : Number(value || 0);
  const prefix = numericValue >= 0 ? '+' : '';

  return `${prefix}${numericValue.toFixed(2)}%`;
};

const GiftsCouponsTable = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const [isViewCouponModalOpen, setIsViewCouponModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { coupons, pagination, metadata, status, error } = useSelector((state) => state.coupons);

  const filterOptions = ['Active', 'Inactive'];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchCoupons({
          page: currentPage,
          limit: 10,
          search: searchTerm.trim(),
        })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, dispatch, searchTerm]);

  const normalizedCoupons = useMemo(
    () => coupons.map((coupon) => normalizeCoupon(coupon)),
    [coupons]
  );

  const filteredCoupons = normalizedCoupons.filter(coupon => {
    if (selectedStatus === 'All') return true;
    return coupon.status === selectedStatus;
  });

  const stats = useMemo(
    () => [
      {
        label: 'Total Redemptions',
        value: formatMetricValue(metadata?.totalRedemptions?.value),
        change: formatChange(metadata?.totalRedemptions?.changePercentage),
        trending: Number(metadata?.totalRedemptions?.changePercentage || 0) >= 0 ? 'up' : 'down',
      },
      {
        label: 'Total Revenue',
        value: formatMetricValue(metadata?.totalRevenue?.value, { currency: true }),
        change: formatChange(metadata?.totalRevenue?.changePercentage),
        trending: Number(metadata?.totalRevenue?.changePercentage || 0) >= 0 ? 'up' : 'down',
      },
      {
        label: 'User Engagement',
        value: formatMetricValue(metadata?.userEngagement?.value),
        change: formatChange(metadata?.userEngagement?.changePercentage),
        trending: Number(metadata?.userEngagement?.changePercentage || 0) >= 0 ? 'up' : 'down',
      },
    ],
    [metadata]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Gifts & Coupons</h1>
          <Button
            className="bg-[#4FB2F3] hover:bg-[#408bbd] text-white"
            onClick={() => setIsAddOfferModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Offer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="flex min-h-[148px] flex-col justify-between p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <div className="mt-4 text-[2rem] font-semibold tracking-[-0.03em] text-slate-950">
                      {stat.value}
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                      stat.trending === 'up'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {stat.trending === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>

                <div className="mt-6 h-px w-full bg-slate-100" />

                <div className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {metadata?.period ? `${metadata.period} snapshot` : 'Current snapshot'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Card */}
        <Card className="gap-0 bg-white py-0">
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Gifts & Coupons</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setSearchTerm(e.target.value);
                    }}
                    className="pl-10 w-64 h-9"
                  />
                </div>
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.75 12C18.75 12.1989 18.671 12.3897 18.5303 12.5303C18.3897 12.671 18.1989 12.75 18 12.75H6C5.80109 12.75 5.61032 12.671 5.46967 12.5303C5.32902 12.3897 5.25 12.1989 5.25 12C5.25 11.8011 5.32902 11.6103 5.46967 11.4697C5.61032 11.329 5.80109 11.25 6 11.25H18C18.1989 11.25 18.3897 11.329 18.5303 11.4697C18.671 11.6103 18.75 11.8011 18.75 12ZM21.75 6.75H2.25C2.05109 6.75 1.86032 6.82902 1.71967 6.96967C1.57902 7.11032 1.5 7.30109 1.5 7.5C1.5 7.69891 1.57902 7.88968 1.71967 8.03033C1.86032 8.17098 2.05109 8.25 2.25 8.25H21.75C21.9489 8.25 22.1397 8.17098 22.2803 8.03033C22.421 7.88968 22.5 7.69891 22.5 7.30109 22.421 7.11032 22.2803 6.96967C22.1397 6.82902 21.9489 6.75 21.75 6.75ZM14.25 15.75H9.75C9.55109 15.75 9.36032 15.829 9.21967 15.9697C9.07902 16.1103 9 16.3011 9 16.5C9 16.6989 9.07902 16.8897 9.21967 17.0303C9.36032 17.171 9.55109 17.25 9.75 17.25H14.25C14.4489 17.25 14.6397 17.171 14.7803 17.0303C14.921 16.8897 15 16.6989 15 16.5C15 16.3011 14.921 16.1103 14.7803 15.9697C14.6397 15.829 14.4489 15.75 14.25 15.75Z" fill="#11293A"/>
                    </svg>
                  </Button>

                  {isFilterOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
                        <div 
                          className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${selectedStatus === 'All' ? 'text-blue-600 bg-blue-50/50 font-medium' : 'text-gray-700'}`}
                          onClick={() => { setSelectedStatus('All'); setIsFilterOpen(false); }}
                        >
                          All
                        </div>
                        {filterOptions.map((status) => (
                          <div 
                            key={status}
                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${selectedStatus === status ? 'text-blue-600 bg-blue-50/50 font-medium' : 'text-gray-700'}`}
                            onClick={() => { setSelectedStatus(status); setIsFilterOpen(false); }}
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Campaign Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Coupon Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Uses Limit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Target Audience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {status === 'loading' ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                        Loading coupons...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : filteredCoupons.length ? (
                    filteredCoupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.campaign}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.discount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.uses}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.target}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.expiry}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={coupon.status === 'Active' ? 'default' : 'secondary'}
                            className={coupon.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}
                          >
                            {coupon.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedCoupon(coupon);
                              setIsViewCouponModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                        No coupons found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Total Offer: {pagination?.total || 0} & Pages: {pagination?.page || currentPage}/{pagination?.totalPages || 1}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || status === 'loading'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.min(pagination?.totalPages || 1, currentPage + 1))}
                  disabled={currentPage === (pagination?.totalPages || 1) || status === 'loading'}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CouponWizardModal
        open={isAddOfferModalOpen}
        onOpenChange={setIsAddOfferModalOpen}
        onSuccess={() => {
          dispatch(
            fetchCoupons({
              page: currentPage,
              limit: 10,
              search: searchTerm.trim(),
            })
          );
        }}
      />

      <ViewCouponModal
        key={selectedCoupon?.id || 'coupon-modal'}
        open={isViewCouponModalOpen}
        onOpenChange={setIsViewCouponModalOpen}
        onSuccess={() => {
          dispatch(
            fetchCoupons({
              page: currentPage,
              limit: 10,
              search: searchTerm.trim(),
            })
          );
        }}
        couponData={selectedCoupon ? {
          id: selectedCoupon.id,
          campaignName: selectedCoupon.campaign,
          couponName: selectedCoupon.code,
          discount: selectedCoupon.rawDiscount,
          discountType: selectedCoupon.discountType,
          usage: selectedCoupon.uses,
          isActive: selectedCoupon.isActive,
          targetAudience: selectedCoupon.target,
          expiry: selectedCoupon.expiry,
          expiredAt: selectedCoupon.expiredAt,
        } : undefined}
      />
    </div>
  );
};

export default GiftsCouponsTable;
