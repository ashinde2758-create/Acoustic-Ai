import React, { useEffect, useState } from 'react';
import { Download, Filter, Search, Eye } from 'lucide-react';
import { api } from '../api';
import type { Analysis } from '../types';
import type { PageTab } from '../components/Sidebar';

interface ReportsPageProps {
  onNavigate: (tab: PageTab) => void;
  onSelectAnalysis: (analysisId: number) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate, onSelectAnalysis }) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadAnalyses = async () => {
    try {
      const data = await api.getAllAnalyses(statusFilter || undefined);
      setAnalyses(data);
    } catch (err) {
      console.error("Failed to load analyses:", err);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, [statusFilter]);

  const exportToCSV = () => {
    if (analyses.length === 0) return;
    const headers = ["Analysis ID", "Machine", "Date Time", "Health Score", "Anomaly Score", "Status", "Model"];
    const rows = analyses.map(a => [
      a.id,
      `"${a.machine_name || 'Machine ' + a.machine_id}"`,
      `"${new Date(a.created_at).toLocaleString()}"`,
      a.health_score,
      a.anomaly_score.toFixed(3),
      a.status,
      `"${a.model_name}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `acoustic_reports_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = analyses.filter(a =>
    (a.machine_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analysis History</h2>
          <p className="text-xs text-gray-500">Record of all performed sound analysis runs</p>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white border border-gray-200 p-3 rounded-lg shadow-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by machine or feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-[11px] font-semibold uppercase border-b border-gray-200">
            <tr>
              <th className="px-4 py-2.5">ID</th>
              <th className="px-4 py-2.5">Machine</th>
              <th className="px-4 py-2.5">Timestamp</th>
              <th className="px-4 py-2.5">Health Score</th>
              <th className="px-4 py-2.5">Anomaly Score</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-4 py-2.5 font-semibold text-gray-900">#{a.id}</td>
                <td className="px-4 py-2.5 font-medium text-gray-800">
                  {a.machine_name || `Machine #${a.machine_id}`}
                </td>
                <td className="px-4 py-2.5 text-gray-500">
                  {new Date(a.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 font-bold text-gray-900">
                  {a.health_score} / 100
                </td>
                <td className="px-4 py-2.5 font-mono text-gray-600">
                  {a.anomaly_score.toFixed(3)}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
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
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-50 text-blue-600 border border-gray-200 font-medium rounded text-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
