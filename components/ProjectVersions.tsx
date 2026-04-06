
import React, { useState, useEffect } from 'react';
import { ProjectState, ProjectVersion, UserRole } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, addDoc, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { History, Plus, Clock, User, FileText, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectVersionsProps {
  projectId: string;
  currentProject: ProjectState;
  userRole: UserRole | null;
  onRestore: (snapshot: ProjectState) => void;
}

const ProjectVersions: React.FC<ProjectVersionsProps> = ({ projectId, currentProject, userRole, onRestore }) => {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [notes, setNotes] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ProjectVersion | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const q = query(
      collection(db, `projects/${projectId}/versions`),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ProjectVersion[];
      setVersions(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `projects/${projectId}/versions`);
    });
    return () => unsubscribe();
  }, [projectId]);

  const handleCreateVersion = async () => {
    if (!versionName.trim()) return;
    setIsSaving(true);
    try {
      const newVersion: Omit<ProjectVersion, 'id'> = {
        projectId,
        versionName,
        snapshot: currentProject,
        createdBy: 'Current User', // In real app, use user.name
        createdAt: new Date().toISOString(),
        notes: notes.trim() || undefined
      };
      await addDoc(collection(db, `projects/${projectId}/versions`), newVersion);
      setVersionName('');
      setNotes('');
      setShowCreate(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `projects/${projectId}/versions`);
    } finally {
      setIsSaving(false);
    }
  };

  const canCreate = userRole === 'ADMIN' || userRole === 'PROJECT_MANAGER';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Project Version History
          </h2>
          <p className="text-slate-500 text-sm">Track and restore previous snapshots of this project</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Snapshot
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="font-semibold text-slate-800">Create New Project Snapshot</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Version Name</label>
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="e.g., Pre-Monsoon Baseline"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason for this snapshot..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateVersion}
              disabled={isSaving || !versionName.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Snapshot'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Past Snapshots</div>
          {versions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No versions saved yet</p>
            </div>
          ) : (
            versions.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVersion(v)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedVersion?.id === v.id
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-800 truncate">{v.versionName}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${selectedVersion?.id === v.id ? 'rotate-90' : ''}`} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(v.createdAt), 'MMM d, HH:mm')}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {v.createdBy}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedVersion ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{selectedVersion.versionName}</h3>
                    <p className="text-slate-500 text-sm mt-1">{selectedVersion.notes || 'No notes provided'}</p>
                  </div>
                  {canCreate && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to restore this version? Current unsaved changes will be lost.')) {
                          onRestore(selectedVersion.snapshot);
                        }
                      }}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm text-sm font-medium"
                    >
                      Restore Snapshot
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">BOQ Items</div>
                    <div className="text-xl font-bold text-slate-700">{selectedVersion.snapshot.boq.length}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">DPR Entries</div>
                    <div className="text-xl font-bold text-slate-700">{selectedVersion.snapshot.dprs.length}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Documents</div>
                    <div className="text-xl font-bold text-slate-700">{selectedVersion.snapshot.documents.length}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contract Value</div>
                    <div className="text-xl font-bold text-slate-700">৳{(selectedVersion.snapshot.contractValue / 1000000).toFixed(1)}M</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Snapshot Details
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Status at snapshot:</span>
                      <span className="font-semibold text-slate-800">{selectedVersion.snapshot.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority at snapshot:</span>
                      <span className="font-semibold text-slate-800">{selectedVersion.snapshot.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created By:</span>
                      <span className="font-semibold text-slate-800">{selectedVersion.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created At:</span>
                      <span className="font-semibold text-slate-800">{format(new Date(selectedVersion.createdAt), 'PPP p')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>Restoring a snapshot will overwrite the current project data. This action is tracked in the version history.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
              <History className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a version to view details</p>
              <p className="text-sm">Compare snapshots and restore data if needed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectVersions;
