import React from 'react';
import { ShieldAlert, Cpu, Activity, Info, CheckCircle2, ArrowDown } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-xs space-y-2">
        <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded">
          Project Information
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Acoustic AI System for Predictive Maintenance
        </h2>
        <p className="text-xs text-gray-500">
          Application Name: <strong className="text-gray-800">Acoustic AI</strong> — Sound Signature Analysis
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-md bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">The Problem</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Industrial machinery (motors, pumps, fans, gearboxes) often develop acoustic anomalies
            long before failure. Traditional systems rely on expensive contact sensors or complex telemetry hardware.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">The Solution</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Acoustic AI uses standard microphones and signal processing algorithms to capture sound signatures.
            Feature vectors are compared against normal baseline models to identify early deviations.
          </p>
        </div>
      </div>

      {/* Architecture Workflow */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" /> System Architecture & Workflow
          </h3>
          <span className="text-[11px] text-gray-400">Flowchart</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          {[
            { label: "1. Sound Source", desc: "Motor, pump, fan, or gearbox acoustic emissions" },
            { label: "2. Audio Capture", desc: "Microphone recording or audio file upload (WAV/MP3/FLAC)" },
            { label: "3. Preprocessing", desc: "Resampling to 22.05 kHz, mono normalization" },
            { label: "4. Feature Extraction", desc: "MFCCs, RMS Energy, Zero Crossing Rate, Spectral Centroid" },
            { label: "5. Baseline Comparison", desc: "Envelope and statistical deviation against normal baseline" },
            { label: "6. Anomaly Detection", desc: "Isolation Forest and acoustic distance calculations" },
            { label: "7. Health Score Calculation", desc: "0-100 health scoring and descriptive feedback" },
            { label: "8. Dashboard & Reports", desc: "Trends, visualizer, history log, and maintenance advice" }
          ].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="w-full max-w-md p-3 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">{step.label}</h4>
                  <p className="text-[11px] text-gray-500">{step.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              </div>
              {idx < arr.length - 1 && (
                <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Disclosure */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-1.5">
        <h4 className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600" /> Technical Disclosure
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          The system detects acoustic deviations from established normal baseline operating sound profiles.
          The modular architecture provides a base class interface (<code className="text-blue-600 font-mono">PredictiveMaintenanceModel</code>)
          to integrate supervised fault classification models as labeled industrial datasets become available.
        </p>
      </div>
    </div>
  );
};
