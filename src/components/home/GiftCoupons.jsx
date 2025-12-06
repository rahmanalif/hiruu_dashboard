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
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="w-4 h-4" />
                </Button>
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
                  {coupons.map((coupon, index) => (
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