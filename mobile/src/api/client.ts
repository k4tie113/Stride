// src/api/client.ts (Mock Version)

// ---- TYPES ----

export interface User {
    id: string;
    username: string;
    firstname: string;
    currentPlanId: string | null;
    currentWeek: number | null;
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
    currentPlanId: 'plan-001',
    currentWeek: 2,
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
  
  const mockPlan: TrainingPlan = {
    id: 'plan-001',
    name: '5K Beginner Plan',
    description: 'A 6-week program to get you to your first 5K.',
    level: 'Beginner',
    weeks: 6,
    runsPerWeek: 3,
    currentWeek: 2,
    progress: 28,
    weeklyCompleted: 2,
    weeklyTarget: 3,
  };

  const dummy10KPlan: TrainingPlan = {
    id: 'plan-002',
    name: '10K Intermediate Plan',
    description: 'Train for your first 10K with this intermediate plan.',
    level: 'intermediate',
    weeks: 8,
    runsPerWeek: 4,
  };

  const mockPlans: TrainingPlan[] = [mockPlan, dummy10KPlan];
  
  const mockSchedule: WeeklySchedule[] = [
    {
      id: 'day-1',
      planId: 'plan-001',
      week: 2,
      day: 1,
      runType: 'Easy Run',
      distance: 3,
      description: 'Run at a conversational pace.',
      isRest: false,
    },
    {
      id: 'day-2',
      planId: 'plan-001',
      week: 2,
      day: 2,
      runType: 'Rest Day',
      distance: 0,
      description: 'Take a rest day.',
      isRest: true,
    },
  ];

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
  
    async getTrainingPlans(): Promise<TrainingPlan[]> {
      return mockPlans;
    }
  
    async getCurrentPlan(): Promise<TrainingPlan> {
      return mockPlan;
    }
  
    async updateCurrentPlan(planId: string): Promise<User> {
      mockUser.currentPlanId = planId;
      return mockUser;
    }
  
    async getWeeklySchedule(week: number): Promise<WeeklySchedule[]> {
      return mockSchedule.filter(day => day.week === week);
    }
  }
  
  
const apiClient = new MockApiClient();
export default apiClient;
