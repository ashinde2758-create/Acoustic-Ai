import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { AcousticFeature } from '../types';

interface FeatureChartProps {
  features: AcousticFeature[];
}

export const FeatureChart: React.FC<FeatureChartProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return (
      <div className="w-full h-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
        No Extracted Feature Data
      </div>
    );
  }

  const keyFeatures = features
    .filter(f =>
      f.feature_name.includes('RMS') ||
      f.feature_name.includes('Zero_Crossing') ||
      f.feature_name.includes('Spectral_Centroid') ||
      f.feature_name.includes('Spectral_Rolloff') ||
      f.feature_name.includes('MFCC_1_') ||
      f.feature_name.includes('MFCC_2_')
    )
    .map(f => ({
      name: f.feature_name.replace('_Mean', '').replace(/_/g, ' '),
      val: Math.abs(f.feature_value) < 1.0 ? parseFloat(f.feature_value.toFixed(4)) : Math.round(f.feature_value),
      rawVal: f.feature_value,
      group: f.feature_group
    }));

  const colors = ['#2563eb', '#0d9488', '#0284c7', '#6366f1', '#d97706', '#db2777'];

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-700">
          Acoustic Features Summary
        </span>
        <span className="text-[11px] text-gray-400">Signal Statistics</span>
      </div>

      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={keyFeatures} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '0.375rem',
                color: '#1e293b',
                fontSize: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="val" radius={[3, 3, 0, 0]}>
              {keyFeatures.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
