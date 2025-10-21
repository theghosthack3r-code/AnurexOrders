import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { View } from '../types';

const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

const ReturnsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);

const AnalyticsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);


interface NavItemProps {
  view: View;
  label: string;
  icon: React.ElementType;
}

const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useAppContext();

  const navItems: NavItemProps[] = [
    { view: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { view: 'returns', label: 'Returns', icon: ReturnsIcon },
    { view: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
    { view: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const NavLink: React.FC<NavItemProps> = ({ view, label, icon: Icon }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-seafoam text-white shadow-md'
            : 'text-mist hover:bg-ocean-teal hover:text-paper-white'
        }`}
      >
        <Icon className="w-6 h-6" />
        <span className="font-semibold">{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-anurex-navy flex-shrink-0 border-r border-charcoal flex flex-col">
      <div className="h-20 flex items-center justify-center p-4 border-b border-charcoal">
        <img src="https://i.ibb.co/HLD7KSBG/Untitled-11.png" alt="Anurex Logo" className="h-auto w-32" />
      </div>
      <nav className="p-4 space-y-2 flex-grow">
        {navItems.map(item => (
          <NavLink key={item.view} {...item} />
        ))}
      </nav>
      <div className="p-4 border-t border-charcoal">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-ocean-teal"></div>
            <div>
                <p className="font-semibold text-paper-white">Admin User</p>
                <p className="text-sm text-mist">admin@anurex.com</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;