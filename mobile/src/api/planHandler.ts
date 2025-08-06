// src/api/client.ts
import { supabase } from '../supabase/client';
import { beginner5KPlan, beginner5KSchedule } from '../data/beginner5k';
import { intermediateHalfPlan, intermediateHalfSchedule } from '../data/interm';

// ---- TYPES ----
export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  level: string;
  weeks: number;
  runsPerWeek: number;
  currentWeek?: number;
  progress?: number;
}

export interface WeeklySchedule {
  id: string;
  planId: string;
  week: number;
  day: number;
  runType: string;
  distance: number;
  description: string | null;
  isRest: boolean;
  completed?: boolean;
  dayName?: string;
  isToday?: boolean;
}

export interface UserStats {
  weeklyMiles: number;
  totalRuns: number;
}

// ---- API METHODS ----

const getTrainingPlans = async (): Promise<TrainingPlan[]> => {
  // Use local data for static plans
  return [beginner5KPlan, intermediateHalfPlan];
};

const getCurrentPlan = async (userId: string): Promise<TrainingPlan | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('current_plan_id, plan_start_date')
      .eq('id', userId)
      .single();

    if (error || !profile || !profile.current_plan_id) {
      return null;
    }

    const allPlans = await getTrainingPlans();
    const currentPlan = allPlans.find(p => p.id === profile.current_plan_id);

    if (currentPlan && profile.plan_start_date) {
      const planStartDate = new Date(profile.plan_start_date);
      const now = new Date();
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      const weeksPassed = Math.floor((now.getTime() - planStartDate.getTime()) / oneWeekInMs);

      const progress = (weeksPassed / currentPlan.weeks) * 100;

      return {
        ...currentPlan,
        currentWeek: weeksPassed + 1,
        progress: Math.min(progress, 100),
      };
    }

    return null;
  } catch (e) {
    console.error('Failed to get current plan:', e);
    return null;
  }
};

const updateCurrentPlan = async (userId: string, planId: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        current_plan_id: planId,
        plan_start_date: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Supabase update failed:', error);
      throw error;
    }
  } catch (e) {
    console.error('Failed to update plan:', e);
    throw e;
  }
};

const getWeeklySchedule = async (userId: string, week: number): Promise<WeeklySchedule[]> => {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('current_plan_id')
      .eq('id', userId)
      .single();

    if (error || !profile || !profile.current_plan_id) {
      return [];
    }

    const scheduleMap: { [key: string]: WeeklySchedule[] } = {
      'plan-001': beginner5KSchedule,
      'plan-002': intermediateHalfSchedule,
    };

    const schedule = scheduleMap[profile.current_plan_id] || [];
    return schedule.filter(day => day.week === week);

  } catch (e) {
    console.error('Failed to get weekly schedule:', e);
    return [];
  }
};


const apiClient = {
  getTrainingPlans,
  getCurrentPlan,
  updateCurrentPlan,
  getWeeklySchedule,
};

export default apiClient;