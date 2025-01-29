import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import moment from 'moment-timezone'; // Import moment
import * as ImagePicker from 'expo-image-picker';
import Person from "assets/icons/image.svg"; // Corrected import path
import CustomButton from "./CustomButton";
import Reminder from "./Reminder"; // Import the Reminder component
import { Doctor, Patient } from '../lib/scheduler'; // Import types

const Card = (hasDetails?: boolean) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    } else {
      console.error("Image selection was canceled");
    }
  };

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Sample data for doctors and patients
  const doctors: Doctor[] = [
    { id: '1', name: 'Dr. Imran Syahir', availableSlots: 5 },
    { id: '2', name: 'Dr. Jane Doe', availableSlots: 3 },
  ];

  const patients: Patient[] = [
    { id: '1', name: 'Patient A' },
    { id: '2', name: 'Patient B' },
    { id: '3', name: 'Patient C' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.row}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Person width={100} height={30} /> // Default icon
          )}
          <View>
            <Text style={styles.doctorName}>Dr. Adoga James</Text>
            <Text style={styles.specialty}>General Doctor</Text>
          </View>
        </View>
      </View>

      <Button title="Upload Profile Picture" onPress={pickImage} />

      <View style={styles.dateContainer}>
        <View>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>

      {hasDetails && <CustomButton title="Details" />}
      <Reminder doctors={doctors} patients={patients} /> {/* Pass doctors and patients to Reminder */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10, // Reduced padding
    margin: 5, // Reduced margin
    width: '90%', // Responsive width
    alignSelf: 'center', // Center the card
  },
  innerContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // Reduced gap
  },
  profileImage: {
    width: 80, // Reduced size
    height: 80, // Reduced size
    borderRadius: 40, // Make it circular
  },
  doctorName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16, // Reduced font size
  },
  specialty: {
    color: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.8,
    paddingTop: 5,
    marginTop: 5,
    borderColor: 'gray',
  },
  dateText: {
    color: 'white',
    fontSize: 12, // Reduced font size
  },
  timeText: {
    color: 'white',
    fontSize: 10, // Reduced font size
  },
});

export default Card;
