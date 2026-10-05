import React from 'react';
import {
  Printer,
  Activity,
  Mic,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import type { Analysis } from '../types';
import { HealthGauge } from '../components/HealthGauge';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { FeatureChart } from '../components/FeatureChart';
import type { PageTab } from '../components/Sidebar';

interface AnalysisResultPageProps {
  analysis: Analysis | null;
  onNavigate: (tab: PageTab) => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({ analysis, onNavigate }) => {
  if (!analysis) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-gray-500 text-xs">No analysis result selected.</p>
        <button
          onClick={() => onNavigate('analysis')}
          className="px-3.5 py-1.5 bg-blue-600 text-white font-medium text-xs rounded-md"
        >
          Run New Analysis
        </button>
      </div>
    );
  }

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10 print:p-0 print:bg-white print:text-black">
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('analysis')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-md border border-gray-300"
          >
            <Mic className="w-3.5 h-3.5" /> Analyze Another
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md"
          >
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 md:p-6 space-y-6 shadow-xs print:border-none print:shadow-none print:bg-white">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4 print:border-gray-300">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-gray-100 text-gray-700 rounded">
                Report #{analysis.id}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(analysis.created_at).toLocaleString()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1 print:text-black">
              Acoustic Analysis Report
            </h2>
            <p className="text-xs text-gray-500 print:text-gray-600">
              Machine: <strong className="text-gray-800 print:text-black">{analysis.machine_name}</strong>
            </p>
          </div>

          <div className="text-right text-xs text-gray-500 print:text-gray-600">
            <p>Model: {analysis.model_name}</p>
            <p>Sample Rate: 22.05 kHz</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg print:bg-gray-50 print:border-gray-200">
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-3">
            <HealthGauge score={analysis.health_score} size="md" status={analysis.status} />
          </div>

          <div className="col-span-2 space-y-2 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Anomaly Score
              </span>
              <span className="text-xs font-mono font-bold text-gray-900">
                {analysis.anomaly_score.toFixed(3)}
              </span>
            </div>

            <div className="p-3 bg-white border border-gray-200 rounded-md space-y-1 print:bg-white print:border-gray-300">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-gray-800 print:text-black">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Feedback
              </div>
              <p className="text-xs text-gray-600 leading-relaxed print:text-gray-800">
                {analysis.explanation}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-600" /> Visualizations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WaveformVisualizer data={analysis.waveform_data} height={90} />

            {analysis.spectrogram_url ? (
              <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">Spectrogram</span>
                  <span className="text-[11px] text-gray-400">STFT</span>
                </div>
                <img
                  src={analysis.spectrogram_url}
                  alt="Acoustic Spectrogram"
                  className="w-full h-24 object-cover rounded border border-gray-100"
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex items-center justify-center text-xs text-gray-400">
                Spectrogram not available
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <FeatureChart features={analysis.features} />
        </div>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-1.5">
          <h4 className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600" /> Maintenance Recommendation
          </h4>
          <p className="text-xs text-gray-700 leading-relaxed print:text-black">
            {analysis.recommendations}
          </p>
          <p className="text-[11px] text-gray-400 pt-1">
            Note: Recommendations are advisory estimates based on baseline statistical deviations.
          </p>
        </div>
      </div>
    </div>
  );
};
