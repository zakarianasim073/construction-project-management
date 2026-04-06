import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  User, 
  ChevronRight,
  AlertCircle,
  FilePlus2
} from 'lucide-react';
import { ProjectState, ChangeOrder } from '../types';
import { motion } from 'motion/react';

interface ChangeOrderManagementProps {
  project: ProjectState;
  onUpdateChangeOrders: (orders: ChangeOrder[]) => void;
}

export const ChangeOrderManagement: React.FC<ChangeOrderManagementProps> = ({ project, onUpdateChangeOrders }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<ChangeOrder>>({
    status: 'PENDING'
  });

  const handleAdd = () => {
    const order: ChangeOrder = {
      id: `CO-${Date.now()}`,
      title: newOrder.title || 'New Change Order',
      description: newOrder.description || '',
      requestedBy: newOrder.requestedBy || 'Site Engineer',
      requestedDate: new Date().toISOString().split('T')[0],
      estimatedCost: newOrder.estimatedCost || 0,
      status: 'PENDING',
      linkedBoqId: newOrder.linkedBoqId
    };
    onUpdateChangeOrders([...(project.changeOrders || []), order]);
    setShowAddModal(false);
  };

  const handleStatusChange = (id: string, status: ChangeOrder['status']) => {
    const updated = (project.changeOrders || []).map(o => 
      o.id === id ? { ...o, status, approvedDate: status === 'APPROVED' ? new Date().toISOString().split('T')[0] : undefined } : o
    );
    onUpdateChangeOrders(updated);
  };

  const stats = {
    pending: project.changeOrders?.filter(o => o.status === 'PENDING').length || 0,
    approved: project.changeOrders?.filter(o => o.status === 'APPROVED').length || 0,
    totalValue: project.changeOrders?.filter(o => o.status === 'APPROVED').reduce((acc, o) => acc + o.estimatedCost, 0) || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Change Order Management</h2>
          <p className="text-gray-500">Track and approve extra work outside the original BOQ</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Request Change
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Pending Approvals</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Approved Orders</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Extra Value</p>
          <p className="text-2xl font-bold text-blue-600">৳{stats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Change Order Log</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {project.changeOrders?.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-xl border ${
                    order.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' :
                    order.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    <FilePlus2 className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{order.title}</h4>
                      <p className="text-sm text-gray-500">{order.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">৳{order.estimatedCost.toLocaleString()}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        order.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' :
                        order.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-orange-100 text-orange-700 border-orange-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>By: {order.requestedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Date: {order.requestedDate}</span>
                    </div>
                    {order.linkedBoqId && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <span>Link: {order.linkedBoqId}</span>
                      </div>
                    )}
                  </div>

                  {order.status === 'PENDING' && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                      <button 
                        onClick={() => handleStatusChange(order.id, 'REJECTED')}
                        className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleStatusChange(order.id, 'APPROVED')}
                        className="px-4 py-2 text-sm font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                      >
                        Approve Change
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {(!project.changeOrders || project.changeOrders.length === 0) && (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="font-medium">No change orders found.</p>
              <p className="text-sm">Requests for extra work will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Request Change Order</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Additional Foundation Reinforcement"
                  onChange={(e) => setNewOrder({...newOrder, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  placeholder="Explain why this extra work is required..."
                  onChange={(e) => setNewOrder({...newOrder, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Est. Cost (৳)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setNewOrder({...newOrder, estimatedCost: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link to BOQ ID</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="BOQ-001"
                    onChange={(e) => setNewOrder({...newOrder, linkedBoqId: e.target.value})}
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
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
