"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BusinessProfile from '../buissness/BusinessProfile';
import { cn } from '@/lib/utils';
import { fetchBusinessesQuery } from '@/redux/businessesSlice';

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

const truncateStoreId = (storeId) => {
  if (!storeId || storeId.length <= 12) {
    return storeId || 'N/A';
  }

  return `${storeId.slice(0, 8)}...${storeId.slice(-4)}`;
};

const getPopupPosition = (triggerRect, popupWidth) => {
  const viewportPadding = 16;
  const top = Math.min(triggerRect.bottom + 8, window.innerHeight - 80);
  const left = Math.min(
    Math.max(triggerRect.left, viewportPadding),
    window.innerWidth - popupWidth - viewportPadding
  );

  return { top, left };
};

const getBusinessStatus = (business) => {
  if (business?.isDeleted) {
    return "Inactive";
  }

  return business?.isVerified ? "Verified" : "Unverified";
};

const getStatusColor = (status) => {
  const colors = {
    Verified: 'bg-green-100 text-green-800 border-green-200',
    Unverified: 'bg-blue-100 text-blue-800 border-blue-200',
    Inactive: 'bg-red-100 text-red-800 border-red-200',
  };

  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const isPremiumPlan = (value) => value === true || value === "true" || value === 1;

const BusinessManagement = () => {
  const dispatch = useDispatch();
  const { businesses, pagination, status, error } = useSelector((state) => state.businesses);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openStoreId, setOpenStoreId] = useState(null);
  const [storePopupPosition, setStorePopupPosition] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchBusinessesQuery({
          page: currentPage,
          limit: 10,
          search: searchTerm.trim(),
        })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, dispatch, searchTerm]);

  useEffect(() => {
    const handleViewportChange = () => {
      setOpenStoreId(null);
      setStorePopupPosition(null);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, []);

  const normalizedBusinesses = useMemo(
    () =>
      businesses.map((business) => ({
        ...business,
        owner: business.owner?.name || 'N/A',
        employees: business._count?.employments || 0,
        phone: [business.countryCode, business.phoneNumber].filter(Boolean).join(' ') || 'N/A',
        statusLabel: getBusinessStatus(business),
        plan: isPremiumPlan(business.isPremium) ? 'Premium' : '-',
      })),
    [businesses]
  );

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
    <div className="bg-gray-50 p-8">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Business</h1>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b bg-[#ECF7FE] p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Registered Business</CardTitle>
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
                {status === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      Loading businesses...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : normalizedBusinesses.length ? (
                  normalizedBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium text-gray-900">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            className="font-medium text-gray-900 hover:text-blue-600"
                            onClick={(event) => {
                              if (openStoreId === business.id) {
                                setOpenStoreId(null);
                                setStorePopupPosition(null);
                                return;
                              }

                              setStorePopupPosition(
                                getPopupPosition(event.currentTarget.getBoundingClientRect(), 288)
                              );
                              setOpenStoreId(business.id);
                            }}
                          >
                            {truncateStoreId(business.id)}
                          </button>
                          {openStoreId === business.id && storePopupPosition ? (
                            <>
                              <button
                                type="button"
                                aria-label="Close store ID popup"
                                onClick={() => {
                                  setOpenStoreId(null);
                                  setStorePopupPosition(null);
                                }}
                                className="fixed inset-0 z-10 cursor-default"
                              />
                              <div
                                className="fixed z-20 w-72 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg"
                                style={storePopupPosition}
                              >
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                  Full Store ID
                                </p>
                                <p className="break-all text-sm text-gray-900">{business.id}</p>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">{business.name || 'N/A'}</TableCell>
                      <TableCell className="text-gray-900">{business.owner}</TableCell>
                      <TableCell className="text-gray-900">{business.employees}</TableCell>
                      <TableCell className="text-gray-600">{business.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(business.statusLabel)} font-normal`}
                        >
                          {business.statusLabel}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      No businesses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t bg-white px-6 py-4">
              <p className="text-sm text-gray-600">
                Total Business: {pagination?.total || 0} & Pages: {pagination?.page || currentPage}/{pagination?.totalPages || 1}
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

export default BusinessManagement;
