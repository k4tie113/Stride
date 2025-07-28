import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={icon} size={20} color={colors.yellow} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteTransparent15,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.whiteTransparent20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: colors.whiteTransparent80,
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  unit: {
    color: colors.whiteTransparent70,
    fontSize: 12,
  },
});