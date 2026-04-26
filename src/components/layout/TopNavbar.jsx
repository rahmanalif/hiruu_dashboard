"use client";
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Star, Languages, User, Building2, X } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/routing';
import { useLocale, useTranslations } from 'next-intl';
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
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navbar');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const { notifications, status } = useSelector((state) => state.notifications);
  const { users } = useSelector((state) => state.users);
  const { businesses } = useSelector((state) => state.businesses);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAdminNotifications());
    }
  }, [dispatch, status]);

  // Click outside search to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasUnreadNotifications = notifications.some(
    (notification) => !isNotificationRead(notification)
  );

  const handleLanguageChange = (newLocale) => {
    const localeCode = newLocale === 'greek' ? 'el' : 'en';
    router.replace(pathname, { locale: localeCode });
  };

  // Search Results Filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { users: [], businesses: [] };

    const query = searchQuery.toLowerCase();
    
    const filteredUsers = users.filter(user => 
      user.name?.toLowerCase().includes(query) || 
      user.email?.toLowerCase().includes(query)
    ).slice(0, 5);

    const filteredBusinesses = businesses.filter(biz => 
      biz.name?.toLowerCase().includes(query)
    ).slice(0, 5);

    return { users: filteredUsers, businesses: filteredBusinesses };
  }, [searchQuery, users, businesses]);

  const hasResults = searchResults.users.length > 0 || searchResults.businesses.length > 0;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 relative z-50">
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
                <span className="text-gray-600">{t('dashboards')}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">{t('overview')}</span>
              </>
            )}
          </div>
        </div>

        {/* Right side - Language, Notification, and Search */}
        <div className="flex items-center space-x-2">
          <Select 
            defaultValue={locale === 'el' ? 'greek' : 'english'} 
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="h-8 border-none shadow-none focus:ring-0 w-auto px-2 hover:bg-gray-100">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5 text-gray-600" />
                <SelectValue placeholder="Language" />
              </div>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="english">{t('languages.english')}</SelectItem>
              <SelectItem value="greek">{t('languages.greek')}</SelectItem>
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
          
          {/* Functional Search Bar */}
          <div className="relative ml-2" ref={searchRef}>
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Input
              placeholder={t('search')}
              className="pl-10 w-64 h-9 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* Search Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {!hasResults ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {/* Users Section */}
                    {searchResults.users.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Users</div>
                        {searchResults.users.map(user => (
                          <Link 
                            key={user.id} 
                            href={`/users/${user.id}`}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-md transition-colors group"
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                              <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Businesses Section */}
                    {searchResults.businesses.length > 0 && (
                      <div className="p-2 border-t border-gray-100">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Businesses</div>
                        {searchResults.businesses.map(biz => (
                          <Link 
                            key={biz.id} 
                            href={`/business-store?id=${biz.id}`}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-md transition-colors group"
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center shrink-0">
                              <Building2 className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{biz.name}</div>
                              <div className="text-xs text-gray-500 truncate">Store ID: {biz.id.slice(0, 8)}...</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
