import React, { useEffect, useState } from 'react';
import {
  LineChart as LineChartIcon,
  RotateCcw,
  Mic,
  Calendar,
  MapPin,
  ArrowLeft,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../api';
import type { Machine, Analysis } from '../types';
import { HealthGauge } from '../components/HealthGauge';
import type { PageTab } from '../components/Sidebar';

interface MachineDetailPageProps {
  machineId: number;
  onNavigate: (tab: PageTab) => void;
  onSelectAnalysis: (analysisId: number) => void;
}

export const MachineDetailPage: React.FC<MachineDetailPageProps> = ({
  machineId,
  onNavigate,
  onSelectAnalysis
}) => {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [m, aList] = await Promise.all([
        api.getMachineById(machineId),
        api.getMachineAnalyses(machineId)
      ]);
      setMachine(m);
      setAnalyses(aList);
    } catch (err) {
      console.error("Failed to load machine details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (machineId) loadData();
  }, [machineId]);

  const handleResetBaseline = async () => {
    if (confirm("Resetting baseline will erase all baseline samples for this machine. Continue?")) {
      try {
        await api.resetBaseline(machineId);
        loadData();
      } catch (err: any) {
        alert("Failed to reset baseline: " + err.message);
      }
    }
  };

  if (isLoading || !machine) {
    return (
      <div className="p-8 text-center text-gray-500 text-xs">
        Loading machine information...
      </div>
    );
  }

  const trendData = analyses.map((a) => {
    const rmsFeat = a.features?.find(f => f.feature_name.includes('RMS_Energy_Mean'))?.feature_value || 0;
    const specFeat = a.features?.find(f => f.feature_name.includes('Spectral_Centroid_Mean'))?.feature_value || 0;

    return {
      date: new Date(a.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      time: new Date(a.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      health: a.health_score,
      anomaly: a.anomaly_score,
      rms: parseFloat(rmsFeat.toFixed(4)),
      spectralCentroid: Math.round(specFeat)
    };
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('machines')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Machines
        </button>

        <button
          onClick={() => onNavigate('analysis')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-xs transition-colors"
        >
          <Mic className="w-4 h-4" /> Analyze Sound
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
              {machine.machine_code}
            </span>
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
              {machine.machine_type}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900">{machine.name}</h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {machine.location}</span>
            {machine.installation_date && (
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Installed: {machine.installation_date}</span>
            )}
          </div>

          {machine.description && (
            <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 leading-relaxed">
              {machine.description}
            </p>
          )}

          <div className="bg-gray-50 border border-gray-200 p-3 rounded-md flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-500 uppercase font-medium">Baseline Status</span>
              <p className="text-xs font-semibold text-gray-800 mt-0.5">
                {machine.baseline?.baseline_status || 'Not Established'} ({machine.baseline?.sample_count || 0} Samples)
              </p>
            </div>
            <button
              onClick={handleResetBaseline}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 bg-white px-2.5 py-1 rounded border border-gray-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Baseline
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col items-center justify-center shrink-0 min-w-[180px]">
          <HealthGauge score={machine.current_health_score} size="lg" status={machine.status} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-blue-600" /> Acoustic History Trends
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-xs space-y-2">
            <span className="text-xs font-semibold text-gray-700">
              Health Score (0-100) vs Anomaly Score (0-1)
            </span>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#16a34a" fontSize={10} domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#dc2626" fontSize={10} domain={[0, 1.0]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="health" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} name="Health Score" />
                  <Line yAxisId="right" type="monotone" dataKey="anomaly" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} name="Anomaly Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-xs space-y-2">
            <span className="text-xs font-semibold text-gray-700">
              RMS Power & Spectral Centroid
            </span>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#2563eb" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#7c3aed" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="rms" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="RMS Energy" />
                  <Line yAxisId="right" type="monotone" dataKey="spectralCentroid" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} name="Spectral Centroid (Hz)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" /> Analysis History
        </h3>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-600 text-[11px] font-semibold uppercase border-b border-gray-200">
              <tr>
                <th className="px-4 py-2.5">Date & Time</th>
                <th className="px-4 py-2.5">Health Score</th>
                <th className="px-4 py-2.5">Anomaly Score</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analyses.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-2.5 text-gray-600">
                    {new Date(a.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-gray-900">
                    {a.health_score} / 100
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-600">
                    {a.anomaly_score.toFixed(3)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.status === 'Healthy' ? 'bg-green-50 text-green-700 border border-green-200' :
                      a.status === 'Warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => {
                        onSelectAnalysis(a.id);
                        onNavigate('reports');
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-gray-50 text-blue-600 border border-gray-200 font-medium rounded text-xs transition-colors"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
