import { DemoRoute } from '../../types';

export const DEMO_ROUTES: DemoRoute[] = [
  {
    id: 's1',
    name: 'Gate → Library',
    fromId: 'main_gate',
    toId: 'library',
    description: 'Main Gate to Central Library via East Promenade',
  },
  {
    id: 's2',
    name: 'Parking → Canteen',
    fromId: 'parking_area',
    toId: 'canteen',
    description: 'Parking Area to Main Canteen via West Promenade',
  },
  {
    id: 's3',
    name: 'Hostel → CS Block',
    fromId: 'hostel',
    toId: 'cs_block',
    description: 'Hostel to Computer Science Block via SAC Boulevard',
  },
  {
    id: 's4',
    name: 'Auditorium → Medical',
    fromId: 'auditorium',
    toId: 'medical_center',
    description: 'Auditorium to Medical Center via East Ring Walkway',
  },
];

export default DEMO_ROUTES;
