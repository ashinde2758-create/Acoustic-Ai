import React, { useState, useRef } from 'react';
import { Upload, FileAudio, CheckCircle2, AlertCircle } from 'lucide-react';

interface AudioUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelected, disabled }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedExtensions = ['.wav', '.mp3', '.flac', '.m4a', '.ogg'];
  const maxSizeBytes = 25 * 1024 * 1024; // 25 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      setErrorMsg(`Unsupported file type '${ext}'. Please upload a WAV, MP3, FLAC, or M4A audio file.`);
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMsg(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds limit of 25 MB.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {errorMsg && (
        <div className="w-full mb-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          selectedFile
            ? 'border-blue-400 bg-blue-50/40'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".wav,.mp3,.flac,.m4a,.ogg"
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <FileAudio className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-800">{selectedFile.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> File Selected
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Click to upload or drag and drop audio file
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports WAV, MP3, FLAC, M4A up to 25 MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
