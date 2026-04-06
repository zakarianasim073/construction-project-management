import React, { useState } from 'react';
import { 
  Star, 
  Truck, 
  CheckCircle2, 
  DollarSign, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Package,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { ProjectState, VendorRating, SubContractor, Material } from '../types';
import { motion } from 'motion/react';

interface VendorPerformanceProps {
  project: ProjectState;
}

export const VendorPerformance: React.FC<VendorPerformanceProps> = ({ project }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock vendor ratings based on project data
  const vendors: VendorRating[] = [
    { vendorName: 'Steel Corp Ltd', deliveryScore: 4.5, qualityScore: 4.8, priceScore: 3.5, overallRating: 4.3 },
    { vendorName: 'Cement Solutions', deliveryScore: 3.8, qualityScore: 4.2, priceScore: 4.5, overallRating: 4.1 },
    { vendorName: 'Brick Masters', deliveryScore: 4.2, qualityScore: 3.5, priceScore: 4.8, overallRating: 4.2 },
    { vendorName: 'Electrical Pro', deliveryScore: 4.9, qualityScore: 4.9, priceScore: 2.8, overallRating: 4.2 },
  ];

  const filteredVendors = vendors.filter(v => 
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendor Performance Rating</h2>
          <p className="text-gray-500">Track supplier reliability, quality, and pricing consistency</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search vendors..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-300">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <motion.div 
            key={vendor.vendorName}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{vendor.overallRating}</p>
                  {renderStars(vendor.overallRating)}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{vendor.vendorName}</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Preferred Supplier</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    <span>Delivery Speed</span>
                    <span className="text-gray-900 font-bold">{vendor.deliveryScore}/5.0</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(vendor.deliveryScore/5)*100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    <span>Material Quality</span>
                    <span className="text-gray-900 font-bold">{vendor.qualityScore}/5.0</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(vendor.qualityScore/5)*100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    <span>Price Consistency</span>
                    <span className="text-gray-900 font-bold">{vendor.priceScore}/5.0</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(vendor.priceScore/5)*100}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Rating Up 0.2</span>
                </div>
                <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                  Full History
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Recent Vendor Interactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Vendor</th>
                <th className="px-6 py-3 font-semibold">Material</th>
                <th className="px-6 py-3 font-semibold">Delivery Date</th>
                <th className="px-6 py-3 font-semibold">QC Status</th>
                <th className="px-6 py-3 font-semibold">Price Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {project.purchaseOrders?.slice(0, 5).map((po) => (
                <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{po.vendorName}</td>
                  <td className="px-6 py-4 text-gray-600">{po.materialId}</td>
                  <td className="px-6 py-4 text-gray-600">{po.actualDeliveryDate || po.expectedDeliveryDate}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Passed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-green-600 font-medium">
                      <TrendingDown className="w-4 h-4" />
                      -2.4%
                    </div>
                  </td>
                </tr>
              ))}
              {(!project.purchaseOrders || project.purchaseOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                    No recent purchase order interactions found.
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
