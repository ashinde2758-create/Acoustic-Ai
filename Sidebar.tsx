import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Mic,
  FileText,
  Settings,
  Info,
  Home
} from 'lucide-react';

export type PageTab =
  | 'landing'
  | 'dashboard'
  | 'machines'
  | 'analysis'
  | 'reports'
  | 'settings'
  | 'about';

interface SidebarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'machines', label: 'Machines', icon: <Cpu className="w-4 h-4" /> },
    { id: 'analysis', label: 'Sound Analysis', icon: <Mic className="w-4 h-4" /> },
    { id: 'reports', label: 'History & Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'about', label: 'About Project', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col p-3 shrink-0 min-h-[calc(100vh-57px)]">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="bg-gray-50 p-2.5 rounded-md border border-gray-200">
          <p className="text-xs font-semibold text-gray-700">Acoustic AI System</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Predictive maintenance project
          </p>
        </div>
      </div>
    </aside>
  );
};
