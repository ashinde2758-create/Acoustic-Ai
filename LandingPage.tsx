import React from 'react';
import { Mic, Activity, Cpu, ShieldCheck, ArrowRight, Radio, BarChart3, LineChart, Award } from 'lucide-react';
import type { PageTab } from '../components/Sidebar';

interface LandingPageProps {
  onNavigate: (tab: PageTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
              <Radio className="w-3.5 h-3.5" />
              Acoustic Machine Monitoring
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Machine Sound Predictive Maintenance
            </h1>

            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Analyze industrial machine sound signatures captured through standard microphones
              to detect abnormal acoustic patterns and track equipment health over time.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('analysis')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors"
              >
                <Mic className="w-4 h-4" />
                Analyze Machine Audio
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-md border border-gray-300 transition-colors"
              >
                View Dashboard
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <div className="w-36 h-36 rounded-lg p-1 bg-gray-50 border border-gray-200">
              <img
                src="/logo.png"
                alt="Acoustic AI Logo"
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            <span className="text-xs text-gray-500 mt-2 font-medium">
              Acoustic AI System
            </span>
          </div>
        </div>
      </section>

      {/* Pipeline Flow Diagram */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">How the System Works</h2>
          <p className="text-xs text-gray-500">From audio recording to machine health evaluation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-xs">
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Mic className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase">Step 1</span>
            <h3 className="text-sm font-semibold text-gray-800 mt-0.5">Audio Capture</h3>
            <p className="text-xs text-gray-500 mt-1">
              Record from your microphone or upload WAV, MP3, or FLAC audio files.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-xs">
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 uppercase">Step 2</span>
            <h3 className="text-sm font-semibold text-gray-800 mt-0.5">Feature Extraction</h3>
            <p className="text-xs text-gray-500 mt-1">
              Extracts MFCCs, RMS Energy, Zero Crossing Rate, and Spectral Centroid.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-xs">
            <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-purple-600 uppercase">Step 3</span>
            <h3 className="text-sm font-semibold text-gray-800 mt-0.5">Anomaly Detection</h3>
            <p className="text-xs text-gray-500 mt-1">
              Compares audio features against machine baseline models to spot deviations.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-xs">
            <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase">Step 4</span>
            <h3 className="text-sm font-semibold text-gray-800 mt-0.5">Health Report</h3>
            <p className="text-xs text-gray-500 mt-1">
              Generates a calibrated 0-100 health score with maintenance recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-800">Machine Baselines</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Record normal running samples for each motor, pump, or fan to calibrate its specific acoustic baseline.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <LineChart className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-gray-800">Historical Trends</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Track acoustic changes, RMS power shifts, and health scores over time to schedule maintenance proactively.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-gray-800">Clear Explanations</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Provides plain-language descriptions of detected deviations and practical recommendations.
          </p>
        </div>
      </section>
    </div>
  );
};
