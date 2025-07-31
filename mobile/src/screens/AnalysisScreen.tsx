import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GradientBackground} from '../components/GradientBackground';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const AnalysisScreen = () => {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>AI Form Analysis</Text>
        <Text style={styles.description}>
          Upload a short video of your run to get AI feedback on your form, posture, and stride. This feature is coming soon!
        </Text>

        <TouchableOpacity style={styles.uploadButton} disabled>
          <Ionicons name="cloud-upload-outline" size={24} color={colors.purple} />
          <Text style={styles.uploadText}>Upload Run Video</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellow,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    opacity: 0.6, // to indicate it's disabled for now
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.purple,
  },
});

export default AnalysisScreen;
