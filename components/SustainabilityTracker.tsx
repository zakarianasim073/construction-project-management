import React, { useState } from 'react';
import { 
  Leaf, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  Cloud, 
  BarChart3, 
  Plus,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { ProjectState, WasteLog, Material } from '../types';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SustainabilityTrackerProps {
  project: ProjectState;
  onUpdateWaste: (logs: WasteLog[]) => void;
}

export const SustainabilityTracker: React.FC<SustainabilityTrackerProps> = ({ project, onUpdateWaste }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWaste, setNewWaste] = useState<Partial<WasteLog>>({
    qty: 0,
    carbonFootprintEstimate: 0
  });

  const handleAdd = () => {
    const log: WasteLog = {
      id: `WST-${Date.now()}`,
      materialId: newWaste.materialId || 'General',
      qty: newWaste.qty || 0,
      reason: newWaste.reason || 'Standard Wastage',
      date: new Date().toISOString().split('T')[0],
      carbonFootprintEstimate: newWaste.carbonFootprintEstimate || 0
    };
    onUpdateWaste([...(project.wasteLogs || []), log]);
    setShowAddModal(false);
  };

  const totalWaste = project.wasteLogs?.reduce((acc, l) => acc + l.qty, 0) || 0;
  const totalCarbon = project.wasteLogs?.reduce((acc, l) => acc + l.carbonFootprintEstimate, 0) || 0;

  const chartData = project.wasteLogs?.reduce((acc: any[], log) => {
    const existing = acc.find(a => a.name === log.materialId);
    if (existing) {
      existing.value += log.qty;
    } else {
      acc.push({ name: log.materialId, value: log.qty });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sustainability & Waste Tracker</h2>
          <p className="text-gray-500">Monitor material wastage and carbon footprint</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Log Wastage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <Trash2 className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Total Waste</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalWaste.toLocaleString()} Units</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+4% from last month</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Cloud className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Carbon Footprint</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalCarbon.toLocaleString()} kg CO2</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600 font-medium">
            <TrendingDown className="w-3 h-3" />
            <span>-12% vs Industry Avg</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <Leaf className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Green Rating</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">Silver</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 font-medium">
            <span>Target: Gold by Q4</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Zap className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Energy Efficiency</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">88%</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Optimized usage</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Wastage by Material Type
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#6366f1'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Recent Waste Logs</h3>
            <span className="text-xs text-gray-500">{project.wasteLogs?.length || 0} entries</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[350px] overflow-y-auto">
            {project.wasteLogs?.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{log.materialId}</h4>
                    <p className="text-xs text-gray-500">{log.date} • {log.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">-{log.qty} Units</p>
                    <p className="text-[10px] text-gray-400 font-mono">{log.carbonFootprintEstimate} kg CO2</p>
                  </div>
                </div>
              </div>
            ))}
            {(!project.wasteLogs || project.wasteLogs.length === 0) && (
              <div className="p-12 text-center text-gray-400">
                <Leaf className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p>No wastage logged yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Log Material Wastage</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setNewWaste({...newWaste, materialId: e.target.value})}
                >
                  <option value="">Select Material</option>
                  {project.materials.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qty Wasted</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setNewWaste({...newWaste, qty: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CO2 Estimate (kg)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setNewWaste({...newWaste, carbonFootprintEstimate: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Waste</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Breakage during transport"
                  onChange={(e) => setNewWaste({...newWaste, reason: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Log Waste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
