"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const PaymentsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const payments = [
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'cyan' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'cyan' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'cyan' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'cyan' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'cyan' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: '-', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'cyan' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: '-', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: '-', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: '-', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: '-', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' },
    { invoice: '50682', transaction: 'T1B7856ULB', amount: '€58.00', coupon: 'BD2053', method: 'Stripe', date: 'Aug 5, 2023', status: 'premium', statusColor: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
        </div>

        {/* Table Card */}
        <Card className="bg-white">
          <CardContent className="p-2">
            {/* Table Header */}
            <div className="flex items-center justify-between p-4 border-b bg-blue-50">
              <h2 className="text-base font-medium text-gray-900">All Payments</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 h-9 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Invoice Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amounts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Use Coupon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.invoice}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.transaction}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.coupon}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="secondary"
                          className={`${
                            payment.statusColor === 'cyan' 
                              ? 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100' 
                              : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                          } capitalize`}
                        >
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Total Offer: 55 & Pages: 1/3
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
    </div>
  );
};

export default PaymentsTable;