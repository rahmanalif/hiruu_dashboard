"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { userData } from '@/data/users';

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

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(5);
  const totalPages = 2520;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filterOptions = ['Active', 'Inactive', 'Verified', 'Pending', 'Unverified'];

  const filteredUsers = userData.filter(user => {
    if (selectedStatus === 'All') return true;
    return user.status === selectedStatus;
  });

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
    <div className=" bg-gray-50 p-8">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">User</h1>

        <Card>
          <CardHeader className="border-b bg-[#ECF7FE] p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Recently Added User</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64 bg-white"
                  />
                </div>
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-white"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.75 12C18.75 12.1989 18.671 12.3897 18.5303 12.5303C18.3897 12.671 18.1989 12.75 18 12.75H6C5.80109 12.75 5.61032 12.671 5.46967 12.5303C5.32902 12.3897 5.25 12.1989 5.25 12C5.25 11.8011 5.32902 11.6103 5.46967 11.4697C5.61032 11.329 5.80109 11.25 6 11.25H18C18.1989 11.25 18.3897 11.329 18.5303 11.4697C18.671 11.6103 18.75 11.8011 18.75 12ZM21.75 6.75H2.25C2.05109 6.75 1.86032 6.82902 1.71967 6.96967C1.57902 7.11032 1.5 7.30109 1.5 7.5C1.5 7.69891 1.57902 7.88968 1.71967 8.03033C1.86032 8.17098 2.05109 8.25 2.25 8.25H21.75C21.9489 8.25 22.1397 8.17098 22.2803 8.03033C22.421 7.88968 22.5 7.69891 22.5 7.5C22.5 7.30109 22.421 7.11032 22.2803 6.96967C22.1397 6.82902 21.9489 6.75 21.75 6.75ZM14.25 15.75H9.75C9.55109 15.75 9.36032 15.829 9.21967 15.9697C9.07902 16.1103 9 16.3011 9 16.5C9 16.6989 9.07902 16.8897 9.21967 17.0303C9.36032 17.171 9.55109 17.25 9.75 17.25H14.25C14.4489 17.25 14.6397 17.171 14.7803 17.0303C14.921 16.8897 15 16.6989 15 16.5C15 16.3011 14.921 16.1103 14.7803 15.9697C14.6397 15.829 14.4489 15.75 14.25 15.75Z" fill="#11293A"/>
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
          </CardHeader>

          <CardContent className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-left">User ID</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={`${user.id}-${index}`}>
                    <TableCell className="font-medium text-gray-900">{user.id}</TableCell>
                    <TableCell className="text-gray-900">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(user.status)} font-normal`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">{user.plan}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/users/${user.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full px-6 text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
              <p className="text-sm text-gray-600">
                Total User: 5025±8 & Pages: {currentPage}/{totalPages}
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

export default UserManagement;