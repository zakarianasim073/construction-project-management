import React, { useState } from 'react';
import { 
  Users, 
  QrCode, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { ProjectState, AttendanceRecord } from '../types';
import { motion } from 'motion/react';

interface AttendanceManagementProps {
  project: ProjectState;
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ project, onUpdateAttendance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredRecords = project.attendance?.filter(r => 
    r.date === selectedDate && 
    r.workerName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    present: filteredRecords.filter(r => r.status === 'PRESENT').length,
    absent: filteredRecords.filter(r => r.status === 'ABSENT').length,
    leave: filteredRecords.filter(r => r.status === 'LEAVE').length,
    total: filteredRecords.length
  };

  const handleStatusChange = (id: string, status: AttendanceRecord['status']) => {
    const updated = (project.attendance || []).map(r => 
      r.id === id ? { ...r, status } : r
    );
    onUpdateAttendance(updated);
  };

  const handleAddWorker = () => {
    const name = prompt("Enter worker name:");
    if (!name) return;
    
    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      workerId: `W-${Math.random().toString(36).substr(2, 5)}`,
      workerName: name,
      date: selectedDate,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PRESENT'
    };
    onUpdateAttendance([...(project.attendance || []), newRecord]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Worker Attendance</h2>
          <p className="text-gray-500">Manage site labor and track productivity</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
            <QrCode className="w-4 h-4" />
            QR Scanner
          </button>
          <button 
            onClick={handleAddWorker}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Worker
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Workers</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Present</p>
          <p className="text-2xl font-bold text-green-700">{stats.present}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
          <p className="text-sm text-red-600 mb-1">Absent</p>
          <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <p className="text-sm text-blue-600 mb-1">Productivity Index</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-blue-700">84%</p>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search workers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="date" 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Worker Name</th>
                <th className="px-6 py-3 font-semibold">Worker ID</th>
                <th className="px-6 py-3 font-semibold">Check In</th>
                <th className="px-6 py-3 font-semibold">Check Out</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {record.workerName.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{record.workerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{record.workerId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {record.checkIn}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {record.checkOut ? (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {record.checkOut}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">On-site</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      record.status === 'PRESENT' ? 'bg-green-100 text-green-700 border-green-200' :
                      record.status === 'ABSENT' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleStatusChange(record.id, 'PRESENT')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Mark Present"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(record.id, 'ABSENT')}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Mark Absent"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    No attendance records found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
