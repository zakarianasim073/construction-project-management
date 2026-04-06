import React, { useState } from 'react';
import { 
  Truck, 
  Settings, 
  AlertCircle, 
  Plus, 
  Fuel, 
  Calendar, 
  User, 
  MapPin,
  CheckCircle2,
  Wrench
} from 'lucide-react';
import { ProjectState, Equipment } from '../types';
import { motion } from 'motion/react';

interface EquipmentManagementProps {
  project: ProjectState;
  onUpdateEquipment: (equipment: Equipment[]) => void;
}

export const EquipmentManagement: React.FC<EquipmentManagementProps> = ({ project, onUpdateEquipment }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEquip, setNewEquip] = useState<Partial<Equipment>>({
    status: 'OPERATIONAL',
    fuelConsumption: 0
  });

  const handleAdd = () => {
    const equip: Equipment = {
      id: `EQ-${Date.now()}`,
      name: newEquip.name || 'New Equipment',
      type: newEquip.type || 'General',
      status: newEquip.status as any || 'OPERATIONAL',
      operatorName: newEquip.operatorName,
      fuelConsumption: newEquip.fuelConsumption || 0,
      lastMaintenanceDate: newEquip.lastMaintenanceDate || new Date().toISOString().split('T')[0],
      nextMaintenanceDate: newEquip.nextMaintenanceDate || new Date().toISOString().split('T')[0],
      location: newEquip.location || 'Site A'
    };
    onUpdateEquipment([...(project.equipment || []), equip]);
    setShowAddModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'bg-green-100 text-green-700 border-green-200';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'BREAKDOWN': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment & Assets</h2>
          <p className="text-gray-500">Track machinery, maintenance, and fuel consumption</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.equipment?.map((equip) => (
          <motion.div 
            key={equip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(equip.status)}`}>
                  {equip.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{equip.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{equip.type}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Operator: {equip.operatorName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Location: {equip.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Fuel className="w-4 h-4 text-gray-400" />
                  <span>Fuel: {equip.fuelConsumption} L/hr</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Last Service</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {equip.lastMaintenanceDate}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Next Service</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <Wrench className="w-3 h-3 text-orange-400" />
                    {equip.nextMaintenanceDate}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {(!project.equipment || project.equipment.length === 0) && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Truck className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No equipment tracked yet</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-blue-600 hover:underline text-sm font-medium"
            >
              Add your first piece of machinery
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Equipment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Caterpillar Excavator 320"
                  onChange={(e) => setNewEquip({...newEquip, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Excavator"
                    onChange={(e) => setNewEquip({...newEquip, type: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setNewEquip({...newEquip, status: e.target.value as any})}
                  >
                    <option value="OPERATIONAL">Operational</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="BREAKDOWN">Breakdown</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Name"
                    onChange={(e) => setNewEquip({...newEquip, operatorName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel (L/hr)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setNewEquip({...newEquip, fuelConsumption: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Service</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setNewEquip({...newEquip, nextMaintenanceDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Site A"
                    onChange={(e) => setNewEquip({...newEquip, location: e.target.value})}
                  />
                </div>
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
