"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Sidebar from '@/components/home/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';
import { readStoredAuth } from '@/lib/auth';

const DashboardLayout = ({ children, breadcrumbs }) => {
  const router = useRouter();
  const currentUser = useSelector((state) => state.auth.user);
  const authTokens = useSelector((state) => state.auth.tokens);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const persistedAuth = readStoredAuth();
    const hasActiveSession =
      Boolean(currentUser && authTokens) ||
      Boolean(persistedAuth?.user && persistedAuth?.tokens);

    if (!hasActiveSession) {
      router.replace('/login');
      return;
    }

    setIsCheckingAuth(false);
  }, [authTokens, currentUser, router]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
