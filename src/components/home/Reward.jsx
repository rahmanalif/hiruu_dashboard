"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

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

const RewardsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const rewardsData = [
    { id: '29506', name: 'Leslie Alexander', type: 'Referral', tokens: '+20', description: 'Referred user signup', balance: 2400 },
    { id: '29505', name: 'Marvin McKinney', type: 'user', tokens: '+30', description: 'Sales & Marketing', balance: 1200 },
    { id: '29504', name: 'Kristin Watson', type: 'Referral', tokens: '+50', description: 'Referred user signup', balance: 2400 },
    { id: '29503', name: 'Ralph Edwards', type: 'Referral', tokens: '+60', description: 'Help & Support', balance: 1500 },
    { id: '29502', name: 'Darrell Steward', type: 'Purchase', tokens: '-200', description: 'Completed profile setup', balance: 2400 },
    { id: '29501', name: 'Theresa Webb', type: 'user', tokens: '+50', description: 'Bought nameplate', balance: 1500 },
    { id: '29500', name: 'Eleanor Pena', type: 'Referral', tokens: '+35', description: 'Sales & Marketing', balance: 2400 },
    { id: '29499', name: 'Kathryn Murphy', type: 'user', tokens: '+25', description: 'Referred user signup', balance: 1500 },
    { id: '29499', name: 'Kathryn Murphy', type: 'Purchase', tokens: '-100', description: 'Completed profile setup', balance: 2400 },
    { id: '29499', name: 'Kathryn Murphy', type: 'Referral', tokens: '+50', description: 'Completed profile setup', balance: 1500 }
  ];

  return (
    <div className="bg-gray-50 p-8">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Rewards</h1>

        <Card>
          <CardHeader className="border-b bg-[#ECF7FE] p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Rewards</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search" 
                    className="pl-10 w-64 bg-white"
                  />
                </div>
                <Button variant="outline" size="icon" className="bg-white w-9 h-9">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardsData.map((reward, index) => (
                  <TableRow key={`${reward.id}-${index}`}>
                    <TableCell className="font-medium text-gray-900">{reward.id}</TableCell>
                    <TableCell className="text-gray-900">{reward.name}</TableCell>
                    <TableCell className="text-gray-900">{reward.type}</TableCell>
                    <TableCell className={`font-medium ${reward.tokens.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {reward.tokens}
                    </TableCell>
                    <TableCell className="text-gray-900">{reward.description}</TableCell>
                    <TableCell className="text-gray-900 text-right">{reward.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
              <p className="text-sm text-gray-600">
                Total Offer: 55 & Pages: {currentPage}/{totalPages}
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

export default RewardsManagement;