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
import { UserStats, Run } from '../api/client';
import apiClient from '../api/client';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';




export default function RunsScreen() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllRuns, setShowAllRuns] = useState(false);
  const [visibleRunsCount, setVisibleRunsCount] = useState(3);
  const paceData = runs.map(run => run.pace || 0);
  const runDates = runs.map(run => run.dateFormatted);
  const screenWidth = Dimensions.get('window').width;
  const loadData = async () => {
    try {
      const [runsData, statsData] = await Promise.all([
        apiClient.getAllRuns(),
        apiClient.getUserStats(),
      ]);
      const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      const formattedRuns = runsData.map(run => {
        const date = new Date(run.date);
        const durationFormatted = formatDuration(run.duration);
        const paceFormatted = run.pace ? formatPace(run.pace) : '—';
        const dateFormatted = date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
  
        return {
          ...run,
          durationFormatted,
          paceFormatted,
          dateFormatted,
        };
      });
  
      setRuns(formattedRuns);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
  const averagePace = runs.length > 0 
    ? runs.reduce((sum, run) => sum + (run.pace || 0), 0) / runs.length 
    : 0;

  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRunSuccess = () => {
    loadData();
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading runs...</Text>
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
          <View>
            <Text style={styles.title}>Progress</Text>
            <Text style={styles.subtitle}>View your personal statistics</Text>
          </View>
          <View style={styles.avatarContainer}>
               <Ionicons name="trending-up" size={30} color={colors.purpleLight} />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
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

        <View style={styles.chartSection}>
  <Text style={styles.sectionTitle}>Your Average Pace</Text>
  </View>

  <View
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.1)',  // semi-transparent white
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 24,
    marginBottom: 20,
  }}
>
  <LineChart
    data={{
      labels: Array(paceData.length).fill(''),
      datasets: [
        {
          data: paceData,
          color: () => colors.yellow,
          strokeWidth: 2,
        },
      ],
    }}
    width={Dimensions.get('window').width - 64}
    height={180}
    withVerticalLines={false}
    withVerticalLabels = {false}
    withOuterLines={false}
    withDots={true}
    withInnerLines={true}
    yLabelsOffset={20}
    bezier
    style={{
      backgroundColor: 'transparent',
      padding: 0,
      margin: 0,
      overflow: 'hidden', // force containment
      borderRadius: 10,
    }}
    chartConfig={{
      backgroundColor: colors.whiteTransparent15,
      backgroundGradientFrom: colors.purpleLight,
      backgroundGradientTo: colors.purpleLight,
      decimalPlaces: 0,
      color: () => colors.whiteTransparent20,
      labelColor: () => colors.white,
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: colors.white,
      },
      propsForBackgroundLines: {
        stroke: colors.whiteTransparent20,
      },
    }}
    formatYLabel={value => formatPace(Number(value))}
  />
</View>



        {/* Runs List */}
        <View style={styles.runsContainer}>
          <Text style={styles.sectionTitle}>Previous Runs</Text>
          {runs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="trending-up" size={32} color={colors.whiteTransparent60} />
              </View>
              <Text style={styles.emptyTitle}>No runs yet.</Text>
              <Text style={styles.emptySubtitle}>
                Start tracking your runs to see your progress here!
              </Text>
            </View>
          ) : (
            <View style={styles.runsList}>
            {runs.slice(0, visibleRunsCount).map((run) => (
  <View key={run.id} style={styles.runItem}>
    {/* Your run card UI */}
    <View style={styles.runHeader}>
      <Text style={styles.runDate}>{run.dateFormatted}</Text>
      <View style={styles.runTypeContainer}>
        <Text style={styles.runType}>
          {run.runType.charAt(0).toUpperCase() + run.runType.slice(1)}
        </Text>
      </View>
    </View>
    <View style={styles.runStats}>
      <View style={styles.runStat}>
        <Text style={styles.runStatValue}>{run.distance}</Text>
        <Text style={styles.runStatLabel}>miles</Text>
      </View>
      <View style={styles.runStat}>
        <Text style={styles.runStatValue}>{run.durationFormatted}</Text>
        <Text style={styles.runStatLabel}>time</Text>
      </View>
      <View style={styles.runStat}>
        <Text style={styles.runStatValue}>{run.paceFormatted}</Text>
        <Text style={styles.runStatLabel}>pace</Text>
      </View>
    </View>
  </View>
))}


{runs.length > 3 && (
  <TouchableOpacity
    onPress={() => {
      if (visibleRunsCount >= runs.length) {
        setVisibleRunsCount(3); // collapse
      } else {
        setVisibleRunsCount(prev => Math.min(prev + 3, runs.length)); // show +3
      }
    }}
    style={styles.viewAllButton}
  >
    <Text style={styles.viewAllButtonText}>
      {visibleRunsCount >= runs.length ? 'Show Less' : 'Show More'}
    </Text>
  </TouchableOpacity>
)}

            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 24,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.whiteTransparent80,
    fontSize: 18,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.yellow,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  runsContainer: {
    paddingHorizontal: 24,
  },
  emptyContainer: {
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.whiteTransparent20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySubtitle: {
    color: colors.whiteTransparent60,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  firstRunButton: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  firstRunButtonText: {
    color: colors.purple,
    fontSize: 16,
    fontWeight: '600',
  },
  runsList: {
    gap: 16,
  },
  runItem: {
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
  },
  runHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  runDate: {
    color: colors.whiteTransparent60,
    fontSize: 14,
  },
  runTypeContainer: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  runType: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '600',
  },
  runStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  runStat: {
    alignItems: 'center',
  },
  runStatValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  runStatLabel: {
    color: colors.whiteTransparent60,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  viewAllButton: {
    marginTop: 5,
    alignItems: 'center',
  },
  
  viewAllButtonText: {
    color: colors.yellow,
    fontWeight: '600',
    fontSize: 16,
  },

  chartSection: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  chartContainer: {
    height: 160,
    flexDirection: 'row',
    marginBottom: 10,
  },
  chart: {
    flex: 1,
    marginLeft: 10,
  },
  
});