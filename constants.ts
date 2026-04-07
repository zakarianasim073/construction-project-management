
import { ProjectState, Unit } from './types';

export const MOCK_PROJECTS: ProjectState[] = [
  {
    id: 'P001',
    name: "River bank protection work from km 11.184 to km 11.484 (Bhola O&M Division-1)",
    ownerUid: 'system',
    memberUids: ['system'],
    status: 'ACTIVE',
    priority: 'HIGH',
    contractValue: 276947590.738,
    startDate: "2024-12-23",
    endDate: "2026-06-30",
    materials: [
      { id: 'MAT-01', name: 'Portland Composite Cement', unit: Unit.BAG, totalReceived: 6937, totalConsumed: 6534, currentStock: 403, averageRate: 550, pdRemarks: 'Consumption tracking as per DPR' },
      { id: 'MAT-02', name: 'Sylhet Sand (FM 1.5)', unit: Unit.CFT, totalReceived: 35015, totalConsumed: 32488, currentStock: 2527, averageRate: 48 },
      { id: 'MAT-03', name: 'Stone Chips (40mm down)', unit: Unit.CFT, totalReceived: 49823, totalConsumed: 48107, currentStock: 1716, averageRate: 195 },
      { id: 'MAT-04', name: 'Geo-Textile Bags (1200x950mm)', unit: Unit.NOS, totalReceived: 70000, totalConsumed: 68510, currentStock: 1490, averageRate: 424 }
    ],
    subContractors: [
      { 
        id: 'SC-01', 
        name: 'M/S. Hasan & Brothers', 
        specialization: 'Main Contractor', 
        totalWorkValue: 18683412, 
        totalBilled: 15000684, 
        currentLiability: 3682728, 
        agreedRates: [
          { boqId: '10', rate: 990.001 },
          { boqId: '11', rate: 1935.001 },
          { boqId: '13', rate: 676.801 }
        ]
      }
    ],
    boq: [
      { id: '1', description: 'Site preparation by manually removing all miscellaneous objectional materials', unit: Unit.SQM, rate: 32.001, plannedUnitCost: 28.00, plannedQty: 18000, executedQty: 18000, billedAmount: 576018, priority: 'MEDIUM' },
      { id: '2', description: 'Bench Mark Pillar: Manufacturing, supplying & fixing in position RCC (1:2:4)', unit: Unit.NOS, rate: 1321.001, plannedUnitCost: 1100.00, plannedQty: 3, executedQty: 3, billedAmount: 3963, priority: 'LOW' },
      { id: '3', description: 'Earth work by manual labour with clayey soil (min 30% clay)', unit: Unit.CUM, rate: 203.001, plannedUnitCost: 180.00, plannedQty: 1560, executedQty: 1560, billedAmount: 316681, priority: 'MEDIUM' },
      { id: '4', description: 'Earth work in cutting and filling of eroded bank of river', unit: Unit.CUM, rate: 211.001, plannedUnitCost: 190.00, plannedQty: 2590.97, executedQty: 2590.97, billedAmount: 546697, priority: 'MEDIUM' },
      { id: '10', description: 'CC blocks (1:3:5.5): 40cm x 40cm x 40cm', unit: Unit.NOS, rate: 990.001, plannedUnitCost: 850.00, plannedQty: 78319, executedQty: 7167, billedAmount: 4659934, priority: 'HIGH' },
      { id: '11', description: 'CC blocks (1:3:5.5): 50cm x 50cm x 50cm', unit: Unit.NOS, rate: 1935.001, plannedUnitCost: 1700.00, plannedQty: 57070, executedQty: 8213, billedAmount: 9868505, priority: 'HIGH' },
      { id: '13', description: 'Dumping with Barge [Geo-bag] (1200mmx950mm)', unit: Unit.NOS, rate: 676.801, plannedUnitCost: 600.00, plannedQty: 68510, executedQty: 6250, billedAmount: 4230006, priority: 'HIGH' }
    ],
    dprs: [
      { id: 'DPR-001', date: '2026-03-13', activity: 'Block Manufacturing (M-01)', location: 'Casting Yard', laborCount: 26, remarks: 'Produced 244 nos 50x50x50 and 101 nos 40x40x40 blocks.', linkedBoqId: '11', subContractorId: 'SC-01', workDoneQty: 244, materialsUsed: [{ materialId: 'MAT-01', qty: 171 }, { materialId: 'MAT-03', qty: 1716 }] },
      { id: 'DPR-002', date: '2026-03-01', activity: 'Geo-bag Dumping', location: 'River Bank', laborCount: 15, remarks: 'Running account bill measurement entry.', linkedBoqId: '13', subContractorId: 'SC-01', workDoneQty: 6250 }
    ],
    bills: [
      { id: '2nd R/A', type: 'CLIENT_RA', entityName: 'BWDB Bhola O&M Division-1', amount: 18683412, date: '2026-03-01', status: 'PAID' },
      { id: 'NOA-01', type: 'CLIENT_RA', entityName: 'BWDB Bhola O&M Division-1', amount: 276947590, date: '2024-12-08', status: 'PAID' }
    ],
    liabilities: [
      { id: 'L001', description: 'Retention Money (5%)', type: 'RETENTION', amount: 934170, dueDate: '2026-06-30' },
      { id: 'L002', description: 'Unbilled Work (Current Month)', type: 'UNBILLED_WORK', amount: 3682728, dueDate: '2026-04-30' }
    ],
    milestones: [
      { id: 'M1', title: 'Contract Signing', date: '2025-01-05', status: 'COMPLETED', description: 'Formal agreement signed after NOA' },
      { id: 'M2', title: 'Site Mobilization', date: '2024-12-23', status: 'COMPLETED', description: 'Commencement of work' },
      { id: 'M3', title: '50% Block Casting', date: '2025-10-15', status: 'COMPLETED', description: 'Reached halfway mark for CC blocks' },
      { id: 'M4', title: 'Project Completion', date: '2026-06-30', status: 'PENDING', description: 'Final handover' }
    ],
    documents: [
      { id: 'D001', name: 'Notification of Award (NOA).pdf', type: 'PDF', category: 'CONTRACT', module: 'MASTER', uploadDate: '2024-12-08', size: '1.2 MB' },
      { id: 'D002', name: 'Running Account Bill C.pdf', type: 'PDF', category: 'BILL', module: 'FINANCE', uploadDate: '2026-03-01', size: '2.5 MB' },
      { id: 'D003', name: 'Daily Progress Report_13.03.26.pdf', type: 'PDF', category: 'REPORT', module: 'SITE', uploadDate: '2026-03-13', size: '0.8 MB' },
      { id: 'D004', name: 'Bill of Quantities (BOQ).pdf', type: 'PDF', category: 'CONTRACT', module: 'MASTER', uploadDate: '2024-12-08', size: '4.2 MB' }
    ],
    aiSuggestions: [],
    equipment: [
      { id: 'EQ-01', name: 'Mixture Machine M-01', type: 'Mixer', status: 'OPERATIONAL', operatorName: 'Antor', fuelConsumption: 15, lastMaintenanceDate: '2026-02-15', nextMaintenanceDate: '2026-05-15', location: 'Casting Yard' },
      { id: 'EQ-02', name: 'Mixture Machine M-02', type: 'Mixer', status: 'OPERATIONAL', operatorName: 'Ripon', fuelConsumption: 15, lastMaintenanceDate: '2026-02-20', nextMaintenanceDate: '2026-05-20', location: 'Casting Yard' }
    ],
    attendance: [],
    changeOrders: [],
    weatherForecast: [],
    riskAssessments: [],
    wasteLogs: []
  }
];
