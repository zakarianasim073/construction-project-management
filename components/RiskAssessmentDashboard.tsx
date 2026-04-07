import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  CloudRain,
  Truck, 
  Users, 
  DollarSign, 
  Zap,
  RefreshCw,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { ProjectState, RiskAssessment } from '../types';
import { generateRiskAssessment } from '../services/geminiService';
import { motion } from 'motion/react';

interface RiskAssessmentDashboardProps {
  project: ProjectState;
  onUpdateRisks: (risks: RiskAssessment[]) => void;
}

export const RiskAssessmentDashboard: React.FC<RiskAssessmentDashboardProps> = ({ project, onUpdateRisks }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const newRisks = await generateRiskAssessment(project);
      onUpdateRisks(newRisks);
    } catch (error) {
      console.error("Risk analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50 border-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-green-600 bg-green-50 border-green-100';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'WEATHER': return <CloudRain className="w-5 h-5" />;
      case 'SUPPLY_CHAIN': return <Truck className="w-5 h-5" />;
      case 'LABOR': return <Users className="w-5 h-5" />;
      case 'FINANCIAL': return <DollarSign className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const averageRisk = project.riskAssessments?.length 
    ? Math.round(project.riskAssessments.reduce((acc, r) => acc + r.riskScore, 0) / project.riskAssessments.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Risk Assessment</h2>
          <p className="text-gray-500">Predictive analysis of project delays and hazards</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isAnalyzing 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing Data...' : 'Run AI Analysis'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskColor(averageRisk)}`}>
              {averageRisk}% Risk Score
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Overall Project Health</h3>
          <p className="text-sm text-gray-500">Based on current DPRs, weather, and financial trends</p>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                averageRisk >= 70 ? 'bg-red-500' : averageRisk >= 40 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${averageRisk}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CloudRain className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600">Upcoming Forecast</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Weather Impact</h3>
          <p className="text-sm text-gray-500">
            {project.weatherForecast?.[0] 
              ? `${project.weatherForecast[0].condition} expected. Impact: ${project.weatherForecast[0].impactLevel}`
              : 'No weather data available'}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-700">
            <TrendingUp className="w-4 h-4" />
            <span>Rain probability: {project.weatherForecast?.[0]?.precipitationProbability || 0}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-bold text-orange-600">Critical Alerts</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Active Risks</h3>
          <p className="text-sm text-gray-500">
            {project.riskAssessments?.filter(r => r.status === 'OPEN').length || 0} items require mitigation
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-700">
            <RefreshCw className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Risk Mitigation Log</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {project.riskAssessments?.map((risk) => (
            <motion.div 
              key={risk.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-xl border ${getRiskColor(risk.riskScore)}`}>
                    {getCategoryIcon(risk.category)}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{risk.description}</h4>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{risk.category} • {risk.date}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getRiskColor(risk.riskScore)}`}>
                      Score: {risk.riskScore}
                    </span>
                  </div>
                  <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-1">
                      <Zap className="w-4 h-4" />
                      AI Mitigation Strategy
                    </div>
                    <p className="text-sm text-indigo-900 leading-relaxed">
                      {risk.mitigationStrategy}
                    </p>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">Dismiss</button>
                    <button className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-bold">
                      Apply Strategy
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {(!project.riskAssessments || project.riskAssessments.length === 0) && (
            <div className="p-12 text-center text-gray-500">
              <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="font-medium">No risks identified yet.</p>
              <p className="text-sm">Run AI Analysis to scan for potential project hazards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
