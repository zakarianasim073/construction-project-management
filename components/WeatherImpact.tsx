import React from 'react';
import { 
  CloudRain, 
  Sun, 
  Cloud, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ProjectState, WeatherData } from '../types';
import { motion } from 'motion/react';

interface WeatherImpactProps {
  project: ProjectState;
}

export const WeatherImpact: React.FC<WeatherImpactProps> = ({ project }) => {
  const forecast = project.weatherForecast || [];

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-100';
      case 'MEDIUM': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-green-600 bg-green-50 border-green-100';
    }
  };

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('thunderstorm')) return <CloudRain className="w-8 h-8" />;
    if (c.includes('cloud')) return <Cloud className="w-8 h-8" />;
    if (c.includes('wind')) return <Wind className="w-8 h-8" />;
    return <Sun className="w-8 h-8" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weather Integration & Impact</h2>
          <p className="text-gray-500">Site-specific forecasts and activity rescheduling suggestions</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          <Clock className="w-4 h-4" />
          Last synced: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {forecast.map((day, idx) => (
          <motion.div 
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-2xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
              idx === 0 ? 'border-blue-200 ring-4 ring-blue-50' : 'border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-blue-600">
                {getWeatherIcon(day.condition)}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getImpactColor(day.impactLevel)}`}>
                {day.impactLevel} Impact
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{idx === 0 ? 'Today' : day.date}</p>
              <h3 className="text-3xl font-black text-gray-900">{day.temp}°C</h3>
              <p className="text-gray-600 font-medium">{day.condition}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CloudRain className="w-3.5 h-3.5" />
                <span>{day.precipitationProbability}% Rain</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Wind className="w-3.5 h-3.5" />
                <span>{day.windSpeed} km/h</span>
              </div>
            </div>

            {day.suggestedAction && (
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                <div className="flex items-center gap-2 text-orange-700 font-bold text-[10px] uppercase mb-1">
                  <AlertTriangle className="w-3 h-3" />
                  AI Suggestion
                </div>
                <p className="text-xs text-orange-900 leading-relaxed">
                  {day.suggestedAction}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Activity Rescheduling Impact</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-red-900">Concrete Pouring at Block B</h4>
                <p className="text-sm text-red-700 mb-3">Scheduled for Tomorrow (April 7). High risk of washout due to predicted thunderstorm.</p>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
                    Reschedule to April 9
                  </button>
                  <button className="text-xs text-red-600 font-bold hover:underline">View Alternatives</button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900">Interior Electrical Work</h4>
                <p className="text-sm text-blue-700 mb-3">Can be accelerated during rain to maintain labor productivity.</p>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Assign 5 More Workers
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Historical Weather Correlation</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Days lost to weather (MTD)</span>
              <span className="font-bold text-gray-900">3 Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Productivity loss estimate</span>
              <span className="font-bold text-red-600">-৳125,000</span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">Correlation with DPR progress:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Dry Days: 100% Target Met</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Light Rain: 75% Target Met</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Heavy Rain: 15% Target Met</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
