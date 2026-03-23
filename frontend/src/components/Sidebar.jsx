import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  VideoCameraIcon,
  PlayCircleIcon,
  CreditCardIcon,
  CpuChipIcon,
  UserPlusIcon,
  UserIcon,
  CogIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      icon: HomeIcon
    },
    {
      id: 'calendar',
      name: 'Calendar',
      path: '/calendar',
      icon: CalendarIcon
    },
    {
      id: 'kivi-consult',
      name: 'KiVi Consult',
      path: '/kivi-consult',
      icon: VideoCameraIcon
    },
    {
      id: 'video-guide',
      name: 'Video Guide',
      path: '/video-guide',
      icon: PlayCircleIcon
    },
    {
      id: 'abdm',
      name: 'ABDM',
      path: '/abdm',
      icon: CreditCardIcon
    },
    {
      id: 'kivi-ai',
      name: 'Kivi AI',
      path: '/kivi-ai',
      icon: CpuChipIcon
    },
    {
      id: 'activate-profile',
      name: 'Activate Profile',
      path: '/activate-profile',
      icon: UserPlusIcon
    },
    {
      id: 'profile',
      name: 'Profile',
      path: '/profile',
      icon: UserIcon
    },
    {
      id: 'clinic-settings',
      name: 'Clinic Settings',
      path: '/clinic-settings',
      icon: CogIcon,
      badge: 'Beta',
      badgeColor: 'red'
    },
    {
      id: 'menu',
      name: 'Menu',
      path: '/menu',
      icon: Bars3Icon
    }
  ];

  return (
    <nav className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Kivi</h2>
      </div>
      
      <div className="flex-1 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Use prefix matching for routes that have nested paths, exact matching for others
            const hasNestedRoutes = ['activate-profile'].includes(item.id);
            const isActive = hasNestedRoutes 
              ? location.pathname.startsWith(item.path)
              : location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.badgeColor === 'red'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
