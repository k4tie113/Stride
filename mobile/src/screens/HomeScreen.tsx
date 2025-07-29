import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components/GradientBackground';
import { StatCard } from '../components/StatCard';
import { colors } from '../theme';
import { UserStats, Run, TrainingPlan } from '../api/client';
import apiClient from '../api/client';
import { RunTrackingModal } from '../components/RunTrackingModal';

export default function HomeScreen() {
  const [showRunModal, setShowRunModal] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
    // fetch user data
    const fetchUser = async () => {
      const stats = await apiClient.getUserStats();
      setUserName(stats.user.firstname);
    };
    fetchUser();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

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

  const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
  const averagePace = runs.length > 0
    ? runs.reduce((sum, run) => sum + (run.pace || 0), 0) / runs.length
    : 0;

  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* App Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={colors.white} />
          </View>
          <Text style={styles.appTitle}>Welcome</Text>
          <Text style={styles.greeting}>{greeting}, {userName}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Distance"
              value={totalDistance.toFixed(1)}
              unit="miles"
              icon="trophy"
            />
            <StatCard
              title="Average Pace"
              value={runs.length > 0 ? formatPace(averagePace) : '0:00'}
              unit="per mile"
              icon="trending-up"
            />
          </View>
        </View>

        {/* Main Action Button */}
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

        {/* Current Plan Status */}
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
        ) : (
          <View style={styles.trainingSection}>
            <Text style={styles.sectionTitle}>Training Progress</Text>
            <View style={styles.planCard}>
              <Text style={styles.progressText}>You don’t currently have a plan. Select one in the "training" page!</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Run Tracking Modal */}
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
});
