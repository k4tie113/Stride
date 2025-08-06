// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components/GradientBackground';
import { StatCard } from '../components/StatCard';
import { colors } from '../theme';

import { RunTrackingModal } from '../components/RunTrackingModal';
import LogoutButton from '../components/LogoutButton';
import { useUser, Profile } from '../state/UserContext';
import { supabase } from '../supabase/client';
import { useFocusEffect } from '@react-navigation/native';

// ✅ Import the types and the apiClient from the central file
import apiClient, {
  TrainingPlan,
  WeeklySchedule,
} from '../api/planHandler';

interface Run {
  id: string;
  user_id: string;
  distance: number;
  duration: number;
  run_type: string;
  date: string;
  pace: number;
}


export default function HomeScreen() {
  const [showRunModal, setShowRunModal] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  const [stats, setStats] = useState({ totalDistance: 0, averagePace: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const { user, profile } = useUser();
  
  // ✅ loadData is now wrapped in useCallback so it doesn't change on every render
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      // ✅ Fetch runs and calculate stats
      const { data: runsData, error: runsError } = await supabase
        .from('runs')
        .select('*')
        .eq('user_id', user.id);

      if (runsError) {
        console.error('Error fetching runs:', runsError.message);
        throw runsError;
      }
      const sortedRuns = (runsData || []).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      setRuns(sortedRuns || []);
      console.log('Runs fetched and sorted successfully:', sortedRuns.length, 'runs');
      const totalDistance = (runsData || []).reduce((sum, run) => sum + run.distance, 0);
      const averagePace = (runsData || []).length > 0
        ? (runsData || []).reduce((sum, run) => sum + run.pace, 0) / (runsData || []).length
        : 0;
      setStats({ totalDistance, averagePace });

      // ✅ Fetch the current plan and its weekly schedule
      const plan = await apiClient.getCurrentPlan(user.id);
      setCurrentPlan(plan);

      if (plan && plan.currentWeek) {
        const schedule = await apiClient.getWeeklySchedule(user.id, plan.currentWeek);
        setWeeklySchedule(schedule);
      } else {
        setWeeklySchedule([]);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]); // Only re-create loadData if the user object changes

  // ✅ Consolidated all the logic into one useFocusEffect
  useFocusEffect(
    useCallback(() => {
      // Set the greeting when the screen comes into focus
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Good morning');
      } else if (hour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }

      // Call loadData to fetch runs and plan data
      loadData();
      
      // We can also keep this debugging code inside if you still need it
      // fetchAndLogAllUsers();

      return () => {
        // Optional cleanup function
      };
    }, [loadData]) // Re-run this effect only when loadData changes
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <LogoutButton />
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={colors.white} />
          </View>
          <Text style={styles.appTitle}>Welcome</Text>
          {profile && <Text style={styles.greeting}>{greeting}, {profile.name || 'Runner'}</Text>}
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Distance"
              value={stats.totalDistance.toFixed(1)}
              unit="miles"
              icon="trophy"
            />
            <StatCard
              title="Average Pace"
              value={runs.length > 0 ? formatPace(stats.averagePace) : '0:00'}
              unit="per mile"
              icon="trending-up"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setShowRunModal(true)}
          activeOpacity={0.95}
        >
          <View style={styles.mainButtonContent}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={24} color={colors.white} />
            </View>
            <View style={styles.mainButtonText}>
              <Text style={styles.mainButtonTitle}>Start New Run</Text>
              <Text style={styles.mainButtonSubtitle}>Log your distance & time</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.trainingContainer}>
          <Text style={styles.sectionTitle}>Training Progress</Text>
        </View>

        {currentPlan ? (
          <View style={styles.trainingSection}>
            <View style={styles.planCard}>
              <Text style={styles.planName}>{currentPlan.name}</Text>
              <Text style={styles.planWeek}>
                Week {currentPlan.currentWeek} of {currentPlan.weeks}
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>Overall Progress</Text>
                  <Text style={styles.progressPercent}>
                    {Math.round(currentPlan.progress || 0)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${currentPlan.progress || 0}%` },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.planStats}>
                <View style={styles.planStat}>
                  <Text style={styles.planStatLabel}>Completed</Text>
                  <Text style={styles.planStatValue}>
                    {/* These will be 0 until you implement run logging logic */}
                    0
                  </Text>
                </View>
                <View style={styles.planStat}>
                  <Text style={styles.planStatLabel}>This Week's Runs</Text>
                  <Text style={styles.planStatValue}>
                    {/* These will be 0 until you implement run logging logic */}
                    {currentPlan.runsPerWeek || 0}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.scheduleButton, showSchedule ? styles.hideButton : null]}
                onPress={() => setShowSchedule(!showSchedule)}
              >
                <Text style={styles.scheduleButtonText}>
                  {showSchedule
                    ? 'Hide Week ' + currentPlan.currentWeek + ' Schedule'
                    : 'View Week ' + currentPlan.currentWeek + ' Schedule'}
                </Text>
              </TouchableOpacity>
              {showSchedule && weeklySchedule.map((day) => (
                <View key={day.id} style={styles.scheduleItem}>
                  <View style={styles.scheduleHeader}>
                    <Text style={styles.scheduleDay}>
                      Day {day.day}: {day.runType} {day.isToday ? '(Today)' : ''}
                    </Text>
                    {day.completed && !day.isToday && (
                      <Ionicons name="checkmark-circle" size={20} color="white" />
                    )}
                  </View>
                  <Text style={styles.scheduleDesc}>{day.description}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.trainingSection}>
            <View style={styles.planCard}>
              <Text style={styles.progressText}>You don’t currently have a plan. Select one in the "training" page!</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <RunTrackingModal
        visible={showRunModal}
        onClose={() => setShowRunModal(false)}
        onSuccess={loadData}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.purple,
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  appTitle: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  greeting: {
    color: colors.whiteTransparent80,
    fontSize: 18,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    backgroundColor: colors.whiteTransparent20,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  mainButton: {
    marginHorizontal: 24,
    backgroundColor: colors.yellow,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  mainButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.purple,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: {
    alignItems: 'flex-start',
  },
  mainButtonTitle: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainButtonSubtitle: {
    color: colors.purple,
    opacity: 0.7,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  trainingSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
  },
  planName: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planWeek: {
    color: colors.whiteTransparent70,
    fontSize: 14,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    color: colors.whiteTransparent80,
    fontSize: 14,
  },
  progressPercent: {
    color: colors.whiteTransparent80,
    fontSize: 14,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: colors.whiteTransparent20,
    borderRadius: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.yellow,
    borderRadius: 6,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  planStat: {
    alignItems: 'center',
  },
  planStatLabel: {
    color: colors.whiteTransparent60,
    fontSize: 12,
  },
  planStatValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  trainingContainer: {
    paddingHorizontal: 24,
  },
  scheduleButton: {
    backgroundColor: colors.yellow,
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontWeight: 'bold',
    color: colors.purple,
  },
  scheduleItem: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#ffffff22',
    borderRadius: 10,
  },
  scheduleDay: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.white,
  },
  scheduleDesc: {
    fontSize: 14,
    color: colors.white,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});