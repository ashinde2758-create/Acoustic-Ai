import React, { useEffect, useState } from 'react';
import { Mic, Upload, Activity, AlertCircle } from 'lucide-react';
import { api } from '../api';
import type { Machine, Analysis } from '../types';
import { AudioUploader } from '../components/AudioUploader';
import { AudioRecorder } from '../components/AudioRecorder';

interface AudioAnalysisPageProps {
  selectedMachineId?: number | null;
  onAnalysisComplete: (analysis: Analysis) => void;
}

export const AudioAnalysisPage: React.FC<AudioAnalysisPageProps> = ({
  selectedMachineId,
  onAnalysisComplete
}) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [targetMachineId, setTargetMachineId] = useState<number | null>(selectedMachineId || null);
  const [inputMode, setInputMode] = useState<'upload' | 'record'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isBaselineSample, setIsBaselineSample] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    api.getMachines().then(data => {
      setMachines(data);
      if (!targetMachineId && data.length > 0) {
        setTargetMachineId(data[0].id);
      }
    });
  }, []);

  const handleRunAnalysis = async () => {
    if (!targetMachineId) {
      setErrorMsg("Please select a target machine.");
      return;
    }
    if (!selectedFile) {
      setErrorMsg("Please upload or record an audio file first.");
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      const result = await api.uploadAudio(targetMachineId, selectedFile, isBaselineSample);
      onAnalysisComplete(result);
    } catch (err: any) {
      setErrorMsg("Analysis failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedMachine = machines.find(m => m.id === targetMachineId);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Audio Analysis</h2>
        <p className="text-xs text-gray-500">
          Upload or record machine audio for feature extraction and anomaly detection
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1 */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-3">
        <label className="block text-xs font-semibold text-gray-700 uppercase">
          1. Select Target Machine
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <select
              value={targetMachineId || ''}
              onChange={(e) => setTargetMachineId(Number(e.target.value))}
              className="w-full bg-white border border-gray-300 rounded-md p-2 text-xs text-gray-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="" disabled>Select Machine...</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.machine_code}) • {m.machine_type}
                </option>
              ))}
            </select>
          </div>

          {selectedMachine && (
            <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-md flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500">Baseline Status:</span>
                <span className="ml-1.5 font-semibold text-gray-800">{selectedMachine.baseline?.baseline_status || 'Not Established'}</span>
              </div>
              <span className="text-gray-500">{selectedMachine.baseline?.sample_count || 0} Samples</span>
            </div>
          )}
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <label className="block text-xs font-semibold text-gray-700 uppercase">
            2. Choose Audio Input
          </label>

          <div className="flex bg-gray-100 p-1 rounded-md">
            <button
              type="button"
              onClick={() => { setInputMode('upload'); setSelectedFile(null); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                inputMode === 'upload' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> File Upload
            </button>
            <button
              type="button"
              onClick={() => { setInputMode('record'); setSelectedFile(null); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                inputMode === 'record' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5" /> Live Microphone
            </button>
          </div>
        </div>

        {inputMode === 'upload' ? (
          <AudioUploader onFileSelected={(file) => setSelectedFile(file)} disabled={isAnalyzing} />
        ) : (
          <AudioRecorder onAudioRecorded={(file) => setSelectedFile(file)} disabled={isAnalyzing} />
        )}

        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center gap-2.5">
          <input
            type="checkbox"
            id="baselineCheckbox"
            checked={isBaselineSample}
            onChange={(e) => setIsBaselineSample(e.target.checked)}
            className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
          />
          <label htmlFor="baselineCheckbox" className="text-xs text-gray-700 cursor-pointer">
            <span className="font-semibold text-gray-900">Mark as Normal Baseline Sample</span> — Check this if the machine is currently running under normal healthy conditions.
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={!selectedFile || !targetMachineId || isAnalyzing}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors disabled:opacity-50"
        >
          <Activity className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Processing Audio...' : 'Start Analysis'}
        </button>
      </div>
    </div>
  );
};
