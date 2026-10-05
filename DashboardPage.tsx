import React, { useEffect, useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Activity,
  Mic,
  ArrowUpRight,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { api } from '../api';
import type { DashboardSummary, DashboardMachineOverview } from '../types';
import { HealthGauge } from '../components/HealthGauge';
import type { PageTab } from '../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (tab: PageTab) => void;
  onSelectMachine: (machineId: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectMachine }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [machines, setMachines] = useState<DashboardMachineOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [sumData, ovData] = await Promise.all([
        api.getDashboardSummary(),
        api.getHealthOverview()
      ]);
      setSummary(sumData);
      setMachines(ovData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Equipment Dashboard</h2>
          <p className="text-xs text-gray-500">Fleet health status and acoustic anomaly overview</p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md text-xs font-medium transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-gray-200 p-3.5 rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">Total Machines</span>
            <Cpu className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-2xl font-bold text-gray-900 mt-2">
            {summary ? summary.total_machines : '-'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-3.5 rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">Healthy</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-2xl font-bold text-green-600 mt-2">
            {summary ? summary.healthy_machines : '-'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-3.5 rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">Warning</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-600 mt-2">
            {summary ? summary.warning_machines : '-'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-3.5 rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">Critical</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-bold text-red-600 mt-2">
            {summary ? summary.critical_machines : '-'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-3.5 rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">Total Analyses</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900 mt-2">
            {summary ? summary.total_analyses : '-'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-3.5 rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">Avg Health</span>
            <Sliders className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-blue-600 mt-2">
            {summary ? `${summary.average_health_score}/100` : '-'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Machine Health</h3>
          <button
            onClick={() => onNavigate('machines')}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
          >
            Manage Machines <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {machines.map((m) => {
            return (
              <div
                key={m.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-xs hover:border-gray-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-400">
                        {m.machine_code}
                      </span>
                      <h4 className="text-base font-bold text-gray-900">{m.name}</h4>
                      <p className="text-xs text-gray-500">{m.machine_type} • {m.location}</p>
                    </div>
                  </div>

                  <div className="my-4 flex items-center justify-center">
                    <HealthGauge score={m.current_health_score} size="md" status={m.status} />
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Baseline:</span>
                      <span className="font-medium text-gray-700">{m.baseline_status}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Anomaly Score:</span>
                      <span className="font-mono text-gray-700">
                        {m.latest_anomaly_score !== null && m.latest_anomaly_score !== undefined
                          ? m.latest_anomaly_score.toFixed(3)
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      onSelectMachine(m.id);
                      onNavigate('analysis');
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" /> Analyze
                  </button>
                  <button
                    onClick={() => {
                      onSelectMachine(m.id);
                      onNavigate('machines');
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md text-xs font-medium transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
