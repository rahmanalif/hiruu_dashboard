"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const Overview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [selectedBusiness, setSelectedBusiness] = useState(null);

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

  const statsData = [
    { title: 'New users', value: '1,025', change: '+11.01%', isPositive: true },
    { title: 'Total User', value: '3,625', change: '+15.03%', isPositive: true },
    { title: 'New Businesses', value: '10,625', change: '-0.03%', isPositive: false },
    { title: 'Payments', value: '$3,625', change: '+15.03%', isPositive: true }
  ];

  const pendingActions = [
    {
      title: 'Verification',
      subtitle: '12 stores awaiting verification',
      action: 'Review',
      color: 'bg-blue-50 border-blue-100',
      icon: ShieldCheck,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
      buttonColor: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Support Chat',
      subtitle: '8 New Chat',
      action: 'Respond',
      color: 'bg-orange-50 border-orange-100',
      icon: MessageSquare,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-100',
      buttonColor: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Reports',
      subtitle: '5 new report',
      action: 'Investigate',
      color: 'bg-red-50 border-red-100',
      icon: AlertCircle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
      buttonColor: 'bg-red-500 hover:bg-red-600'
    }
  ];

  const businessData = [
    { id: '29506', name: 'Tech-Haven', owner: 'Leslie Alexander', employees: 50, phone: '+30 21-1234-567', status: 'Unverified', plan: 'Premium' },
    { id: '29505', name: 'Mountain Mercado', owner: 'Marvin McKinney', employees: 102, phone: '+30 21-1234-567', status: 'Pending', plan: '-' },
    { id: '29504', name: 'Juniper & Tonic', owner: 'Kristin Watson', employees: 89, phone: '+30 21-1234-567', status: 'Inactive', plan: 'Premium' },
    { id: '29503', name: 'Mountain Mercado', owner: 'Ralph Edwards', employees: 50, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29502', name: 'Oxheart', owner: 'Darrell Steward', employees: 102, phone: '+30 21-1234-567', status: 'Pending', plan: '-' },
    { id: '29501', name: 'Juniper & Tonic', owner: 'Theresa Webb', employees: 89, phone: '+30 21-1234-567', status: 'Active', plan: 'Premium' },
    { id: '29500', name: 'Mountain Mercado', owner: 'Eleanor Pena', employees: 50, phone: '+30 21-1234-567', status: 'Active', plan: 'Free' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 205, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' }
  ];

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

  return (
    <div className="flex-1 overflow-auto bg-gray-50">

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Aug 1 to Aug 31</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
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

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="col-span-2">
            <ChartAreaStacked />
          </div>

          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div key={index} className={`p-4 border rounded-lg ${action.color} flex items-center justify-between`}>
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
                  <Input placeholder="Search" className="pl-10 w-64" />
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
                {businessData.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">{business.id}</TableCell>
                    <TableCell>{business.name}</TableCell>
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
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">Total Business: 2025+</p>
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
