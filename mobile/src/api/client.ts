// src/api/client.ts (Mock Version)
import { beginner5KPlan, beginner5KSchedule } from '../data/beginner5k'
import { intermediateHalfPlan, intermediateHalfSchedule } from '../data/interm';

// ---- TYPES ----

export interface User {
    id: string;
    username: string;
    firstname: string;
    currentPlanId: string | null;
    currentWeek: number | null;
    planStartDate?: string;
  }
  
  export interface Run {
    id: string;
    userId: string;
    distance: number;
    duration: number;
    runType: string;
    date: string;
    pace: number | null;
    paceFormatted?: string;
    durationFormatted?: string;
    dateFormatted?: string;
  }
  
  export interface TrainingPlan {
    id: string;
    name: string;
    description: string;
    level: string;
    weeks: number;
    runsPerWeek: number;
    currentWeek?: number;
    progress?: number;
    weeklyCompleted?: number;
    weeklyTarget?: number;
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
  }
  
  export interface UserStats {
    weeklyMiles: string;
    totalRuns: number;
    user: User;
  }
  
  // ---- MOCK DATA ----
  
  const mockUser: User = {
    id: 'user-123',
    username: 'runner_katie',
    firstname: 'Katie',
    currentPlanId: 'plan-002',
    currentWeek: 2,
    planStartDate: '2025-07-15',
  };
  
  const mockStats: UserStats = {
    weeklyMiles: '12.5',
    totalRuns: 8,
    user: mockUser,
  };
  
  const mockRuns: Run[] = [
    {
      id: 'run-1',
      userId: 'user-123',
      distance: 3.2,
      duration: 1620,
      runType: 'Easy Run',
      date: '2025-07-23',
      pace: 480,
    },
    {
      id: 'run-2',
      userId: 'user-123',
      distance: 4.8,
      duration: 2100,
      runType: 'Tempo',
      date: '2025-07-25',
      pace: 470,
    },
    {
      id: 'run-3',
      userId: 'user-123',
      distance: 5,
      duration: 2100,
      runType: 'Tempo',
      date: '2025-07-25',
      pace: 460,
    },
    {
      id: 'run-4',
      userId: 'user-123',
      distance: 6,
      duration: 2100,
      runType: 'Tempo',
      date: '2025-07-25',
      pace: 467,
    },
    {
      id: 'run-5',
      userId: 'user-123',
      distance: 4.8,
      duration: 2100,
      runType: 'Tempo',
      date: '2025-07-26',
      pace: 455,
    },
    {
      id: 'run-6',
      userId: 'user-123',
      distance: 3,
      duration: 2100,
      runType: 'Tempo',
      date: '2025-07-27',
      pace: 453,
    },
    {
      id: 'run-7',
      userId: 'user-123',
      distance: 3,
      duration: 2100,
      runType: 'Tempo',
      date: '2025-07-29',
      pace: 440,
    },
  ];
  
  const mockPlan = beginner5KPlan;
  const mockSchedule = beginner5KSchedule;


  const mockPlans: TrainingPlan[] = [mockPlan, intermediateHalfPlan];
  

  class MockApiClient {
    async getUserStats(): Promise<UserStats> {
      return mockStats;
    }
  
    async getRecentRuns(): Promise<Run[]> {
      return mockRuns.slice(0, 1);
    }
  
    async getAllRuns(): Promise<Run[]> {
      return mockRuns;
    }
  
    async createRun(run: Omit<Run, 'id' | 'userId' | 'pace'>): Promise<Run> {
      const newRun: Run = {
        ...run,
        id: `run-${mockRuns.length + 1}`,
        userId: mockUser.id,
        pace: run.duration / run.distance,
      };
      mockRuns.push(newRun);
      return newRun;
    }
  
    async addRun(run: Run): Promise<void> {
      mockRuns.unshift(run); // prepend to list
    }
  
   
    async updateCurrentPlan(planId: string): Promise<User> {
      mockUser.currentPlanId = planId;
      return mockUser;
    }

    async getTrainingPlans(): Promise<TrainingPlan[]> {
      return [beginner5KPlan, intermediateHalfPlan];
    }
    
    async getCurrentPlan(): Promise<TrainingPlan> {
      const today = new Date();
      const startDate = mockUser.planStartDate ? new Date(mockUser.planStartDate) : today;
      const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const currentPlan = mockPlans.find(p => p.id === mockUser.currentPlanId) || beginner5KPlan;
      const currentWeek = Math.min(Math.floor(daysElapsed / 7) + 1, currentPlan.weeks);
      const totalDays = Math.min(daysElapsed + 1, currentPlan.weeks * 7);

      const scheduleMap: { [key: string]: WeeklySchedule[] } = {
          'plan-001': beginner5KSchedule,
          'plan-002': intermediateHalfSchedule,
      };
      const schedule = scheduleMap[currentPlan.id] || [];
      const completedRuns = schedule.filter(day => !day.isRest && ((day.week - 1) * 7 + day.day <= totalDays)).length;

      return {
          ...currentPlan,
          currentWeek,
          progress: Math.round((currentWeek / currentPlan.weeks) * 100),
          weeklyCompleted: schedule.filter(d => d.week === currentWeek && !d.isRest && ((d.week - 1) * 7 + d.day <= totalDays)).length,
          weeklyTarget: currentPlan.runsPerWeek,
      };
  }

    
    
  async getWeeklySchedule(week: number): Promise<WeeklySchedule[]> {
    const scheduleMap: { [key: string]: WeeklySchedule[] } = {
        'plan-001': beginner5KSchedule,
        'plan-002': intermediateHalfSchedule,
    };

    const schedule = scheduleMap[mockUser.currentPlanId || 'plan-001'] || [];

    const today = new Date();
    const startDate = mockUser.planStartDate ? new Date(mockUser.planStartDate) : today;
    const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return schedule
        .filter(day => day.week === week)
        .map(day => {
            const absoluteDay = (day.week - 1) * 7 + day.day - 1;
            return {
                ...day,
                completed: absoluteDay <= daysElapsed,
                isToday: absoluteDay === daysElapsed,
            };
        });
  }
    
    
}
  
  
const apiClient = new MockApiClient();
export default apiClient;
