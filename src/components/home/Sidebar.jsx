"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from 'lucide-react';
import { logoutUser } from '@/redux/authSlice';
import { hasPermissionAccess, isAdminUser, resolveUserPermissions } from '@/lib/permissions';

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const authStatus = useSelector((state) => state.auth.status);
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = useMemo(() => isAdminUser(currentUser), [currentUser]);
  const userPermissions = useMemo(
    () => resolveUserPermissions(currentUser),
    [currentUser]
  );
  const userInitial = currentUser?.name?.[0]?.toUpperCase() || 'A';
  const roleLabel = isAdmin ? 'Super Admin' : 'Maintainer';
  const accessLabel = isAdmin ? 'Full access' : 'Scoped access';

  const getLinkClassName = (path) => {
    const isActive = pathname === path;
    return `w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg ${
      isActive 
        ? 'border-l-6 border-[#4FB2F3] text-gray-900 bg-[#ECF7FE]' 
        : 'text-gray-600 hover:bg-gray-50'
    }`;
  };

  const menuItems = [
    {
      href: '/home',
      label: 'Overview',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 6C4 5.05719 4 4.58579 4.29289 4.29289C4.58579 4 5.05719 4 6 4H8C8.94281 4 9.41421 4 9.70711 4.29289C10 4.58579 10 5.05719 10 6V8C10 8.94281 10 9.41421 9.70711 9.70711C9.41421 10 8.94281 10 8 10H6C5.05719 10 4.58579 10 4.29289 9.70711C4 9.41421 4 8.94281 4 8V6Z" stroke="#11293A" strokeLinejoin="round"/>
          <path d="M4 16C4 15.0572 4 14.5858 4.29289 14.2929C4.58579 14 5.05719 14 6 14H8C8.94281 14 9.41421 14 9.70711 14.2929C10 14.5858 10 15.0572 10 16V18C10 18.9428 10 19.4142 9.70711 19.7071C9.41421 20 8.94281 20 8 20H6C5.05719 20 4.58579 20 4.29289 19.7071C4 19.4142 4 18.9428 4 18V16Z" stroke="#11293A" strokeLinejoin="round"/>
          <path d="M14 16C14 15.0572 14 14.5858 14.2929 14.2929C14.5858 14 15.0572 14 16 14H18C18.9428 14 19.4142 14 19.7071 14.2929C20 14.5858 20 15.0572 20 16V18C20 18.9428 20 19.4142 19.7071 19.7071C19.4142 20 18.9428 20 18 20H16C15.0572 20 14.5858 20 14.2929 19.7071C14 19.4142 14 18.9428 14 18V16Z" stroke="#11293A" strokeLinejoin="round"/>
          <path d="M14 6C14 5.05719 14 4.58579 14.2929 4.29289C14.5858 4 15.0572 4 16 4H18C18.9428 4 19.4142 4 19.7071 4.29289C20 4.58579 20 5.05719 20 6V8C20 8.94281 20 9.41421 19.7071 9.70711C19.4142 10 18.9428 10 18 10H16C15.0572 10 14.5858 10 14.2929 9.70711C14 9.41421 14 8.94281 14 8V6Z" stroke="#11293A" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: '/users',
      label: 'Users',
      requiredPermissions: 'system.users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52705 16.4358 7.1299 17.2399C5.73275 18.0439 4.72838 19.1713 4.27258 20.4471M16 8C16 10.2091 14.2091 12 12 12C9.79085 12 7.99999 10.2091 7.99999 8C7.99999 5.79086 9.79085 4 12 4C14.2091 4 16 5.79086 16 8Z" stroke="#11293A" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: '/business-store',
      label: 'Business / Store',
      requiredPermissions: 'system.businesses',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8 8L8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V8M8 8L16 8M8 8C6.11438 8 5.17157 8 4.58579 8.58579C4 9.17157 4 10.1144 4 12V13C4 16.7712 4 18.6569 5.17157 19.8284C6.34315 21 8.22876 21 12 21C15.7712 21 17.6569 21 18.8284 19.8284C20 18.6569 20 16.7712 20 13V12C20 10.1144 20 9.17157 19.4142 8.58579C18.8284 8 17.8856 8 16 8M15 14V12M9 14V12" stroke="#11293A" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: '/role-permission',
      label: 'Role & Permission',
      requiredPermissions: 'system.maintainers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
          <path d="M4.75 9.75V5.75C4.75 4.42392 5.27678 3.15215 6.21447 2.21447C7.15215 1.27678 8.42392 0.75 9.75 0.75C11.0761 0.75 12.3479 1.27678 13.2855 2.21447C14.2232 3.15215 14.75 4.42392 14.75 5.75V9.75M2.75 9.75H16.75C17.8546 9.75 18.75 10.6454 18.75 11.75V18.75C18.75 19.8546 17.8546 20.75 16.75 20.75H2.75C1.64543 20.75 0.75 19.8546 0.75 18.75V11.75C0.75 10.6454 1.64543 9.75 2.75 9.75Z" stroke="#11293A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: '/reward',
      label: 'Rewards',
      requiredPermissions: 'system.rewards',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
          <path d="M2 9.5C2 9.22386 1.77614 9 1.5 9C1.22386 9 1 9.22386 1 9.5H1.5H2ZM18 9.5C18 9.22386 17.7761 9 17.5 9C17.2239 9 17 9.22386 17 9.5H17.5H18ZM1.25 9.33923L1.45966 8.88531L1.25 9.33923ZM0.700962 8.9L1.1064 8.6074L0.700962 8.9ZM18.299 8.9L17.8936 8.6074L18.299 8.9ZM17.75 9.33923L17.5403 8.88531L17.75 9.33923ZM17.75 5.66077L17.5403 6.11469L17.75 5.66077ZM18.299 6.1L17.8936 6.3926L18.299 6.1ZM1.25 5.66077L1.45966 6.11469L1.25 5.66077ZM0.700962 6.1L1.1064 6.3926L0.700962 6.1ZM10 9.5C10 9.22386 9.77614 9 9.5 9C9.22386 9 9 9.22386 9 9.5H9.5H10ZM9 20.5C9 20.7761 9.22386 21 9.5 21C9.77614 21 10 20.7761 10 20.5H9.5H9ZM1.5 9.5H1V13.5H1.5H2V9.5H1.5ZM8.5 20.5V21H10.5V20.5V20H8.5V20.5ZM17.5 13.5H18V9.5H17.5H17V13.5H17.5ZM10.5 20.5V21C12.1358 21 13.4129 21.0011 14.4071 20.8674C15.4156 20.7318 16.2075 20.4494 16.8284 19.8284L16.4749 19.4749L16.1213 19.1213C15.7171 19.5255 15.1715 19.7556 14.2738 19.8763C13.3618 19.9989 12.1641 20 10.5 20V20.5ZM17.5 13.5H17C17 15.1641 16.9989 16.3618 16.8763 17.2738C16.7556 18.1715 16.5255 18.7171 16.1213 19.1213L16.4749 19.4749L16.8284 19.8284C17.4494 19.2075 17.7318 18.4156 17.8674 17.4071C18.0011 16.4129 18 15.1358 18 13.5H17.5ZM1.5 13.5H1C1 15.1358 0.998938 16.4129 1.1326 17.4071C1.26819 18.4156 1.55063 19.2075 2.17157 19.8284L2.52513 19.4749L2.87868 19.1213C2.4745 18.7171 2.24437 18.1715 2.12368 17.2738C2.00106 16.3618 2 15.1641 2 13.5H1.5ZM8.5 20.5V20C6.83595 20 5.63821 19.9989 4.72617 19.8763C3.82852 19.7556 3.28286 19.5255 2.87868 19.1213L2.52513 19.4749L2.17157 19.8284C2.79252 20.4494 3.58438 20.7318 4.59292 20.8674C5.58708 21.0011 6.86422 21 8.5 21V20.5Z" fill="#11293A"/>
        </svg>
      ),
    },
    {
      href: '/gift-coupons',
      label: 'Gifts & Coupons',
      requiredPermissions: 'system.coupons',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
          <path d="M11.5 0.5V2.5M11.5 12.5V14.5M11.5 6.5V8.5M0.5 4.5C1.29565 4.5 2.05871 4.81607 2.62132 5.37868C3.18393 5.94129 3.5 6.70435 3.5 7.5C3.5 8.29565 3.18393 9.05871 2.62132 9.62132C2.05871 10.1839 1.29565 10.5 0.5 10.5V12.5C0.5 13.0304 0.710714 13.5391 1.08579 13.9142C1.46086 14.2893 1.96957 14.5 2.5 14.5H18.5C19.0304 14.5 19.5391 14.2893 19.9142 13.9142C20.2893 13.5391 20.5 13.0304 20.5 12.5V10.5C19.7044 10.5 18.9413 10.1839 18.3787 9.62132C17.8161 9.05871 17.5 8.29565 17.5 7.5C17.5 6.70435 17.8161 5.94129 18.3787 5.37868C18.9413 4.81607 19.7044 4.5 20.5 4.5V2.5C20.5 1.96957 20.2893 1.46086 19.9142 1.08579C19.5391 0.710714 19.0304 0.5 18.5 0.5H2.5C1.96957 0.5 1.46086 0.710714 1.08579 1.08579C0.710714 1.46086 0.5 1.96957 0.5 2.5V4.5Z" stroke="#11293A" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: '/payment',
      label: 'Payments',
      requiredPermissions: 'system.payments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
          <path d="M14.5 6.5H8.5C7.96957 6.5 7.46086 6.71071 7.08579 7.08579C6.71071 7.46086 6.5 7.96957 6.5 8.5C6.5 9.03043 6.71071 9.53914 7.08579 9.91421C7.46086 10.2893 7.96957 10.5 8.5 10.5H12.5C13.0304 10.5 13.5391 10.7107 13.9142 11.0858C14.2893 11.4609 14.5 11.9696 14.5 12.5C14.5 13.0304 14.2893 13.5391 13.9142 13.9142C13.5391 14.2893 13.0304 14.5 12.5 14.5H6.5M10.5 16.5V4.5M20.5 10.5C20.5 16.0228 16.0228 20.5 10.5 20.5C4.97715 20.5 0.5 16.0228 0.5 10.5C0.5 4.97715 4.97715 0.5 10.5 0.5C16.0228 0.5 20.5 4.97715 20.5 10.5Z" stroke="#11293A" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: '/support-chat',
      label: 'Support Chat',
      requiredPermissions: 'system.support',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8.83333 4.66667H3.83333M12.1667 8H3.83333M15.5 10.5C15.5 10.942 15.3244 11.366 15.0118 11.6785C14.6993 11.9911 14.2754 12.1667 13.8333 12.1667H3.83333L0.5 15.5V2.16667C0.5 1.72464 0.675595 1.30072 0.988155 0.988155C1.30072 0.675595 1.72464 0.5 2.16667 0.5H13.8333C14.2754 0.5 14.6993 0.675595 15.0118 0.988155C15.3244 1.30072 15.5 1.72464 15.5 2.16667V10.5Z" stroke="#11293A" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: '/setting',
      label: 'Settings',
      requiredPermissions: 'system.settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 21 19" fill="none">
          <path d="M1.29306 11.1845C0.764355 10.2341 0.5 9.75884 0.5 9.24C0.5 8.72116 0.764355 8.24594 1.29306 7.2955L2.64232 4.87L4.06823 2.48876C4.62698 1.55567 4.90636 1.08912 5.35569 0.829698C5.80502 0.570277 6.34875 0.561605 7.43621 0.544261L10.2114 0.5L12.9865 0.544261C14.074 0.561604 14.6177 0.570276 15.0671 0.829697C15.5164 1.08912 15.7958 1.55567 16.3545 2.48876L17.7804 4.87L19.1297 7.2955C19.6584 8.24594 19.9228 8.72116 19.9228 9.24C19.9228 9.75884 19.6584 10.2341 19.1297 11.1845L17.7804 13.61L16.3545 15.9912C15.7958 16.9243 15.5164 17.3909 15.0671 17.6503C14.6177 17.9097 14.074 17.9184 12.9865 17.9357L10.2114 17.98L7.43621 17.9357C6.34875 17.9184 5.80502 17.9097 5.35569 17.6503C4.90636 17.3909 4.62698 16.9243 4.06823 15.9912L2.64232 13.61L1.29306 11.1845Z" stroke="#11293A"/>
          <path d="M13.2114 9.24C13.2114 10.8969 11.8682 12.24 10.2114 12.24C8.55452 12.24 7.21138 10.8969 7.21138 9.24C7.21138 7.58315 8.55452 6.24 10.2114 6.24C11.8682 6.24 13.2114 7.58315 13.2114 9.24Z" stroke="#11293A"/>
        </svg>
      ),
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    isAdmin || hasPermissionAccess(userPermissions, item.requiredPermissions)
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex justify-center items-center">
        <img src="/Logo.png" alt="logo" className='w-30 h-12' />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {visibleMenuItems.map((item) => (
          <Link key={item.href} href={item.href} className={getLinkClassName(item.href)}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          type="button"
          onClick={async () => {
            const result = await dispatch(logoutUser());
            if (logoutUser.fulfilled.match(result)) {
              router.push('/login');
            }
          }}
          disabled={authStatus === "loading"}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left transition-colors duration-200 hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="flex flex-col gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                <span>{userInitial}</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-50 bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                  {currentUser?.name || 'Admin User'}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {currentUser?.email || 'admin@hirvu.com'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-700">
                    {roleLabel}
              </span>
              <span className="text-[11px] text-slate-500">
                {accessLabel}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600">
              <span className="text-xs font-medium">
                {authStatus === 'loading' ? 'Logging out...' : 'Logout'}
              </span>
              <LogOut className="h-4 w-4 shrink-0" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
