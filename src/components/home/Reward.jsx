"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchCoinTransactions } from '@/redux/coinTransactionsSlice';
import { useTranslations } from 'next-intl';

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

const getPopupPosition = (triggerRect, popupWidth) => {
  const viewportPadding = 16;
  const top = Math.min(triggerRect.bottom + 8, window.innerHeight - 80);
  const left = Math.min(
    Math.max(triggerRect.left, viewportPadding),
    window.innerWidth - popupWidth - viewportPadding
  );

  return { top, left };
};

const getTokenPrefix = (type) => {
  if (type === 'earned') {
    return '+';
  }

  if (type === 'spend') {
    return '-';
  }

  return '';
};

const formatTypeLabel = (type, t) => {
  if (!type) {
    return 'N/A';
  }
  
  if (type === 'earned') return t('types.earned');
  if (type === 'spend') return t('types.spend');

  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getInitials = (name) => {
  if (!name) {
    return 'NA';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

const RewardsManagement = () => {
  const dispatch = useDispatch();
  const t = useTranslations('Rewards');
  const { transactions, pagination, status, error } = useSelector((state) => state.coinTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUserId, setOpenUserId] = useState(null);
  const [userPopupPosition, setUserPopupPosition] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchCoinTransactions({
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
      setOpenUserId(null);
      setUserPopupPosition(null);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, []);

  const rewardRows = useMemo(
    () =>
      transactions.map((transaction) => ({
        id: transaction.id,
        userId: transaction.userId || transaction.user?.id || '',
        avatar: transaction.user?.avatar || '',
        name: transaction.user?.name || 'N/A',
        type: formatTypeLabel(transaction.type, t),
        tokens: `${getTokenPrefix(transaction.type)}${Math.abs(transaction.amount || 0)}`,
        isPositive: transaction.type === 'earned',
        description: transaction.description || 'N/A',
        balance: transaction.balanceAfter ?? 'N/A',
      })),
    [transactions, t]
  );

  return (
    <div className="bg-gray-50 p-8">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('title')}</h1>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b bg-[#ECF7FE] p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">{t('title')}</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder={t('search')}
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
                  <TableHead>{t('table.avatar')}</TableHead>
                  <TableHead>{t('table.userId')}</TableHead>
                  <TableHead>{t('table.name')}</TableHead>
                  <TableHead>{t('table.type')}</TableHead>
                  <TableHead>{t('table.tokens')}</TableHead>
                  <TableHead>{t('table.description')}</TableHead>
                  <TableHead className="text-right">{t('table.balance')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      {t('table.loading')}
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : rewardRows.length ? (
                  rewardRows.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell>
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                          {reward.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={reward.avatar}
                              alt={reward.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(reward.name)
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            className="font-medium text-gray-900 hover:text-blue-600"
                            onClick={(event) => {
                              if (openUserId === reward.id) {
                                setOpenUserId(null);
                                setUserPopupPosition(null);
                                return;
                              }

                              setUserPopupPosition(
                                getPopupPosition(event.currentTarget.getBoundingClientRect(), 288)
                              );
                              setOpenUserId(reward.id);
                            }}
                          >
                            {truncateUserId(reward.userId)}
                          </button>
                          {openUserId === reward.id && userPopupPosition ? (
                            <>
                              <button
                                type="button"
                                aria-label="Close reward user ID popup"
                                onClick={() => {
                                  setOpenUserId(null);
                                  setUserPopupPosition(null);
                                }}
                                className="fixed inset-0 z-10 cursor-default"
                              />
                              <div
                                className="fixed z-20 w-72 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg"
                                style={userPopupPosition}
                              >
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                  {t('table.fullUserId')}
                                </p>
                                <p className="break-all text-sm text-gray-900">{reward.userId || 'N/A'}</p>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">{reward.name}</TableCell>
                      <TableCell className="text-gray-900">{reward.type}</TableCell>
                      <TableCell className={reward.isPositive ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
                        {reward.tokens}
                      </TableCell>
                      <TableCell className="max-w-[320px] text-gray-900">
                        <span className="line-clamp-2">{reward.description}</span>
                      </TableCell>
                      <TableCell className="text-right text-gray-900">{reward.balance}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      {t('table.noData')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t bg-white px-6 py-4">
              <p className="text-sm text-gray-600">
                {t('table.pagination', {
                  total: pagination?.total || 0,
                  current: pagination?.page || currentPage,
                  totalPages: pagination?.totalPages || 1
                })}
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

export default RewardsManagement;
