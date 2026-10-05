import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';

interface NavbarProps {
  onSeedDemo: () => void;
  isSeeding: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onSeedDemo, isSeeding }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Acoustic AI Logo"
          className="w-8 h-8 rounded-md object-contain"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-gray-900">
              Acoustic AI
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded">
              v1.0
            </span>
          </div>
          <p className="text-xs text-gray-500">Machine Sound Predictive Maintenance</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSeedDemo}
          disabled={isSeeding}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors disabled:opacity-50"
          title="Seed realistic demo equipment data"
        >
          <Database className="w-3.5 h-3.5 text-blue-600" />
          {isSeeding ? 'Seeding Demo Data...' : 'Seed Demo Data'}
        </button>

        <div className="h-4 w-[1px] bg-gray-200" />

        <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-md border border-green-200">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-700">Online</span>
        </div>
      </div>
    </header>
  );
};
