import React from 'react';
import { 
  Shield, 
  Eye, 
  Camera, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  FileText, 
  ExternalLink,
  Lock,
  Clock
} from 'lucide-react';
import { ProjectState } from '../types';
import { motion } from 'motion/react';

interface ClientPortalProps {
  project: ProjectState;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ project }) => {
  const completedMilestones = project.milestones.filter(m => m.status === 'COMPLETED').length;
  const progressPercent = Math.round((completedMilestones / project.milestones.length) * 100) || 0;

  return (
    <div className="space-y-6">
      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Client Transparency Portal</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">{project.name} - Progress Overview</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold">
                {progressPercent}%
              </div>
              <div>
                <p className="text-xs text-indigo-200 uppercase font-bold">Overall Progress</p>
                <p className="text-sm font-medium">On Track</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-indigo-200 uppercase font-bold">Milestones</p>
                <p className="text-sm font-medium">{completedMilestones} of {project.milestones.length} Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-indigo-200 uppercase font-bold">Target Date</p>
                <p className="text-sm font-medium">{project.endDate}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-gray-400" />
              Latest Site Photos
            </h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">View Gallery</button>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            {project.photoLogs?.slice(0, 4).map((photo) => (
              <div key={photo.id} className="group relative rounded-lg overflow-hidden aspect-video bg-gray-100">
                <img 
                  src={photo.url} 
                  alt={photo.caption} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
                </div>
              </div>
            ))}
            {(!project.photoLogs || project.photoLogs.length === 0) && (
              <div className="col-span-2 py-12 text-center text-gray-400">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No site photos uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gray-400" />
              Milestone Timeline
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {project.milestones.map((m) => (
                <div key={m.id} className="relative pl-8">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${
                    m.status === 'COMPLETED' ? 'bg-green-500' : 
                    m.status === 'AT_RISK' ? 'bg-red-500' : 'bg-gray-200'
                  }`}>
                    {m.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${m.status === 'COMPLETED' ? 'text-gray-900' : 'text-gray-500'}`}>
                      {m.title}
                    </h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {m.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Shared Reports & Documents
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {project.documents.filter(d => d.category === 'REPORT').slice(0, 5).map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.uploadDate} • {doc.size}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
          {project.documents.filter(d => d.category === 'REPORT').length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm italic">
              No public reports shared yet.
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-900">Restricted View Active</p>
          <p className="text-xs text-amber-700">
            Internal financial details, sub-contractor liabilities, and sensitive vendor data are hidden from this view to maintain privacy.
          </p>
        </div>
      </div>
    </div>
  );
};
