"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Star, Languages } from 'lucide-react';
import Link from 'next/link';

const TopNavbar = ({ breadcrumbs = [] }) => {
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Languages className="w-5 h-5 text-gray-600" />
          </Button>
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
