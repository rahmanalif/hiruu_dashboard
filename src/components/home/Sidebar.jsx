"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  Users,
  Store,
  Shield,
  Gift,
  DollarSign,
  MessageSquare,
  LayoutDashboard,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const getLinkClassName = (path) => {
    const isActive = pathname === path;
    return `w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg ${
      isActive 
        ? 'border-l-6 border-[#4FB2F3] text-gray-900 bg-[#ECF7FE]' 
        : 'text-gray-600 hover:bg-gray-50'
    }`;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex justify-center items-center">
        <img src="/Logo.png" alt="logo" className='w-30 h-12' />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <Link href="/" className={getLinkClassName('/')}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </Link>
        <Link href="/users" className={getLinkClassName('/users')}>
          <Users className="w-5 h-5" />
          <span>Users</span>
        </Link>
        <Link href="/business-store" className={getLinkClassName('/business-store')}>
          <Store className="w-5 h-5" />
          <span>Business / Store</span>
        </Link>
        <Link href="/role-permission" className={getLinkClassName('/role-permission')}>
          <Users className="w-5 h-5" />
          <span>Role & Permission</span>
        </Link>
        <Link href="/reward" className={getLinkClassName('/reward')}>
          <Gift className="w-5 h-5" />
          <span>Rewards</span>
        </Link>
        <Link href="/gift-coupons" className={getLinkClassName('/gift-coupons')}>
          <Gift className="w-5 h-5" />
          <span>Gifts & Coupons</span>
        </Link>
        <Link href="/payment" className={getLinkClassName('/payment')}>
          <DollarSign className="w-5 h-5" />
          <span>Payments</span>
        </Link>
        <Link href="/support-chat" className={getLinkClassName('/support-chat')}>
          <MessageSquare className="w-5 h-5" />
          <span>Support Chat</span>
        </Link>
        <Link href="/setting" className={getLinkClassName('/setting')}>
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@hirvu.com</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-gray-400" />
        </div>
        <div className="mt-2 text-center">
          <Badge variant="secondary" className="text-xs">Super Admin</Badge>
          <p className="text-xs text-gray-500 mt-1">Full access</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
