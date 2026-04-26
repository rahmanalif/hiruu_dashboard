"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchTransactions } from '@/redux/transactionsSlice';
import { useTranslations } from 'next-intl';

const formatCurrency = (amount, currency) => {
  if (typeof amount !== 'number') {
    return 'N/A';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (currency || 'USD').toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return amount.toFixed(2);
  }
};

const formatDate = (value) => {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusClasses = (status) => {
  const normalizedStatus = (status || '').toLowerCase();

  if (normalizedStatus === 'paid' || normalizedStatus === 'success' || normalizedStatus === 'completed') {
    return 'bg-green-100 text-green-800 hover:bg-green-100';
  }

  if (normalizedStatus === 'pending') {
    return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
  }

  if (normalizedStatus === 'failed' || normalizedStatus === 'cancelled') {
    return 'bg-red-100 text-red-800 hover:bg-red-100';
  }

  return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
};

const PaymentsTable = () => {
  const dispatch = useDispatch();
  const t = useTranslations('Payments');
  const { transactions, pagination, status, error } = useSelector((state) => state.transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchTransactions({
          page: currentPage,
          limit: 10,
          search: searchTerm.trim(),
        })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, dispatch, searchTerm]);

  const translateStatus = (status, t) => {
    const key = (status || '').toLowerCase();
    if (['paid', 'success', 'completed', 'pending', 'failed', 'cancelled'].includes(key)) {
      return t(`statuses.${key}`);
    }
    return status || 'N/A';
  };

  const paymentRows = useMemo(
    () =>
      transactions.map((payment) => ({
        id: payment.id,
        invoiceNumber: payment.id || 'N/A',
        transactionId: payment.transactionId || payment.id || 'N/A',
        amount: formatCurrency(payment.amount, payment.meta?.currency),
        coupon: payment.coupon?.code || payment.couponId || '-',
        method: payment.method ? payment.method.charAt(0).toUpperCase() + payment.method.slice(1) : 'N/A',
        date: formatDate(payment.createdAt),
        status: payment.status || 'N/A',
        displayStatus: translateStatus(payment.status, t),
      })),
    [transactions, t]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
        </div>

        <Card className="gap-0 bg-white py-0">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b bg-blue-50 p-4">
              <h2 className="text-base font-medium text-gray-900">{t('allPayments')}</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t('search')}
                    value={searchTerm}
                    onChange={(event) => {
                      setCurrentPage(1);
                      setSearchTerm(event.target.value);
                    }}
                    className="h-9 w-64 bg-white pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">{t('table.invoiceNumber')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">{t('table.transactionId')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">{t('table.amounts')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">{t('table.useCoupon')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">{t('table.paymentMethod')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">{t('table.paymentDate')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">{t('table.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {status === 'loading' ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                        {t('table.loading')}
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : paymentRows.length ? (
                    paymentRows.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{payment.invoiceNumber}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{payment.transactionId}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{payment.amount}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{payment.coupon}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{payment.method}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{payment.date}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Badge variant="secondary" className={`${getStatusClasses(payment.status)} capitalize`}>
                            {payment.displayStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                        {t('table.noData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-gray-600">
                {t('table.pagination', {
                  total: pagination?.total || 0,
                  current: pagination?.page || currentPage,
                  totalPages: pagination?.totalPages || 1
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || status === 'loading'}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.min(pagination?.totalPages || 1, currentPage + 1))}
                  disabled={currentPage === (pagination?.totalPages || 1) || status === 'loading'}
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

export default PaymentsTable;
