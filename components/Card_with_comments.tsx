import React, { useEffect, useState } from "react"; // Import React and hooks for state and effect
import { format } from 'date-fns-tz'; // Import date-fns-tz functions
import { View, Text, StyleSheet, Button, Image } from "react-native"; // Import components from React Native
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for selecting images
import Person from "assets/icons/image.svg"; // Import default profile icon
import CustomButton from "./CustomButton"; // Import CustomButton component
import Reminder from "./Reminder"; // Import the Reminder component
import { Doctor, Patient } from '../lib/scheduler'; // Import Doctor and Patient types

// Define the Card component, accepting an optional hasDetails prop
const Card = (hasDetails?: boolean) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // State for current date
  const [profileImage, setProfileImage] = useState<string | null>(null); // State for profile image

  // Effect to update current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date()); // Update current date
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Function to pick an image from the library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
      allowsEditing: true, // Allow editing of the image
      aspect: [4, 3], // Aspect ratio for the image
      quality: 1, // Quality of the image
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Set the selected image URI
    } else {
      console.error("Image selection was canceled"); // Log error if selection was canceled
    }
  };

  // Format the current date
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long', // Full name of the weekday
    year: 'numeric', // Numeric year
    month: 'long', // Full name of the month
    day: 'numeric', // Numeric day
  });

  // Format the current time
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit', // Two-digit hour
    minute: '2-digit', // Two-digit minute
  });

  // Sample data for doctors
  const doctors: Doctor[] = [
    { id: '1', name: 'Dr. Imran Syahir', availableSlots: 5 }, // Doctor 1
    { id: '2', name: 'Dr. Jane Doe', availableSlots: 3 }, // Doctor 2
  ];

  // Sample data for patients
  const patients: Patient[] = [
    { id: '1', name: 'Patient A' }, // Patient 1
    { id: '2', name: 'Patient B' }, // Patient 2
    { id: '3', name: 'Patient C' }, // Patient 3
  ];

  // Render the component
  return (
    <View style={styles.container}> {/* Main container */}
      <View style={styles.innerContainer}> {/* Inner container */}
        <View style={styles.row}> {/* Row for profile image and name */}
          {profileImage ? ( // Check if profile image is available
            <Image source={{ uri: profileImage }} style={styles.profileImage} /> // Display profile image
          ) : (
            <Person width={100} height={30} /> // Default icon if no image
          )}
          <View> {/* Container for doctor name and specialty */}
            <Text style={styles.doctorName}>Dr. Imran Syahir</Text> {/* Doctor's name */}
            <Text style={styles.specialty}>General Doctor</Text> {/* Doctor's specialty */}
          </View>
        </View>
      </View>

      <Button title="Upload Profile Picture" onPress={pickImage} /> {/* Button to upload profile picture */}

      <View style={styles.dateContainer}> {/* Container for date and time */}
        <View>
          <Text style={styles.dateText}>{formattedDate}</Text> {/* Display formatted date */}
        </View>
        <Text style={styles.timeText}>{formattedTime}</Text> {/* Display formatted time */}
      </View>

      {hasDetails && <CustomButton title="Details" />} {/* Render Details button if hasDetails is true */}
      <Reminder doctors={doctors} patients={patients} /> {/* Pass doctors and patients to Reminder */}
    </View>
  );
};

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green', // Background color of the card
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding inside the card
    margin: 5, // Margin around the card
    width: '90%', // Responsive width
    alignSelf: 'center', // Center the card
  },
  innerContainer: {
    flex: 1, // Flex property for inner container
  },
  row: {
    flexDirection: 'row', // Row layout
    alignItems: 'center', // Center items vertically
    gap: 5, // Space between items
  },
  profileImage: {
    width: 80, // Width of the profile image
    height: 80, // Height of the profile image
    borderRadius: 40, // Make it circular
  },
  doctorName: {
    color: 'white', // Color of the doctor's name
    fontWeight: 'bold', // Bold font weight
    fontSize: 16, // Font size of the doctor's name
  },
  specialty: {
    color: 'white', // Color of the specialty text
  },
  dateContainer: {
    flexDirection: 'row', // Row layout for date and time
    justifyContent: 'space-between', // Space between date and time
    borderTopWidth: 0.8, // Top border width
    paddingTop: 5, // Padding above the date
    marginTop: 5, // Margin above the date container
    borderColor: 'gray', // Border color
  },
  dateText: {
    color: 'white', // Color of the date text
    fontSize: 14, // Font size of the date text
  },
  timeText: {
    color: 'white', // Color of the time text
    fontSize: 12, // Font size of the time text
  },
});

export default Card; // Export the Card component
