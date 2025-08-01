// src/screens/PlansScreen.tsx
import React, { useState, useEffect } from 'react';
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
import { colors } from '../theme';
import { TrainingPlan } from '../api/client';
import apiClient from '../api/client';
import { useUser } from '../state/UserContext'; // ✅ Import the hook

export default function PlansScreen() {
  const { user } = useUser(); // ✅ Get the user from context
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) { // ✅ Check for user before fetching data
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const [plansData, currentPlanData] = await Promise.all([
        apiClient.getTrainingPlans(),
        apiClient.getCurrentPlan(),
      ]);

      setPlans(plansData);
      setCurrentPlan(currentPlanData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]); // ✅ Add 'user' to the dependency array

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user) { // ✅ Check for user before updating
      Alert.alert('Error', 'Please log in to select a plan.');
      return;
    }
    setUpdatingPlan(planId);
    try {
      await apiClient.updateCurrentPlan(planId);
      await loadData();
      Alert.alert('Success', 'Your training plan has been successfully changed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update your training plan. Please try again.');
    } finally {
      setUpdatingPlan(null);
    }
  };


  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return '#10B981'; // Green
      case 'Intermediate':
        return '#F59E0B'; // Orange
      case 'Advanced':
        return '#EF4444'; // Red
      default:
        return '#10B981';
    }
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading plans...</Text>
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
            <Text style={styles.title}>Training Plans</Text>
            <Text style={styles.subtitle}>Designed for all levels</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Ionicons name="calendar" size={24} color={colors.white} />
          </View>
        </View>

        {/* Current Plan Summary */}
        {currentPlan ? (
          <View style={styles.currentPlanContainer}>
            <View style={styles.currentPlanHeader}>
              <Text style={styles.currentPlanTitle}>Current Plan</Text>
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: getLevelColor(currentPlan.level) },
                ]}
              >
                <Text style={styles.levelBadgeText}>
                  {currentPlan.level.charAt(0).toUpperCase() + currentPlan.level.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.currentPlanName}>{currentPlan.name}</Text>
            <View style={styles.currentPlanProgress}>
              <Text style={styles.progressText}>
                Week {currentPlan.currentWeek} of {currentPlan.weeks}
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round(currentPlan.progress || 0)}% complete
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
        ) : (
          <View style={styles.currentPlanContainer}>
          <Text style={styles.loadingText}>You don’t currently have a training plan selected.</Text>
          </View>
        )}

        {/* Available Plans */}
        <View style={styles.plansContainer}>
          <Text style={styles.plansTitle}>Available Plans</Text>
          <View style={styles.plansList}>
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan?.id === plan.id;
              const isUpdating = updatingPlan === plan.id;

              return (
                <View
                  key={plan.id}
                  style={[
                    styles.planItem,
                    isCurrentPlan && styles.currentPlanItem,
                  ]}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planHeaderLeft}>

                      <Text style={styles.planName}>{plan.name}</Text>
                    </View>
                    <View
                      style={[
                        styles.levelBadge,
                        { backgroundColor: getLevelColor(plan.level) },
                      ]}
                    >
                      <Text style={styles.levelBadgeText}>
                        {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.planDescription}>{plan.description}</Text>

                  <View style={styles.planDetails}>
                    <Text style={styles.planDetail}>
                      {plan.weeks} weeks • {plan.runsPerWeek} runs/week
                    </Text>
                    <Text style={styles.planIntensity}>
                      {plan.level === 'Beginner'
                        ? 'Low intensity'
                        : plan.level === 'Intermediate'
                        ? 'Medium intensity'
                        : 'High intensity'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)
                    }
                    style={[styles.detailsButton, { marginBottom: 12 }]}
                  >
                    <Text style={styles.detailsButtonText}>
                      {expandedPlanId === plan.id ? 'Hide Details' : 'View Details'}
                    </Text>
                  </TouchableOpacity>

                  {expandedPlanId === plan.id && (
                    <View style={styles.featuresContainer}>
                      <View style={styles.featuresList}>
                        <View style={styles.featureItem}>
                          <View style={styles.featureBullet} />
                          <Text style={styles.featureText}>
                            Runs start with moderate distance and increase gradually.
                          </Text>
                        </View>
                        <View style={styles.featureItem}>
                          <View style={styles.featureBullet} />
                          <Text style={styles.featureText}>
                            Includes tempo, interval, and recovery runs.
                          </Text>
                        </View>
                        <View style={styles.featureItem}>
                          <View style={styles.featureBullet} />
                          <Text style={styles.featureText}>
                            Targets a sub-60-minute 10K finish.
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {isCurrentPlan ? (
                    <View style={styles.currentPlanButton}>
                      <Text style={styles.currentPlanButtonText}>Current Plan</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => handleSelectPlan(plan.id)}
                      disabled={isUpdating}
                    >
                      <Text style={styles.selectButtonText}>
                        {isUpdating ? 'Selecting...' : 'Select Plan'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}


const styles = StyleSheet.create({
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.whiteTransparent20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  currentPlanContainer: {
    marginHorizontal: 24,
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
    marginBottom: 24,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPlanTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  levelBadge: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 12,
    right: -10,
  },
  levelBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  currentPlanName: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  currentPlanProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    height: 8,
    backgroundColor: colors.whiteTransparent20,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.yellow,
    borderRadius: 4,
  },
  plansContainer: {
    paddingHorizontal: 24,
  },
  plansTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  plansList: {
    gap: 16,
    marginBottom: 32,
  },
  planItem: {
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
  },
  currentPlanItem: {
    borderColor: colors.yellow,
    backgroundColor: colors.whiteTransparent20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  planDescription: {
    color: colors.whiteTransparent80,
    fontSize: 14,
    marginBottom: 16,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planDetail: {
    color: colors.whiteTransparent70,
    fontSize: 14,
  },
  planIntensity: {
    color: colors.whiteTransparent70,
    fontSize: 14,
  },
  currentPlanButton: {
    backgroundColor: colors.yellow + '33', // 20% opacity
    borderWidth: 1,
    borderColor: colors.yellow,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentPlanButtonText: {
    color: colors.yellow,
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton:{
    backgroundColor: colors.purpleLight,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailsButtonText:{
    color: colors.yellow,
    fontSize: 16,
    fontWeight: '600',
  },
  selectButton: {
    backgroundColor: colors.yellow,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: colors.purpleLight,
    fontSize: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
    marginBottom: 15,
  },
  featuresTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureBullet: {
    width: 8,
    height: 8,
    backgroundColor: colors.yellow,
    borderRadius: 4,
  },
  featureText: {
    color: colors.whiteTransparent80,
    fontSize: 14,
  },
});