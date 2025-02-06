import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo"; // Assuming you're using Clerk for authentication

import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import { icons } from "@/constants";
const BASE_URL = "https://futo-health-app-backend.onrender.com/api";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
}

interface Slot {
  time: string;
  available: boolean;
}

const Book: React.FC = () => {
  const { user } = useUser();
  const [databaseUser, setDatabaseUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  // Fetch patient ID
  useEffect(() => {
    const fetchPatientId = async () => {
      if (user?.emailAddresses[0]?.emailAddress) {
        try {
          const response = await axios.get(
            `${BASE_URL}/users/${user.emailAddresses[0].emailAddress}`
          );
          if (response?.data) setDatabaseUser(response.data);
        } catch (error) {
          Alert.alert("Error", "Could not fetch patient information");
        }
      }
    };
    fetchPatientId();
  }, [user]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get<Doctor[]>(`${BASE_URL}/doctors`);
        setDoctors(response.data);
      } catch (error) {
        Alert.alert("Error", "Could not fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available slots
  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedDoctor && date) {
        try {
          const formattedDate = date.toISOString().split("T")[0];
          const response = await axios.get(`${BASE_URL}/appointments/slots`, {
            params: {
              doctorId: selectedDoctor._id,
              date: formattedDate,
            },
          });

          setAvailableSlots(response.data.availableSlots);
        } catch (error) {
          Alert.alert("Error", "Could not fetch available slots");
        }
      }
    };
    fetchSlots();
  }, [selectedDoctor, date]);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !databaseUser) {
      Alert.alert(
        "Error",
        "Please select a doctor, time slot, and ensure patient info is loaded"
      );
      return;
    }

    try {
      console.log({
        doctorId: selectedDoctor._id,
        patientId: databaseUser.user._id,
        date: date.toISOString().split("T")[0],
        time: selectedSlot,
        description,
      });
      await axios.post(`${BASE_URL}/appointments`, {
        doctorId: selectedDoctor._id,
        patientId: databaseUser.user._id,
        date: date.toISOString().split("T")[0],
        time: selectedSlot,
        description,
      });
      Alert.alert("Success", "Appointment booked successfully");
      setDescription("");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Slot already booked");
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="p-5">
        <Link href={"/(root)/(tabs)/home"} className="flex flex-row my-10">
          <Image
            source={icons.backArrow}
            className="h-8 w-8"
            alt="back arrow"
          />
          <Text className="font-PoppinsSemiBold text-3xl">New Appointment</Text>
        </Link>

        {/* Doctor Selection */}
        <View className="mb-5">
          <Text className="font-Poppins text-lg mb-2">Select Doctor</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {doctors.map((doctor) => (
              <TouchableOpacity
                key={doctor._id}
                onPress={() => setSelectedDoctor(doctor)}
                className={`p-3 mr-2 rounded-lg ${
                  selectedDoctor?._id === doctor._id
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              >
                <Text
                  className={
                    selectedDoctor?._id === doctor._id
                      ? "text-white"
                      : "text-black"
                  }
                >
                  {doctor.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Available Slots */}
        <View className="mb-5">
          <Text className="font-Poppins text-lg mb-2">Available Slots</Text>
          <View className="flex-row flex-wrap">
            {availableSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                onPress={() => setSelectedSlot(slot.time)}
                className={`p-2 m-1 rounded-lg ${
                  selectedSlot === slot.time ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <Text
                  className={
                    selectedSlot === slot.time ? "text-white" : "text-black"
                  }
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="mb-5">
          <Text className="font-Poppins text-lg mb-2">Description</Text>
          <TextInput
            className="h-40 p-3 border border-gray-300 rounded-lg text-base"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your medical concern..."
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Book Button */}
        <CustomButton
          title="Book Appointment"
          onPress={handleBookAppointment}
          className="mt-5"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Book;
