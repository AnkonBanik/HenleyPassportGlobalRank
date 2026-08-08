import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { DataProvider } from './context/DataContext';
import { MainLayout } from './layouts/MainLayout';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { CountryComparison } from './pages/CountryComparison';
import { CountryDetails } from './pages/CountryDetails';
import { RegionalAnalytics } from './pages/RegionalAnalytics';

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <DataProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<ExecutiveDashboard />} />
              <Route path="/compare" element={<CountryComparison />} />
              <Route path="/details" element={<CountryDetails />} />
              <Route path="/regional" element={<RegionalAnalytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
