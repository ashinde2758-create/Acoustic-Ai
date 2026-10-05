import React, { useState } from 'react';
import { Save, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

export const SettingsPage: React.FC = () => {
  const [contamination, setContamination] = useState<number>(0.1);
  const [minBaselineSamples, setMinBaselineSamples] = useState<number>(3);
  const [sampleRate, setSampleRate] = useState<number>(22050);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    try {
      const res = await api.seedDemoData();
      alert(res.message);
    } catch (err: any) {
      alert("Seeding failed: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-xs text-gray-500">Configure acoustic analysis parameters and demo data</p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-5">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700">
            Model Sensitivity
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-700 font-medium">
              <span>Contamination Rate:</span>
              <span className="font-mono text-blue-600">{contamination} (10%)</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.25"
              step="0.01"
              value={contamination}
              onChange={(e) => setContamination(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[11px] text-gray-500">
              Expected ratio of outlier sound anomalies within machine baseline training samples.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700">
            Baseline Parameters
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Min Baseline Samples</label>
              <select
                value={minBaselineSamples}
                onChange={(e) => setMinBaselineSamples(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
              >
                <option value={3}>3 Recordings (Fast)</option>
                <option value={5}>5 Recordings (Recommended)</option>
                <option value={10}>10 Recordings (High Precision)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Target Sample Rate (Hz)</label>
              <select
                value={sampleRate}
                onChange={(e) => setSampleRate(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
              >
                <option value={22050}>22,050 Hz (Standard)</option>
                <option value={44100}>44,100 Hz (High Quality)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Save Settings
          </button>
        </div>
      </form>

      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
          <Database className="w-4 h-4 text-blue-600" /> Demo Data
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Seed demonstration machinery (Motor-01, Pump-01, Fan-01, Conveyor-01) with historical acoustic analyses.
        </p>
        <button
          onClick={handleSeedDemoData}
          disabled={isSeeding}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-md border border-gray-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin text-blue-600' : ''}`} />
          {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
        </button>
      </div>
    </div>
  );
};
