import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { scheduleAppointments, Doctor, Patient } from '../lib/scheduler'; // Import the scheduling function

interface ReminderProps {
  doctors: Doctor[];
  patients: Patient[];
}

const Reminder: React.FC<ReminderProps> = ({ doctors, patients }) => { // Accept doctors and patients as props
  const [reminderTime, setReminderTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSetReminder = () => {
    // Logic to set the reminder (e.g., save to state or API)
    setMessage(`Reminder set for ${reminderTime}`);
  };

  const handleSchedule = () => {
    if (doctors.length === 0 || patients.length === 0) {
      setMessage('No doctors or patients available for scheduling.');
      return;
    }

    try {
      const appointments = scheduleAppointments(doctors, patients);
      console.log(appointments); // Log the scheduled appointments
      setMessage('Appointments scheduled! Check console for details.');
    } catch (error) {
      setMessage('Error scheduling appointments. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Appointment Reminder</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter reminder time (e.g., 10 minutes before)"
        value={reminderTime}
        onChangeText={setReminderTime}
      />
      <Button title="Set Reminder" onPress={handleSetReminder} />
      <Button title="Schedule Appointments" onPress={handleSchedule} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    width: '100%', // Responsive width
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 12,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default Reminder;
