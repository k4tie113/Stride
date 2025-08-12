// src/screens/AnalysisScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useRunningAnalyzer } from '../pose/useRunningAnalyzer';

const AnalysisScreen = () => {
  const [video, setVideo] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const { analyzeVideo, isAnalyzing, result, reset } = useRunningAnalyzer();

  const handleVideoPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your camera roll to upload videos.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      const uri = res.assets[0].uri;
      setVideo(uri);
      try {
        const { uri: thumb } = await VideoThumbnails.getThumbnailAsync(uri);
        setVideoThumbnail(thumb);
      } catch(e){ /* thumbnail optional */ }
      // Kick off analysis immediately (or let user tap Start)
      analyzeVideo(uri);
    }
  };

  const handleReset = async () => {
    setVideo(null);
    setVideoThumbnail(null);
    await reset();
  };

  // UI states
  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.yellow} />
          <Text style={styles.stateText}>Analyzing your run...</Text>
          <Text style={styles.description}>This may take a few moments.</Text>
        </View>
      );
    }

    if (result) {
      const m = result.metrics;
      return (
        <View style={styles.resultsContainer}>
          <Text style={styles.title}>Analysis Complete!</Text>
          {videoThumbnail ? <Image source={{ uri: videoThumbnail }} style={styles.thumbnail} /> : null}
          <Text style={styles.resultText}>
            Knee flexion (contact): {Math.round(m.kneeFlexionDeg)}°{'\n'}
            Trunk lean: {Math.round(m.trunkLeanDeg)}°{'\n'}
            Head offset: {Math.round(m.headOffsetPct)}%
          </Text>
          {result.notes.map((n,i)=>(<Text key={i} style={styles.resultText}>• {n}</Text>))}
          <TouchableOpacity style={styles.uploadButton} onPress={handleReset}>
            <Ionicons name="reload-outline" size={24} color={colors.purple} />
            <Text style={styles.uploadText}>Analyze Another Video</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (video) {
      return (
        <View style={styles.resultsContainer}>
          <Text style={styles.title}>Video Selected</Text>
          {videoThumbnail ? <Image source={{ uri: videoThumbnail }} style={styles.thumbnail} /> : null}
          <TouchableOpacity style={styles.uploadButton} onPress={() => analyzeVideo(video)}>
            <Ionicons name="play-outline" size={24} color={colors.purple} />
            <Text style={styles.uploadText}>Start Analysis</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>AI Form Analysis</Text>
        <Text style={styles.description}>
          Upload a short video of your run to get AI feedback on your form, posture, and stride.
        </Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleVideoPick}>
          <Ionicons name="cloud-upload-outline" size={24} color={colors.purple} />
          <Text style={styles.uploadText}>Upload Run Video</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return <GradientBackground>{renderContent()}</GradientBackground>;
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  stateContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  resultsContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.white, marginBottom: 16 },
  description: { fontSize: 16, color: colors.white, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  uploadButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.yellow, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 24 },
  uploadText: { fontSize: 16, fontWeight: '600', marginLeft: 8, color: colors.purple },
  thumbnail: { width: 200, height: 200, borderRadius: 12, marginBottom: 20 },
  stateText: { fontSize: 20, color: colors.white, marginTop: 20, fontWeight: 'bold' },
  resultText: { fontSize: 16, color: colors.white, textAlign: 'center', marginBottom: 6 },
});

export default AnalysisScreen;
