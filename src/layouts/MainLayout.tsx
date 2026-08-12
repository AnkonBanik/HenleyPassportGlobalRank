import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { usePassportData } from '../context/DataContext';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = usePassportData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium tracking-wide text-center px-4">
          Loading Henley Passport Index Dataset (2006–2026)...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-6 rounded-2xl max-w-md">
          <h2 className="text-lg font-bold">Data Initialization Error</h2>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex font-sans antialiased transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
