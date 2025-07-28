import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components/GradientBackground';
import { StatCard } from '../components/StatCard';
import { colors } from '../theme';
import { apiClient, UserStats, Run, TrainingPlan } from '../api/client';

export default function ProfileScreen() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, currentPlanData, runsData] = await Promise.all([
        apiClient.getUserStats(),
        apiClient.getCurrentPlan(),
        apiClient.getAllRuns(),
      ]);

      setStats(statsData);
      setCurrentPlan(currentPlanData);
      setRuns(runsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Calculate additional stats
  const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
  const averagePace = runs.length > 0 
    ? runs.reduce((sum, run) => sum + (run.pace || 0), 0) / runs.length 
    : 0;

  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={colors.white} />
          </View>
          <Text style={styles.title}>Runner Profile</Text>
          <Text style={styles.subtitle}>Your running journey</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Distance"
              value={totalDistance.toFixed(1)}
              unit="miles"
              icon="trending-up"
            />
            <StatCard
              title="Average Pace"
              value={runs.length > 0 ? formatPace(averagePace) : '0:00'}
              unit="per mile"
              icon="trending-up"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="This Week"
              value={stats?.weeklyMiles || '0.0'}
              unit="miles"
              icon="calendar"
            />
            <StatCard
              title="Total Runs"
              value={stats?.totalRuns.toString() || '0'}
              unit="completed"
              icon="trophy"
            />
          </View>
        </View>

        {/* Current Plan Status */}
        {currentPlan && (
          <View style={styles.trainingSection}>
            <Text style={styles.sectionTitle}>Training Progress</Text>
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
                    {currentPlan.weeklyCompleted || 0}
                  </Text>
                </View>
                <View style={styles.planStat}>
                  <Text style={styles.planStatLabel}>This Week</Text>
                  <Text style={styles.planStatValue}>
                    {currentPlan.weeklyTarget || 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {runs.length >= 1 && (
              <View style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Ionicons name="trophy" size={24} color={colors.purple} />
                </View>
                <View style={styles.achievementText}>
                  <Text style={styles.achievementTitle}>First Run</Text>
                  <Text style={styles.achievementDescription}>
                    Completed your first tracked run
                  </Text>
                </View>
              </View>
            )}

            {runs.length >= 5 && (
              <View style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Ionicons name="trending-up" size={24} color={colors.purple} />
                </View>
                <View style={styles.achievementText}>
                  <Text style={styles.achievementTitle}>5 Run Streak</Text>
                  <Text style={styles.achievementDescription}>Completed 5 runs</Text>
                </View>
              </View>
            )}

            {totalDistance >= 10 && (
              <View style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Ionicons name="trophy" size={24} color={colors.purple} />
                </View>
                <View style={styles.achievementText}>
                  <Text style={styles.achievementTitle}>10 Mile Club</Text>
                  <Text style={styles.achievementDescription}>
                    Reached 10 total miles
                  </Text>
                </View>
              </View>
            )}

            {runs.length === 0 && (
              <View style={styles.emptyAchievements}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="trophy" size={32} color={colors.whiteTransparent60} />
                </View>
                <Text style={styles.emptyTitle}>Start Your Journey</Text>
                <Text style={styles.emptyDescription}>
                  Complete your first run to unlock achievements
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
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
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.whiteTransparent80,
    fontSize: 16,
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
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
  achievementsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.yellow,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  achievementDescription: {
    color: colors.whiteTransparent60,
    fontSize: 14,
  },
  emptyAchievements: {
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    backgroundColor: colors.whiteTransparent20,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    color: colors.whiteTransparent60,
    fontSize: 14,
    textAlign: 'center',
  },
});