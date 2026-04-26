"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Star, Languages } from 'lucide-react';
import Link from 'next/link';
import { fetchAdminNotifications } from '@/redux/notificationsSlice';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const isNotificationRead = (notification) =>
  Boolean(notification?.readAt || notification?.isRead || notification?.read);

const TopNavbar = ({ breadcrumbs = [] }) => {
  const dispatch = useDispatch();
  const { notifications, status } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAdminNotifications());
    }
  }, [dispatch, status]);

  const hasUnreadNotifications = notifications.some(
    (notification) => !isNotificationRead(notification)
  );

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Star icon and breadcrumb */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Star className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.length > 0 ? (
              breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <span className={index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : "text-gray-600"}>
                    {item}
                  </span>
                  {index < breadcrumbs.length - 1 && (
                    <span className="text-gray-400">/</span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="text-gray-600">Dashboards</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">Overview</span>
              </>
            )}
          </div>
        </div>

        {/* Right side - Language, Notification, and Search */}
        <div className="flex items-center space-x-2">
          <Select defaultValue="english">
            <SelectTrigger className="h-8 border-none shadow-none focus:ring-0 w-auto px-2 hover:bg-gray-100">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5 text-gray-600" />
                <SelectValue placeholder="Language" />
              </div>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="greek">Greek</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {hasUnreadNotifications ? (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              ) : null}
            </Button>
          </Link>
          <div className="relative ml-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 w-64 h-9"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
