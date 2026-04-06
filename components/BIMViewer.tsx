import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Maximize2, 
  MousePointer2, 
  Settings, 
  Info, 
  Eye, 
  EyeOff,
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { ProjectState } from '../types';
import { motion } from 'motion/react';

interface BIMViewerProps {
  project: ProjectState;
}

export const BIMViewer: React.FC<BIMViewerProps> = ({ project }) => {
  const [activeLayer, setActiveLayer] = useState<string>('Structural');

  const ZapIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );

  const layers = [
    { name: 'Structural', icon: <Box className="w-4 h-4" />, status: 'VISIBLE' },
    { name: 'Architectural', icon: <Layers className="w-4 h-4" />, status: 'VISIBLE' },
    { name: 'MEP (Mechanical)', icon: <Settings className="w-4 h-4" />, status: 'HIDDEN' },
    { name: 'Electrical', icon: <ZapIcon className="w-4 h-4" />, status: 'HIDDEN' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">BIM 3D Model Viewer</h2>
          <p className="text-gray-500">Compare "as-built" progress with original architectural intent</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-300">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Search className="w-4 h-4" />
            Find Item
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        <div className="lg:col-span-3 bg-gray-900 rounded-2xl relative overflow-hidden flex items-center justify-center border-4 border-gray-800 shadow-inner group">
          {/* Mock 3D Viewer Canvas */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50" />
          
          <motion.div 
            initial={{ rotateX: 45, rotateY: 45, scale: 0.8 }}
            animate={{ rotateX: 30, rotateY: 30, scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="relative w-64 h-64 border-2 border-blue-500/30 rounded-xl flex items-center justify-center perspective-[1000px]"
          >
            <div className="w-48 h-48 bg-blue-500/10 border-2 border-blue-500/50 rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.3)] flex items-center justify-center">
              <Box className="w-24 h-24 text-blue-400/50" />
            </div>
          </motion.div>

          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white">
              <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1">Active View</p>
              <p className="text-sm font-bold">Foundation & Columns</p>
            </div>
            <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white">
              <p className="text-[10px] uppercase font-bold tracking-widest text-green-400 mb-1">Progress Match</p>
              <p className="text-sm font-bold">92% Accuracy</p>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10">
            <button className="p-2 text-white hover:bg-white/10 rounded-full"><MousePointer2 className="w-5 h-5" /></button>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button className="p-2 text-white hover:bg-white/10 rounded-full"><Layers className="w-5 h-5" /></button>
            <button className="p-2 text-white hover:bg-white/10 rounded-full"><Settings className="w-5 h-5" /></button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 text-center max-w-md">
              <Info className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">3D Engine Integration</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                This module is designed to integrate with lightweight IFC viewers or Autodesk Forge. 
                It allows engineers to overlay real-time DPR progress onto the 3D model.
              </p>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm pointer-events-auto">
                Connect BIM Project
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Model Layers</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {layers.map((layer) => (
              <button 
                key={layer.name}
                onClick={() => setActiveLayer(layer.name)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  activeLayer === layer.name 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                  : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {layer.icon}
                  <span className="text-sm font-bold">{layer.name}</span>
                </div>
                {layer.status === 'VISIBLE' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-30" />}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">As-Built Discrepancies</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                <p className="text-[10px] text-red-900 font-medium">Column C-12 offset by 5cm from design</p>
              </div>
              <div className="flex items-start gap-2 p-2 bg-green-50 border border-green-100 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                <p className="text-[10px] text-green-900 font-medium">Slab thickness verified: 150mm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
