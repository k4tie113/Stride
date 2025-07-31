import { TrainingPlan, WeeklySchedule } from '../api/client';

export const intermediateHalfPlan: TrainingPlan = {
  id: 'plan-002',
  name: 'Intermediate Maintenance',
  description: 'A 4-week training plan designed for intermediate runners when not actively training for a race. May repeat.',
  level: 'Intermediate',
  weeks: 4,
  runsPerWeek: 4,
};

export const intermediateHalfSchedule: WeeklySchedule[] = [
  // Week 1
  { id: 'i1d1', planId: 'plan-002', week: 1, day: 1, runType: 'Rest', distance: 0, isRest: true, description: 'Take a full rest day or opt for light cross-training like yoga or stretching.' },
  { id: 'i1d2', planId: 'plan-002', week: 1, day: 2, runType: 'Easy Run', distance: 4, isRest: false, description: 'Run 4 miles at a relaxed, conversational pace.' },
  { id: 'i1d3', planId: 'plan-002', week: 1, day: 3, runType: 'Tempo Run', distance: 5, isRest: false, description: '1 mile easy, 3 miles at tempo pace, 1 mile easy.' },
  { id: 'i1d4', planId: 'plan-002', week: 1, day: 4, runType: 'Rest', distance: 0, isRest: true, description: 'Light cross-training or complete rest.' },
  { id: 'i1d5', planId: 'plan-002', week: 1, day: 5, runType: 'Easy Run', distance: 4, isRest: false, description: 'Run 4 miles with warmup and cooldown.' },
  { id: 'i1d6', planId: 'plan-002', week: 1, day: 6, runType: 'Rest', distance: 0, isRest: true, description: 'Optional rest or light activity like walking or swimming.' },
  { id: 'i1d7', planId: 'plan-002', week: 1, day: 7, runType: 'Long Run', distance: 8, isRest: false, description: 'Run 6-8 miles at a steady pace. Focus on endurance.' },

  // Week 2
  { id: 'i2d1', planId: 'plan-002', week: 2, day: 1, runType: 'Rest', distance: 0, isRest: true, description: 'Take a rest or do some gentle stretching.' },
  { id: 'i2d2', planId: 'plan-002', week: 2, day: 2, runType: 'Easy Run', distance: 4, isRest: false, description: '4-mile easy-paced run. Stay relaxed.' },
  { id: 'i2d3', planId: 'plan-002', week: 2, day: 3, runType: 'Tempo Run', distance: 6, isRest: false, description: '1 mile easy, 4 miles at tempo pace, 1 mile easy.' },
  { id: 'i2d4', planId: 'plan-002', week: 2, day: 4, runType: 'Rest', distance: 0, isRest: true, description: 'Cross-training or full rest today.' },
  { id: 'i2d5', planId: 'plan-002', week: 2, day: 5, runType: 'Easy Run', distance: 5, isRest: false, description: 'Run 5 miles. Keep it easy and steady.' },
  { id: 'i2d6', planId: 'plan-002', week: 2, day: 6, runType: 'Rest', distance: 0, isRest: true, description: 'Another rest day or a light walk.' },
  { id: 'i2d7', planId: 'plan-002', week: 2, day: 7, runType: 'Long Run', distance: 8, isRest: false, description: '6-8 long run. Focus on pacing.' },

  // Week 3
  { id: 'i3d1', planId: 'plan-002', week: 3, day: 1, runType: 'Rest', distance: 0, isRest: true, description: 'Start the week with recovery.' },
  { id: 'i3d2', planId: 'plan-002', week: 3, day: 2, runType: 'Easy Run', distance: 5, isRest: false, description: '5-mile run at an easy pace.' },
  { id: 'i3d3', planId: 'plan-002', week: 3, day: 3, runType: 'Tempo Run', distance: 6, isRest: false, description: '1 mile easy, 4 miles tempo, 1 mile easy.' },
  { id: 'i3d4', planId: 'plan-002', week: 3, day: 4, runType: 'Rest', distance: 0, isRest: true, description: 'Rest or light cross-training.' },
  { id: 'i3d5', planId: 'plan-002', week: 3, day: 5, runType: 'Easy Run', distance: 4, isRest: false, description: 'Run 4 miles. Keep it relaxed.' },
  { id: 'i3d6', planId: 'plan-002', week: 3, day: 6, runType: 'Rest', distance: 0, isRest: true, description: 'Optional rest or light movement.' },
  { id: 'i3d7', planId: 'plan-002', week: 3, day: 7, runType: 'Long Run', distance: 8, isRest: false, description: '6-8 mile long run. Stay steady and hydrated.' },

  // Week 4
  { id: 'i4d1', planId: 'plan-002', week: 4, day: 1, runType: 'Rest', distance: 0, isRest: true, description: 'Rest day. Recover well.' },
  { id: 'i4d2', planId: 'plan-002', week: 4, day: 2, runType: 'Easy Run', distance: 3, isRest: false, description: 'Short 3-mile run at a comfortable pace.' },
  { id: 'i4d3', planId: 'plan-002', week: 4, day: 3, runType: 'Tempo Run', distance: 5, isRest: false, description: '1 mile easy, 3 miles tempo, 1 mile easy.' },
  { id: 'i4d4', planId: 'plan-002', week: 4, day: 4, runType: 'Rest', distance: 0, isRest: true, description: 'Final recovery day or cross-train lightly.' },
  { id: 'i4d5', planId: 'plan-002', week: 4, day: 5, runType: 'Easy Run', distance: 3, isRest: false, description: '3 miles. Light jog and loosen up.' },
  { id: 'i4d6', planId: 'plan-002', week: 4, day: 6, runType: 'Rest', distance: 0, isRest: true, description: 'Optional walk or rest day.' },
  { id: 'i4d7', planId: 'plan-002', week: 4, day: 7, runType: 'Long Run', distance: 8, isRest: false, description: '6-8 mile long run! Last day of training plan.' },
];
