// src/api/client.ts (Mock Version)
import { beginner5KPlan, beginner5KSchedule } from '../data/beginner5k';
import { intermediateHalfPlan, intermediateHalfSchedule } from '../data/interm';

// ---- TYPES ----

export interface User {
  id: string;
  username: string;
  password: string;
  firstname: string;
  token: string; // ✅ Add a token to the User interface
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
  isToday?: boolean;
}

export interface UserStats {
  weeklyMiles: string;
  totalRuns: number;
  user: User;
}

// ---- MOCK DATA ----

const mockUsers: User[] = [
  {
    id: 'user-123',
    username: 'runner_katie',
    password: 'pass123',
    firstname: 'Katie',
    token: 'mock-token-123', // ✅ Add a mock token
    currentPlanId: 'plan-002',
    currentWeek: 2,
    planStartDate: '2025-07-15',
  },
];

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

const mockPlans: TrainingPlan[] = [beginner5KPlan, intermediateHalfPlan];

class MockApiClient {
  private loggedInUser: User | null = null;
  private currentToken: string | null = null; // ✅ New property

  async login(username: string, password: string): Promise<User | null> {
    console.log('client.ts: login called with:', { username, password });
    const found = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    console.log('client.ts: Result of search:', found ? found.username : 'No user found');
    if (found) {
      this.loggedInUser = found;
      this.currentToken = found.token; // ✅ Set the token on login
      return found;
    }
    return null;
  }

  // ✅ New method to set the token from storage
  setToken(token: string | null) {
    this.currentToken = token;
    // In a real app, you might validate the token with the server.
    // For this mock, we'll find the user based on the token.
    this.loggedInUser = mockUsers.find(u => u.token === token) || null;
  }

  getCurrentUser(): User | null {
    return this.loggedInUser;
  }

  async getUserStats(): Promise<UserStats> {
    if (!this.loggedInUser) throw new Error('Not logged in');
    return {
      weeklyMiles: '12.5',
      totalRuns: 8,
      user: this.loggedInUser,
    };
  }

  async getAllRuns(): Promise<Run[]> {
    if (!this.loggedInUser) throw new Error('Not logged in');
    return mockRuns.filter((run) => run.userId === this.loggedInUser?.id);
  }

  async createRun(run: Omit<Run, 'id' | 'userId' | 'pace'>): Promise<Run> {
    if (!this.loggedInUser) throw new Error('Not logged in');
    const newRun: Run = {
      ...run,
      id: `run-${mockRuns.length + 1}`,
      userId: this.loggedInUser.id,
      pace: run.duration / run.distance,
    };
    mockRuns.push(newRun);
    return newRun;
  }

  async updateCurrentPlan(planId: string): Promise<User> {
    if (!this.loggedInUser) throw new Error('Not logged in');
    this.loggedInUser.currentPlanId = planId;
    return this.loggedInUser;
  }

  async getTrainingPlans(): Promise<TrainingPlan[]> {
    return mockPlans;
  }

  async getCurrentPlan(): Promise<TrainingPlan> {
    if (!this.loggedInUser) throw new Error('Not logged in');
    const today = new Date();
    const startDate = this.loggedInUser.planStartDate
      ? new Date(this.loggedInUser.planStartDate)
      : today;
    const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const currentPlan = mockPlans.find(p => p.id === this.loggedInUser!.currentPlanId) || beginner5KPlan;
    const currentWeek = Math.min(Math.floor(daysElapsed / 7) + 1, currentPlan.weeks);
    const totalDays = Math.min(daysElapsed + 1, currentPlan.weeks * 7);

    const scheduleMap: { [key: string]: WeeklySchedule[] } = {
      'plan-001': beginner5KSchedule,
      'plan-002': intermediateHalfSchedule,
    };
    const schedule = scheduleMap[currentPlan.id] || [];

    return {
      ...currentPlan,
      currentWeek,
      progress: Math.round((currentWeek / currentPlan.weeks) * 100),
      weeklyCompleted: schedule.filter(d => d.week === currentWeek && !d.isRest && ((d.week - 1) * 7 + d.day <= totalDays)).length,
      weeklyTarget: currentPlan.runsPerWeek,
    };
  }

  async getWeeklySchedule(week: number): Promise<WeeklySchedule[]> {
    if (!this.loggedInUser) throw new Error('Not logged in');
    const scheduleMap: { [key: string]: WeeklySchedule[] } = {
      'plan-001': beginner5KSchedule,
      'plan-002': intermediateHalfSchedule,
    };
    const schedule = scheduleMap[this.loggedInUser.currentPlanId || 'plan-001'] || [];

    const today = new Date();
    const startDate = this.loggedInUser.planStartDate
      ? new Date(this.loggedInUser.planStartDate)
      : today;
    const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return schedule
      .filter(day => day.week === week)
      .map(day => {
        const absoluteDay = (day.week - 1) * 7 + day.day - 1;
        return {
          ...day,
          completed: absoluteDay < daysElapsed,
          isToday: absoluteDay === daysElapsed,
        };
      });
  }
}

const apiClient = new MockApiClient();
export default apiClient;