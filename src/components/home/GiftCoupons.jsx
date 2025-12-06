"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import CouponWizardModal from '@/components/modals/AddNewOfferModal';
import ViewCouponModal from '@/components/modals/ViewCoupon';

const GiftsCouponsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const [isViewCouponModalOpen, setIsViewCouponModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filterOptions = ['Active', 'Inactive'];

  const stats = [
    { label: 'Total Redemptions', value: '19990', change: '+11.01%', trending: 'up' },
    { label: 'Total Revenue', value: '$50,550', change: '+15.03%', trending: 'up' },
    { label: 'Conversion Rate', value: '61%', change: '-0.03%', trending: 'down' },
    { label: 'User Engagement', value: '3,625', change: '+15.03%', trending: 'up' }
  ];

  const coupons = [
    { campaign: 'Winter', code: 'ADFIB2025', discount: '50%', uses: 'Unlimited', target: 'User', expiry: 'Aug 5, 2023', status: 'Active' },
    { campaign: 'Winter', code: 'BD2053', discount: '30%', uses: 'Unlimited', target: 'User', expiry: 'Aug 5, 2023', status: 'Active' },
    { campaign: 'Summer Campaign', code: 'ADFIB2025', discount: '30%', uses: '1000', target: 'User', expiry: 'Aug 5, 2023', status: 'Active' },
    { campaign: 'Eid Offer', code: 'ADFIB2025', discount: '1000 (Fixed)', uses: 'Unlimited', target: 'User', expiry: 'Aug 5, 2023', status: 'Active' },
    { campaign: 'Eid Offer', code: 'ADFIB2025', discount: '1000 (Fixed)', uses: 'Unlimited', target: 'User', expiry: 'Aug 5, 2023', status: 'Active' },
    { campaign: 'Eid Offer', code: 'ADFIB2025', discount: '1000 (Fixed)', uses: 'Unlimited', target: 'User', expiry: 'Aug 5, 2023', status: 'Active' },
    { campaign: 'Winter', code: 'ADFIB2025', discount: '20%', uses: '1000', target: 'User', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Winter', code: 'ADFIB2025', discount: '20%', uses: '1000', target: 'User', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Summer Campaign', code: 'ADFIB2025', discount: '30%', uses: '1000', target: 'Business', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Eid Offer', code: 'ADFIB2025', discount: '500 (Fixed)', uses: '2000', target: 'All', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Summer Campaign', code: 'BD2053', discount: '10%', uses: '1000', target: 'Business', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Winter', code: 'BD2053', discount: '205', uses: '2000', target: 'Business', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Winter', code: 'BD2053', discount: '10%', uses: '2000', target: 'Business', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Summer Campaign', code: 'BD2053', discount: '30%', uses: '2000', target: 'All', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Winter', code: 'BD2053', discount: '10%', uses: '2000', target: 'Business', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Summer Campaign', code: 'BD2053', discount: '30%', uses: '2000', target: 'All', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Winter', code: 'BD2053', discount: '10%', uses: '2000', target: 'Business', expiry: 'Aug 5, 2023', status: 'Inactive' },
    { campaign: 'Summer Campaign', code: 'BD2053', discount: '30%', uses: '2000', target: 'All', expiry: 'Aug 5, 2023', status: 'Inactive' }
  ];

  const filteredCoupons = coupons.filter(coupon => {
    if (selectedStatus === 'All') return true;
    return coupon.status === selectedStatus;
  });

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className={`flex items-center text-sm font-medium ${stat.trending === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                    {stat.trending === 'up' ? (
                      <TrendingUp className="w-4 h-4 ml-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Card */}
        <Card className="bg-white">
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                  {filteredCoupons.map((coupon, index) => (
                    <tr key={index} className="hover:bg-gray-50">
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
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Total Offer: 55 & Pages: 1/5
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
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
      />

      <ViewCouponModal
        open={isViewCouponModalOpen}
        onOpenChange={setIsViewCouponModalOpen}
        couponData={selectedCoupon ? {
          campaignName: selectedCoupon.campaign,
          couponName: selectedCoupon.code,
          discount: selectedCoupon.discount,
          usage: selectedCoupon.uses,
          targetAudience: selectedCoupon.target,
          expiry: selectedCoupon.expiry
        } : undefined}
      />
    </div>
  );
};

export default GiftsCouponsTable;