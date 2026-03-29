"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { fetchUsersQuery } from '@/redux/usersSlice';

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

const truncateUserId = (userId) => {
  if (!userId || userId.length <= 12) {
    return userId || 'N/A';
  }

  return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
};

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, pagination, status, error } = useSelector((state) => state.users);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUserId, setOpenUserId] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchUsersQuery({
          page: currentPage,
          limit: 10,
          search: searchTerm.trim(),
        })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, dispatch, searchTerm]);

  return (
    <div className="bg-gray-50 p-8">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">User</h1>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b bg-[#ECF7FE] p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Recently Added User</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search"
                  className="w-64 bg-white pl-10"
                  value={searchTerm}
                  onChange={(event) => {
                    setCurrentPage(1);
                    setSearchTerm(event.target.value);
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-left">User ID</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : users.length ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-gray-900">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            className="font-medium text-gray-900 hover:text-blue-600"
                            onClick={() =>
                              setOpenUserId((currentId) =>
                                currentId === user.id ? null : user.id
                              )
                            }
                          >
                            {truncateUserId(user.id)}
                          </button>
                          {openUserId === user.id ? (
                            <>
                              <button
                                type="button"
                                aria-label="Close user ID popup"
                                onClick={() => setOpenUserId(null)}
                                className="fixed inset-0 z-10 cursor-default"
                              />
                              <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg">
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                  Full User ID
                                </p>
                                <p className="break-all text-sm text-gray-900">{user.id}</p>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">{user.name || 'N/A'}</TableCell>
                      <TableCell className="text-gray-600">{user.email || 'N/A'}</TableCell>
                      <TableCell className="text-gray-900">
                        {user.isPremium ? 'Premium' : '-'}
                      </TableCell>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t bg-white px-6 py-4">
              <p className="text-sm text-gray-600">
                Total User: {pagination?.total || 0} & Pages: {pagination?.page || currentPage}/{pagination?.totalPages || 1}
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || status === 'loading'}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(pagination?.totalPages || 1, currentPage + 1))}
                  disabled={currentPage === (pagination?.totalPages || 1) || status === 'loading'}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
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
