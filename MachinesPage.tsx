import React, { useEffect, useState } from 'react';
import { Plus, Search, Cpu, Trash2, Mic, X } from 'lucide-react';
import { api } from '../api';
import type { Machine } from '../types';
import { HealthGauge } from '../components/HealthGauge';
import type { PageTab } from '../components/Sidebar';

interface MachinesPageProps {
  onNavigate: (tab: PageTab) => void;
  onSelectMachine: (machineId: number) => void;
}

export const MachinesPage: React.FC<MachinesPageProps> = ({ onNavigate, onSelectMachine }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    machine_code: '',
    machine_type: 'Motor',
    custom_type: '',
    location: '',
    description: '',
    installation_date: new Date().toISOString().split('T')[0]
  });

  const loadMachines = async () => {
    try {
      const data = await api.getMachines();
      setMachines(data);
    } catch (err) {
      console.error("Failed to load machines:", err);
    }
  };

  useEffect(() => {
    loadMachines();
  }, []);

  const handleCreateMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalType = formData.machine_type === 'Other' ? formData.custom_type : formData.machine_type;
      await api.createMachine({
        name: formData.name,
        machine_code: formData.machine_code || `MCH-${Date.now().toString().slice(-5)}`,
        machine_type: finalType,
        location: formData.location,
        description: formData.description,
        installation_date: formData.installation_date
      });
      setIsModalOpen(false);
      setFormData({
        name: '',
        machine_code: '',
        machine_type: 'Motor',
        custom_type: '',
        location: '',
        description: '',
        installation_date: new Date().toISOString().split('T')[0]
      });
      loadMachines();
    } catch (err: any) {
      alert("Error adding machine: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteMachine = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete machine '${name}' and its analyses?`)) {
      try {
        await api.deleteMachine(id);
        loadMachines();
      } catch (err: any) {
        alert("Failed to delete machine: " + err.message);
      }
    }
  };

  const filteredMachines = machines.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.machine_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.machine_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Machines</h2>
          <p className="text-xs text-gray-500">Register and manage equipment under acoustic monitoring</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Machine
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search machines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachines.map((m) => (
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
                  <h3 className="text-base font-bold text-gray-900 mt-0.5">{m.name}</h3>
                  <p className="text-xs text-gray-500">{m.machine_type} • {m.location}</p>
                </div>
                <button
                  onClick={() => handleDeleteMachine(m.id, m.name)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                  title="Delete machine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="my-4 flex items-center justify-center">
                <HealthGauge score={m.current_health_score} size="md" status={m.status} />
              </div>

              {m.description && (
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 mb-3 line-clamp-2">
                  {m.description}
                </p>
              )}

              <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Baseline:</span>
                  <span className="font-medium text-gray-700">{m.baseline?.baseline_status || 'Not Established'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Samples:</span>
                  <span className="text-gray-700">{m.baseline?.sample_count || 0}</span>
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
                <Mic className="w-3.5 h-3.5" /> Analyze Audio
              </button>
              <button
                onClick={() => {
                  onSelectMachine(m.id);
                }}
                className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md text-xs font-medium transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-lg w-full p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" /> Add New Machine
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMachine} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Machine Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Motor-02"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Machine Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MTR-02"
                    value={formData.machine_code}
                    onChange={(e) => setFormData({ ...formData, machine_code: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Machine Type *</label>
                  <select
                    value={formData.machine_type}
                    onChange={(e) => setFormData({ ...formData, machine_type: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Motor">Motor</option>
                    <option value="Pump">Pump</option>
                    <option value="Fan">Fan</option>
                    <option value="Compressor">Compressor</option>
                    <option value="Gearbox">Gearbox</option>
                    <option value="Conveyor">Conveyor</option>
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Floor 1, Bay B"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {formData.machine_type === 'Other' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Custom Machine Type *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CNC Spindle"
                    value={formData.custom_type}
                    onChange={(e) => setFormData({ ...formData, custom_type: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-1">Installation Date</label>
                <input
                  type="date"
                  value={formData.installation_date}
                  onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional operational details or equipment notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  Save Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
