import { TrainingPlan, WeeklySchedule } from '../api/planHandler';

export const beginner5KPlan: TrainingPlan = {
  id: 'plan-001',
  name: 'Beginner 5K Plan',
  description: 'An 8-week program to get you to your first 5K with walk-jog intervals.',
  level: 'Beginner',
  weeks: 8,
  runsPerWeek: 3,
};

export const beginner5KSchedule: WeeklySchedule[] = [
  {
    id: 'w1d1', planId: 'plan-001', week: 1, day: 1, runType: 'Walk/Jog',
    distance: 1, isRest: false,
    description: 'Alternate jogging (60 seconds) and walking (90 seconds).'
  },
  {
    id: 'w1d2', planId: 'plan-001', week: 1, day: 2, runType: 'Walk',
    distance: 0.5, isRest: false,
    description: 'Brisk walk 20 mins.'
  },
  { id: 'w1d3', planId: 'plan-001', week: 1, day: 3, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w1d4', planId: 'plan-001', week: 1, day: 4, runType: 'Walk/Jog',
    distance: 1, isRest: false,
    description: 'Alternate jogging (60 seconds) and walking (90 seconds).'
  },
  { id: 'w1d5', planId: 'plan-001', week: 1, day: 5, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w1d6', planId: 'plan-001', week: 1, day: 6, runType: 'Walk/Jog',
    distance: 1, isRest: false,
    description: 'Alternate jogging (60 seconds) and walking (90 seconds).'
  },
  { id: 'w1d7', planId: 'plan-001', week: 1, day: 7, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },

  // Week 2
  {
    id: 'w2d1', planId: 'plan-001', week: 2, day: 1, runType: 'Walk/Jog',
    distance: 1.5, isRest: false,
    description: 'Alternate jogging (90 seconds) and walking (60 seconds).'
  },
  {
    id: 'w2d2', planId: 'plan-001', week: 2, day: 2, runType: 'Walk',
    distance: 0.5, isRest: false,
    description: 'Brisk walk 20 mins.'
  },
  { id: 'w2d3', planId: 'plan-001', week: 2, day: 3, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w2d4', planId: 'plan-001', week: 2, day: 4, runType: 'Walk/Jog',
    distance: 1.5, isRest: false,
    description: 'Alternate jogging (90 seconds) and walking (60 seconds).'
  },
  { id: 'w2d5', planId: 'plan-001', week: 2, day: 5, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w2d6', planId: 'plan-001', week: 2, day: 6, runType: 'Walk/Jog',
    distance: 1.5, isRest: false,
    description: 'Alternate jogging (90 seconds) and walking (60 seconds).'
  },
  { id: 'w2d7', planId: 'plan-001', week: 2, day: 7, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },

  // Week 3
  {
    id: 'w3d1', planId: 'plan-001', week: 3, day: 1, runType: 'Walk/Jog',
    distance: 1.5, isRest: false,
    description: 'Alternate jogging (120 seconds) and walking (60 seconds).'
  },
  {
    id: 'w3d2', planId: 'plan-001', week: 3, day: 2, runType: 'Walk',
    distance: 0.5, isRest: false,
    description: 'Brisk walk 20 mins.'
  },
  { id: 'w3d3', planId: 'plan-001', week: 3, day: 3, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w3d4', planId: 'plan-001', week: 3, day: 4, runType: 'Walk/Jog',
    distance: 1.5, isRest: false,
    description: 'Alternate jogging (120 seconds) and walking (60 seconds).'
  },
  { id: 'w3d5', planId: 'plan-001', week: 3, day: 5, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w3d6', planId: 'plan-001', week: 3, day: 6, runType: 'Walk/Jog',
    distance: 1.5, isRest: false,
    description: 'Alternate jogging (120 seconds) and walking (60 seconds).'
  },
  { id: 'w3d7', planId: 'plan-001', week: 3, day: 7, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },

  // Week 4
  {
    id: 'w4d1', planId: 'plan-001', week: 4, day: 1, runType: 'Walk/Jog',
    distance: 1.5, isRest: false,
    description: 'Alternate jogging (3 minutes) and walking (1 minute).'
  },
  {
    id: 'w4d2', planId: 'plan-001', week: 4, day: 2, runType: 'Walk',
    distance: 0.5, isRest: false,
    description: 'Brisk walk 20 mins.'
  },
  { id: 'w4d3', planId: 'plan-001', week: 4, day: 3, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w4d4', planId: 'plan-001', week: 4, day: 4, runType: 'Walk/Jog',
    distance: 1.5, isRest: false,
    description: 'Alternate jogging (3 minutes) and walking (1 minute).'
  },
  { id: 'w4d5', planId: 'plan-001', week: 4, day: 5, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w4d6', planId: 'plan-001', week: 4, day: 6, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (3 minutes) and walking (1 minute).'
  },
  { id: 'w4d7', planId: 'plan-001', week: 4, day: 7, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },

  // Week 5
  {
    id: 'w5d1', planId: 'plan-001', week: 5, day: 1, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (5 minutes) and walking (3 minutes).'
  },
  {
    id: 'w5d2', planId: 'plan-001', week: 5, day: 2, runType: 'Walk',
    distance: 0.5, isRest: false,
    description: 'Brisk walk 20 mins.'
  },
  { id: 'w5d3', planId: 'plan-001', week: 5, day: 3, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w5d4', planId: 'plan-001', week: 5, day: 4, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (5 minutes) and walking (3 minutes).'
  },
  { id: 'w5d5', planId: 'plan-001', week: 5, day: 5, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w5d6', planId: 'plan-001', week: 5, day: 6, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (5 minutes) and walking (3 minutes).'
  },
  { id: 'w5d7', planId: 'plan-001', week: 5, day: 7, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  // Week 5
  {
    id: 'w6d1', planId: 'plan-001', week: 6, day: 1, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (5 minutes) and walking (3 minutes).'
  },
  {
    id: 'w6d2', planId: 'plan-001', week: 6, day: 2, runType: 'Walk',
    distance: 2, isRest: false,
    description: 'Brisk walk 30 mins.'
  },
  { id: 'w6d3', planId: 'plan-001', week: 6, day: 3, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w6d4', planId: 'plan-001', week: 6, day: 4, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (5 minutes) and walking (3 minutes).'
  },
  { id: 'w6d5', planId: 'plan-001', week: 6, day: 5, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w6d6', planId: 'plan-001', week: 6, day: 6, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (5 minutes) and walking (3 minutes).'
  },
  { id: 'w6d7', planId: 'plan-001', week: 6, day: 7, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  // Week 5
  {
    id: 'w7d1', planId: 'plan-001', week: 7, day: 1, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (3 minutes) and walking (1 minute).'
  },
  {
    id: 'w7d2', planId: 'plan-001', week: 7, day: 2, runType: 'Walk',
    distance: 1, isRest: false,
    description: 'Brisk walk 30 mins.'
  },
  { id: 'w7d3', planId: 'plan-001', week: 7, day: 3, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w7d4', planId: 'plan-001', week: 7, day: 4, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (4 minutes) and walking (1 minute).'
  },
  { id: 'w7d5', planId: 'plan-001', week: 7, day: 5, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w7d6', planId: 'plan-001', week: 7, day: 6, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (4 minutes) and walking (1 minute).'
  },
  { id: 'w7d7', planId: 'plan-001', week: 7, day: 7, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  // Week 5
  {
    id: 'w8d1', planId: 'plan-001', week: 8, day: 1, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Alternate jogging (5 minutes) and walking (1 minute).'
  },
  {
    id: 'w8d2', planId: 'plan-001', week: 8, day: 2, runType: 'Walk',
    distance: 1, isRest: false,
    description: 'Brisk walk 30 mins.'
  },
  { id: 'w8d3', planId: 'plan-001', week: 8, day: 3, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w8d4', planId: 'plan-001', week: 8, day: 4, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Jog for 10 minutes, then walk for 2 minutes. Repeat.'
  },
  { id: 'w8d5', planId: 'plan-001', week: 8, day: 5, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
  {
    id: 'w8d6', planId: 'plan-001', week: 8, day: 6, runType: 'Walk/Jog',
    distance: 2, isRest: false,
    description: 'Jog for 10 minutes, then walk for 2 minutes. Repeat.'
  },
  { id: 'w8d7', planId: 'plan-001', week: 8, day: 7, runType: 'Rest', distance: 0, isRest: true, description: 'Rest' },
];