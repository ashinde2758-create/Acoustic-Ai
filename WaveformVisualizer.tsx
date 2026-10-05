import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  data?: number[];
  height?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ data = [], height = 100 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const barWidth = Math.max(2, width / data.length);
    const middle = canvas.height / 2;

    ctx.fillStyle = '#2563eb';
    data.forEach((val, i) => {
      const x = i * barWidth;
      const barHeight = Math.max(2, val * (canvas.height / 2.2));
      ctx.fillRect(x, middle - barHeight / 2, barWidth - 1, barHeight);
    });

    // Draw center zero line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, middle);
    ctx.lineTo(width, middle);
    ctx.stroke();

  }, [data, height]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
        No Waveform Data Available
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-3 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700">Audio Waveform</span>
        <span className="text-[11px] text-gray-400">Signal Preview</span>
      </div>
      <div className="bg-gray-50 rounded p-1 border border-gray-100">
        <canvas
          ref={canvasRef}
          width={600}
          height={height}
          className="w-full h-auto block"
        />
      </div>
    </div>
  );
};
