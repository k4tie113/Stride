// src/components/RunTrackingModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { colors } from '../theme';
import { supabase } from '../supabase/client'; // ✅ Import Supabase client
import { useUser } from '../state/UserContext'; // ✅ Import useUser hook

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RunTrackingModal: React.FC<Props> = ({ visible, onClose, onSuccess }) => {
  const [distance, setDistance] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [runType, setRunType] = useState('Easy Run');
  
  const { user } = useUser(); // ✅ Get the authenticated user

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save a run.');
      return;
    }

    const parsedDistance = parseFloat(distance);
    const parsedMinutes = parseInt(minutes);
    const parsedSeconds = parseInt(seconds);
    const totalSeconds = (parsedMinutes || 0) * 60 + (parsedSeconds || 0);

    if (isNaN(parsedDistance) || isNaN(totalSeconds) || parsedDistance <= 0 || totalSeconds <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid positive numbers for distance and duration.');
      return;
    }
    
    const pace = totalSeconds / parsedDistance;

    if (pace < 120) {
      Alert.alert('Unrealistic Pace', 'Please enter realistic numbers! That pace is nearly impossible.');
      return;
    }

    const newRun = {
      user_id: user.id, // ✅ Use the actual user ID
      distance: parsedDistance,
      duration: totalSeconds,
      run_type: runType, // ✅ Use the correct column name
      date: new Date().toISOString(),
      pace,
    };

    try {
      const { error } = await supabase
        .from('runs')
        .insert([newRun]);

      if (error) {
        throw error;
      }

      console.log('Successfully saved new run:', newRun);
      
      Alert.alert('Nice work!', 'Congratulations on completing your run!', [
        { text: 'OK', onPress: () => {
          onSuccess();
          onClose();
          setDistance('');
          setMinutes('');
          setSeconds('');
          setRunType('Easy Run');
        } },
      ]);
      
    } catch (error) {
      console.error('Error saving run:', error);
      Alert.alert('Error', 'Failed to save your run. Please try again.');
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Track Your Run</Text>
          <Text style={styles.subtitle}>Enter Your Run Details</Text>

          <TextInput
            placeholder="Distance (miles)"
            placeholderTextColor="#eee"
            style={[styles.input, { width: '100%' }]}
            keyboardType="numeric"
            value={distance}
            onChangeText={setDistance}
          />

          <View style={styles.rowContainer}>
            <TextInput
              placeholder="Min"
              placeholderTextColor="#eee"
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              value={minutes}
              onChangeText={setMinutes}
            />
            <TextInput
              placeholder="Sec"
              placeholderTextColor="#eee"
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              value={seconds}
              onChangeText={setSeconds}
            />
          </View>

          <RNPickerSelect
            onValueChange={(value) => setRunType(value)}
            value={runType}
            items={[
              { label: 'Easy Run', value: 'Easy Run' },
              { label: 'Tempo Run', value: 'Tempo Run' },
              { label: 'Interval Training', value: 'Interval' },
              { label: 'Long Run', value: 'Long Run' },
              { label: 'Recovery Run', value: 'Recovery' },
              { label: 'Walk/Jog', value: 'Walk/Jog' },
            ]}
            style={pickerSelectStyles}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Run</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ... (existing styles)
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.purple,
    width: '85%',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.whiteTransparent80,
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.whiteTransparent15,
    color: colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  halfInput: {
    width: '48%',
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: colors.yellow,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 8,
  },
  saveButtonText: {
    color: colors.purple,
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.whiteTransparent20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.whiteTransparent15,
    color: colors.white,
    marginBottom: 12,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.whiteTransparent15,
    color: colors.white,
    marginBottom: 12,
    width: '100%',
  },
});