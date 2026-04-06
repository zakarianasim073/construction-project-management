
import React from 'react';
import { ProjectState, Bill, DPR, BOQItem } from '../types';
import { 
  FileBarChart, 
  Download, 
  FileText, 
  Calendar, 
  DollarSign, 
  HardHat, 
  CheckCircle2, 
  ChevronRight, 
  Mail, 
  Share2,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportingProps {
  project: ProjectState;
}

const Reporting: React.FC<ReportingProps> = ({ project }) => {
  const [isGenerating, setIsGenerating] = React.useState<string | null>(null);

  const reports = [
    { id: 'DPR_SUMMARY', title: 'Daily Progress Summary', description: 'Consolidated report of all site activities and labor counts.', icon: HardHat, color: 'bg-blue-50 text-blue-600' },
    { id: 'FINANCIAL_HEALTH', title: 'Financial Health Report', description: 'Budget vs Actual, cash flow, and pending liabilities.', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'BOQ_RECONCILIATION', title: 'BOQ Reconciliation', description: 'Detailed comparison of planned vs executed quantities.', icon: FileText, color: 'bg-amber-50 text-amber-600' },
    { id: 'QC_SAFETY_LOG', title: 'QC & Safety Log', description: 'History of all inspections and safety audits.', icon: CheckCircle2, color: 'bg-red-50 text-red-600' },
    { id: 'STAKEHOLDER_UPDATE', title: 'Executive Stakeholder Update', description: 'High-level summary for directors and clients.', icon: FileBarChart, color: 'bg-purple-50 text-purple-600' },
  ];

  const generateDPRSummary = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Daily Progress Summary', 14, 22);
    doc.setFontSize(11);
    doc.text(`Project: ${project.name}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

    const tableData = project.dprs.map(dpr => [
      dpr.date,
      dpr.linkedBoqId || 'N/A',
      dpr.workDoneQty?.toString() || '0',
      dpr.laborCount.toString(),
      dpr.remarks
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Date', 'BOQ ID', 'Work Qty', 'Labor', 'Remarks']],
      body: tableData,
    });

    doc.save(`${project.name}_DPR_Summary.pdf`);
  };

  const generateFinancialHealth = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Financial Health Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Project: ${project.name}`, 14, 30);

    const totalRevenue = project.bills.filter(b => b.type === 'CLIENT_RA').reduce((acc, b) => acc + b.amount, 0);
    const totalExpenses = project.bills.filter(b => b.type !== 'CLIENT_RA').reduce((acc, b) => acc + b.amount, 0);
    
    doc.text(`Total Revenue: BDT ${totalRevenue.toLocaleString()}`, 14, 45);
    doc.text(`Total Expenses: BDT ${totalExpenses.toLocaleString()}`, 14, 52);
    doc.text(`Net Cash Flow: BDT ${(totalRevenue - totalExpenses).toLocaleString()}`, 14, 59);

    const billData = project.bills.map(b => [
      b.id,
      b.entityName,
      b.type,
      `BDT ${b.amount.toLocaleString()}`,
      b.status
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Bill ID', 'Entity', 'Type', 'Amount', 'Status']],
      body: billData,
    });

    doc.save(`${project.name}_Financial_Health.pdf`);
  };

  const generateBOQReconciliation = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('BOQ Reconciliation Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Project: ${project.name}`, 14, 30);

    const boqData = project.boq.map(item => [
      item.id,
      item.description.substring(0, 50) + (item.description.length > 50 ? '...' : ''),
      item.unit,
      item.plannedQty.toString(),
      item.executedQty.toString(),
      `${((item.executedQty / item.plannedQty) * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Description', 'Unit', 'Planned', 'Executed', 'Progress']],
      body: boqData,
    });

    doc.save(`${project.name}_BOQ_Reconciliation.pdf`);
  };

  const generateQCSafetyLog = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('QC & Safety Log Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Project: ${project.name}`, 14, 30);

    // Quality Checks
    doc.setFontSize(14);
    doc.text('Quality Inspections', 14, 45);
    const qcData = (project.qualityChecks || []).map(qc => [
      qc.date,
      qc.title,
      qc.location,
      qc.status,
      qc.items.filter(i => i.isOk).length + '/' + qc.items.length
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Date', 'Title', 'Location', 'Status', 'Passed Items']],
      body: qcData,
    });

    // Safety Checks
    const lastY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Safety Audits', 14, lastY);
    const safetyData = (project.safetyChecks || []).map(sc => [
      sc.date,
      sc.score.toString() + '%',
      sc.status,
      sc.hazardsIdentified.length.toString(),
      sc.correctiveActions.length.toString()
    ]);

    autoTable(doc, {
      startY: lastY + 5,
      head: [['Date', 'Score', 'Status', 'Hazards', 'Actions']],
      body: safetyData,
    });

    doc.save(`${project.name}_QC_Safety_Log.pdf`);
  };

  const generateExecutiveUpdate = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text('Executive Stakeholder Update', 14, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Project: ${project.name}`, 14, 35);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 42);

    // Summary Section
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(14, 48, 196, 48);

    const totalPlanned = project.boq.reduce((acc, i) => acc + (i.plannedQty * i.rate), 0);
    const totalExecuted = project.boq.reduce((acc, i) => acc + (i.executedQty * i.rate), 0);
    const progress = ((totalExecuted / totalPlanned) * 100).toFixed(1);

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Project Summary', 14, 60);
    
    doc.setFontSize(11);
    doc.text(`Overall Progress: ${progress}%`, 14, 70);
    doc.text(`Contract Value: BDT ${project.contractValue.toLocaleString()}`, 14, 77);
    doc.text(`Executed Value: BDT ${totalExecuted.toLocaleString()}`, 14, 84);
    
    // Milestones
    doc.setFontSize(14);
    doc.text('Upcoming Milestones', 14, 100);
    const milestoneData = project.milestones.slice(0, 5).map(m => [
      m.title,
      m.date,
      m.status
    ]);

    autoTable(doc, {
      startY: 105,
      head: [['Milestone', 'Target Date', 'Status']],
      body: milestoneData,
    });

    doc.save(`${project.name}_Executive_Update.pdf`);
  };

  const handleGenerate = async (reportId: string) => {
    setIsGenerating(reportId);
    try {
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      switch (reportId) {
        case 'DPR_SUMMARY':
          generateDPRSummary();
          break;
        case 'FINANCIAL_HEALTH':
          generateFinancialHealth();
          break;
        case 'BOQ_RECONCILIATION':
          generateBOQReconciliation();
          break;
        case 'QC_SAFETY_LOG':
          generateQCSafetyLog();
          break;
        case 'STAKEHOLDER_UPDATE':
          generateExecutiveUpdate();
          break;
        default:
          alert("This report type is currently being developed.");
      }
    } catch (error) {
      console.error("Report generation failed", error);
      alert("Failed to generate report.");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Automated Reporting</h2>
            <p className="text-slate-500">Generate and export comprehensive project reports with one click.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-slate-600 font-bold text-sm hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 transition-all">
              <Calendar className="w-4 h-4" />
              Schedule Reports
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map(report => (
            <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group flex items-start gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${report.color} group-hover:scale-110 transition-transform`}>
                <report.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg mb-1">{report.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{report.description}</p>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleGenerate(report.id)}
                    disabled={isGenerating === report.id}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isGenerating === report.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                    {isGenerating === report.id ? 'Generating...' : 'Download PDF'}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Reports History</h3>
          <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map(i => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Monthly_Financial_Summary_Mar_2026.pdf</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Generated on Apr 01, 2026 • 2.4 MB</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reporting;
