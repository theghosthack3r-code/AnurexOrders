import React from 'react';
import { useAppContext } from '../contexts/AppContext';

// New Icon
const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const Header: React.FC = () => {
  const { activeView, activeOrder } = useAppContext();

  const viewDetails: Record<string, {title: string, subtitle: string}> = {
      dashboard: {
          title: 'Dashboard',
          subtitle: 'An overview of your current orders and tasks.'
      },
      stamps: {
          title: `Shipment for #${activeOrder?.id || ''}`,
          subtitle: 'Finalize package details and select a shipping service.'
      },
      settings: {
          title: 'Settings',
          subtitle: 'Manage store connections and notification preferences.'
      },
      analytics: {
          title: 'Analytics',
          subtitle: 'Review sales performance and shipping metrics.'
      },
      returns: {
          title: 'Returns',
          subtitle: 'Process and track customer returns.'
      }
  }

  const { title, subtitle } = viewDetails[activeView] || viewDetails.dashboard;

  return (
    <header className="bg-white h-20 flex items-center justify-between px-8 border-b border-gray-200 flex-shrink-0">
      <div>
        <h1 className="text-2xl font-bold text-anurex-navy">{title}</h1>
        <p className="text-sm text-cool-gray mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative text-cool-gray hover:text-charcoal transition-colors duration-200">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-signature-red ring-2 ring-white" />
        </button>
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-ocean-teal flex-shrink-0"></div>
            <div className="text-right">
                <p className="font-semibold text-charcoal leading-tight">Admin User</p>
                <p className="text-sm text-cool-gray leading-tight">Administrator</p> 
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;