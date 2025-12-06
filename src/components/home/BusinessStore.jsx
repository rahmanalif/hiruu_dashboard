"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import BusinessProfile from '../buissness/BusinessProfile';
import { cn } from '@/lib/utils';

// Table components inline
const Table = ({ children, className, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props}>{children}</table>
  </div>
);
const TableHeader = ({ children, className, ...props }) => <thead className={cn("border-b bg-gray-50", className)} {...props}>{children}</thead>;
const TableBody = ({ children, className, ...props }) => <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>{children}</tbody>;
const TableRow = ({ children, className, ...props }) => <tr className={cn("border-b transition-colors hover:bg-gray-50", className)} {...props}>{children}</tr>;
const TableHead = ({ children, className, ...props }) => <th className={cn("h-12 px-4 text-left align-middle font-medium text-gray-700 text-sm", className)} {...props}>{children}</th>;
const TableCell = ({ children, className, ...props }) => <td className={cn("p-4 align-middle text-sm", className)} {...props}>{children}</td>;

const BusinessManagement = () => {
  const [currentPage, setCurrentPage] = useState(5);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const totalPages = 250;

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

  const businessData = [
    { id: '29506', name: 'Tech-Haven', owner: 'Leslie Alexander', employees: 50, phone: '+30 21-1234-567', status: 'Unverified', plan: 'Premium' },
    { id: '29505', name: 'Mountain Mercado', owner: 'Marvin McKinney', employees: 102, phone: '+30 21-1234-567', status: 'Pending', plan: '-' },
    { id: '29504', name: 'Juniper & Tonic', owner: 'Kristin Watson', employees: 89, phone: '+30 21-1234-567', status: 'Inactive', plan: 'Premium' },
    { id: '29503', name: 'Mountain Mercado', owner: 'Ralph Edwards', employees: 50, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29502', name: 'Oxheart', owner: 'Darrell Steward', employees: 102, phone: '+30 21-1234-567', status: 'Pending', plan: '-' },
    { id: '29501', name: 'Juniper & Tonic', owner: 'Theresa Webb', employees: 89, phone: '+30 21-1234-567', status: 'Active', plan: 'Premium' },
    { id: '29500', name: 'Mountain Mercado', owner: 'Eleanor Pena', employees: 50, phone: '+30 21-1234-567', status: 'Active', plan: 'Free' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 205, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 50, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 102, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 205, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 89, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 102, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 50, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 102, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 89, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' },
    { id: '29499', name: 'Juniper & Tonic', owner: 'Kathryn Murphy', employees: 50, phone: '+30 21-1234-567', status: 'Verified', plan: 'Premium' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Verified': 'bg-green-100 text-green-800 border-green-200',
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Unverified': 'bg-blue-100 text-blue-800 border-blue-200',
      'Inactive': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Business</h1>

        <Card>
          <CardHeader className="border-b bg-[#ECF7FE] p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Registered Business</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search" 
                    className="pl-10 w-64 bg-white"
                  />
                </div>
                <Button variant="outline" size="icon" className="bg-white">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-left">Store ID</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessData.map((business, index) => (
                  <TableRow key={`${business.id}-${index}`}>
                    <TableCell className="font-medium text-gray-900">{business.id}</TableCell>
                    <TableCell className="text-gray-900">{business.name}</TableCell>
                    <TableCell className="text-gray-900">{business.owner}</TableCell>
                    <TableCell className="text-gray-900 ">{business.employees}</TableCell>
                    <TableCell className="text-gray-600">{business.phone}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(business.status)} font-normal`}
                      >
                        {business.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">{business.plan}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedBusiness(business);
                          window.history.pushState(null, '', `?id=${business.id}`);
                        }}
                        className="rounded-full px-6 text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
              <p className="text-sm text-gray-600">
                Total Business: 2025± & Pages: {currentPage}/{totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8"
                >
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

export default BusinessManagement;