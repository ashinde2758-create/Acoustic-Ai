import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import type { PageTab } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MachinesPage } from './pages/MachinesPage';
import { MachineDetailPage } from './pages/MachineDetailPage';
import { AudioAnalysisPage } from './pages/AudioAnalysisPage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import type { Analysis } from './types';
import { api } from './api';

export function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('landing');
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    try {
      const res = await api.seedDemoData();
      alert(res.message);
      if (activeTab === 'dashboard') {
        window.location.reload();
      }
    } catch (err: any) {
      alert("Seeding failed: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAnalysisComplete = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
    setActiveTab('reports');
  };

  const handleSelectAnalysis = async (analysisId: number) => {
    try {
      const a = await api.getAnalysisById(analysisId);
      setSelectedAnalysis(a);
    } catch (err) {
      console.error("Failed to load analysis:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
      <Navbar onSeedDemo={handleSeedDemoData} isSeeding={isSeeding} />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
          {activeTab === 'landing' && (
            <LandingPage onNavigate={setActiveTab} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setActiveTab}
              onSelectMachine={(mId) => {
                setSelectedMachineId(mId);
                setActiveTab('analysis');
              }}
            />
          )}

          {activeTab === 'machines' && (
            selectedMachineId ? (
              <MachineDetailPage
                machineId={selectedMachineId}
                onNavigate={(tab) => {
                  if (tab === 'machines') setSelectedMachineId(null);
                  setActiveTab(tab);
                }}
                onSelectAnalysis={(aId) => {
                  handleSelectAnalysis(aId);
                  setActiveTab('reports');
                }}
              />
            ) : (
              <MachinesPage
                onNavigate={setActiveTab}
                onSelectMachine={(mId) => {
                  setSelectedMachineId(mId);
                }}
              />
            )
          )}

          {activeTab === 'analysis' && (
            <AudioAnalysisPage
              selectedMachineId={selectedMachineId}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}

          {activeTab === 'reports' && (
            selectedAnalysis ? (
              <AnalysisResultPage
                analysis={selectedAnalysis}
                onNavigate={(tab) => {
                  if (tab !== 'reports') setSelectedAnalysis(null);
                  setActiveTab(tab);
                }}
              />
            ) : (
              <ReportsPage
                onNavigate={setActiveTab}
                onSelectAnalysis={(aId) => {
                  handleSelectAnalysis(aId);
                }}
              />
            )
          )}

          {activeTab === 'settings' && <SettingsPage />}

          {activeTab === 'about' && <AboutPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
