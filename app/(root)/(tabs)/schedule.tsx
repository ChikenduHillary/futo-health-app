import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, schedules } from "@/constants";
import CustomButton from "@/components/CustomButton";
import Icon from "react-native-vector-icons/Feather";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: string;
  patient?: {
    name: string;
    email: string;
  };
  doctor?: {
    name: string;
    specialization: string;
  };
}

interface DatabaseUser {
  user: { _id: string };
  role: string;
  name: string;
}

const Page = () => {
  const { user } = useUser();
  const [databaseUser, setDatabaseUser] = useState<DatabaseUser | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.emailAddresses[0]?.emailAddress) {
        try {
          const response = await axios.get(
            `https://futo-health-app-backend.onrender.com/api/users/${user.emailAddresses[0]?.emailAddress}`
          );
          if (response?.data) {
            setDatabaseUser(response.data);
            fetchAppointments(response.data);
          }
        } catch (error) {
          Alert.alert("Error", "Could not fetch user data");
        }
      }
    };
    fetchUser();
  }, [user]);

  const fetchAppointments = async (dbUser: DatabaseUser) => {
    try {
      // Get today's date in `YYYY-MM-DD` format
      const today = new Date().toISOString().split("T")[0];
      console.log(
        `https://futo-health-app-backend.onrender.com/api/appointments/slots?patientId=${dbUser.user._id}&date=${today}`
      );

      // Full API base URL with query parameters
      const endpoint =
        dbUser.role !== "Patient"
          ? `https://futo-health-app-backend.onrender.com/api/appointments/slots?doctorId=${dbUser.user._id}&date=${today}`
          : `https://futo-health-app-backend.onrender.com/api/appointments/slots?patientId=${dbUser.user._id}&date=${today}`;

      const response = await axios.get(endpoint);
      setAppointments(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch today's appointments");
    }
  };

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      await axios.put(`/appointments/approve/${appointmentId}`);
      // Refresh appointments after approval
      if (databaseUser) fetchAppointments(databaseUser);
      Alert.alert("Success", "Appointment approved successfully");
    } catch (error) {
      Alert.alert("Error", "Could not approve appointment");
    }
  };

  const renderDoctorView = ({ item }: { item: Appointment }) => (
    <View style={styles.shadow} className="bg-white mt-4 mx-5 rounded-xl p-7">
      <View className="flex flex-row items-center gap-5">
        <Image source={icons.image} className="rounded-full w-16 h-16" />
        <View>
          <Text className="text-2xl tracking-tighter text-gray-700 font-PoppinsSemiBold">
            {item.patient?.name}
          </Text>
          <Text className="text-gray-500">{item.patient?.email}</Text>
        </View>
        <View
          className={`p-2 ${
            item.status === "pending"
              ? "bg-yellow-100"
              : item.status === "approved"
              ? "bg-green-100"
              : "bg-gray-100"
          } relative bottom-6 left-3 rounded-full`}
        >
          <Text
            className={`font-Poppins ${
              item.status === "pending"
                ? "text-yellow-700"
                : item.status === "approved"
                ? "text-green-700"
                : "text-gray-700"
            }`}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between border-t-[0.8px] pt-5 mt-5 border-gray-200">
        <View className="flex flex-row gap-1 items-center">
          <Image source={icons.calenderGray} className="w-5 h-5" />
          <Text className="text-gray-500 text-xl font-Poppins">
            {item.date}
          </Text>
        </View>
        <View className="flex flex-row gap-1 items-center justify-center">
          <Image source={icons.clockGray} className="w-5 h-5" />
          <Text className="text-gray-500 text-lg font-Poppins">
            {item.time}
          </Text>
        </View>
      </View>

      {item.status === "pending" && (
        <CustomButton
          title="Approve Appointment"
          className="mt-3"
          onPress={() => handleApproveAppointment(item._id)}
        />
      )}
    </View>
  );

  const renderPatientView = ({ item }: { item: Appointment }) => (
    <View style={styles.shadow} className="bg-white mt-4 mx-5 rounded-xl p-7">
      <View className="flex flex-row items-center gap-5">
        <Image source={icons.image} className="rounded-full w-16 h-16" />
        <View>
          <Text className="text-2xl tracking-tighter text-gray-700 font-PoppinsSemiBold">
            {item.doctor?.name}
          </Text>
          <Text className="text-gray-500">{item.doctor?.specialization}</Text>
        </View>
        <View
          className={`p-2 ${
            item.status === "pending"
              ? "bg-yellow-100"
              : item.status === "approved"
              ? "bg-green-100"
              : "bg-gray-100"
          } relative bottom-6 left-3 rounded-full`}
        >
          <Text
            className={`font-Poppins ${
              item.status === "pending"
                ? "text-yellow-700"
                : item.status === "approved"
                ? "text-green-700"
                : "text-gray-700"
            }`}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between border-t-[0.8px] pt-5 mt-5 border-gray-200">
        <View className="flex flex-row gap-1 items-center">
          <Image source={icons.calenderGray} className="w-5 h-5" />
          <Text className="text-gray-500 text-xl font-Poppins">
            {item.date}
          </Text>
        </View>
        <View className="flex flex-row gap-1 items-center justify-center">
          <Image source={icons.clockGray} className="w-5 h-5" />
          <Text className="text-gray-500 text-lg font-Poppins">
            {item.time}
          </Text>
        </View>
      </View>

      <CustomButton
        title="Details"
        className="mt-3"
        bgVariant="secondary"
        textVariant="secondary"
      />
    </View>
  );

  return (
    <SafeAreaView className="bg-white min-h-full pt-10">
      <FlatList
        data={appointments}
        className=""
        keyboardShouldPersistTaps="handled"
        renderItem={
          databaseUser?.role !== "Patient"
            ? renderDoctorView
            : renderPatientView
        }
        ListHeaderComponent={() => (
          <View className="px-5 pt-5 space-y-5">
            <Text className="text-3xl font-PoppinsSemiBold my-5">
              {databaseUser?.role === "doctor"
                ? "Patient Appointments"
                : "Appointments"}
            </Text>
            {databaseUser?.role === "Patient" && (
              <TouchableOpacity
                style={styles.shadow}
                className="flex p-4 rounded-xl bg-white flex-row justify-center items-center"
                onPress={() => router.push("/(root)/book")}
              >
                <Icon name="plus" size={30} color="#000" />
                <Text className="font-PoppinsSemiBold text-gray-700 text-xl">
                  Book a new appointment
                </Text>
              </TouchableOpacity>
            )}

            <Text className="text-2xl pt-5 tracking-tight text-gray-900 font-PoppinsSemiBold">
              {databaseUser?.role === "doctor"
                ? "Pending Appointments"
                : "Your Appointments"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#5a75a7",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
  },
});

export default Page;
