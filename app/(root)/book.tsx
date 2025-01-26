import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";

import CustomButton from "@/components/CustomButton";

// Type Definitions
interface Doctor {
  _id: string;
  name: string;
  specialization: string;
}

interface Slot {
  time: string;
  available: boolean;
}

interface BookAppointmentPayload {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  description?: string;
}

const Book: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get<Doctor[]>(
          "https://futo-health-app-backend.onrender.com/api/doctors"
        );
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
          console.log({
            doctorId: selectedDoctor._id,
            date: formattedDate,
          });
          const response = await axios.get(
            "https://futo-health-app-backend.onrender.com/api/appointments/slots",
            {
              params: {
                doctorId: selectedDoctor._id,
                date: formattedDate,
              },
            }
          );

          setAvailableSlots(response.data.availableSlots);
        } catch (error) {
          Alert.alert("Error", "Could not fetch available slots");
        }
      }
    };
    fetchSlots();
  }, [selectedDoctor, date]);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot) {
      Alert.alert("Error", "Please select a doctor and a time slot");
      return;
    }

    try {
      const payload: BookAppointmentPayload = {
        doctorId: selectedDoctor._id,
        patientId: "current_patient_id", // Replace with actual patient ID
        date: date.toISOString().split("T")[0],
        time: selectedSlot,
        description,
      };

      await axios.post(
        "https://futo-health-app-backend.onrender.com/api/appointments",
        payload
      );
      Alert.alert("Success", "Appointment booked successfully");
    } catch (error) {
      Alert.alert("Error", "Booking failed");
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="p-5">
        <Text className="font-PoppinsSemiBold text-3xl mb-5">
          New Appointment
        </Text>

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
