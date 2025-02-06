import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import Icon from "react-native-vector-icons/Feather";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { generateColorFromName } from "@/lib/utils";

interface AppointmentResponse {
  future: Array<{
    _id: string;
    date: string;
    time: string;
    status: string;
    doctorId: any;
    patientId: any;
    createdAt: string;
    __v: number;
  }>;
  past: Array<any>;
  present: Array<any>;
}

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
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      const endpoint = `https://futo-health-app-backend.onrender.com/api/appointments/all?${
        dbUser.role !== "Patient" ? "doctorId" : "patientId"
      }=${dbUser.user._id}`;

      const response = await axios.get<AppointmentResponse>(endpoint);

      // Transform appointments to include required fields
      const transformedAppointments = response.data.future.map((apt) => ({
        _id: apt._id,
        doctorId: apt.doctorId,
        patientId: apt.patientId,
        date: apt.date,
        time: apt.time,
        status: apt.status,
        // You'll need to fetch these details separately or modify the backend
        patient: {
          name: "Patient Name",
          email: "patient@email.com",
        },
        doctor: {
          name: apt.doctorId.name,
          specialization: "Specialization",
        },
      }));

      setAppointments(transformedAppointments);
    } catch (error) {
      Alert.alert("Error", "Could not fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      await axios.put(`/appointments/approve/${appointmentId}`);
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
          <Text className="text-gray-500 font-Poppins">{item.date}</Text>
        </View>
        <View className="flex flex-row gap-1 items-center justify-center">
          <Image source={icons.clockGray} className="w-5 h-5" />
          <Text className="text-gray-500 font-Poppins">{item.time}</Text>
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
      <View className="flex flex-row justify-between">
        <View className="flex flex-row items-center gap-5">
          <View
            className="h-16 w-16 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: generateColorFromName(item.doctor?.name!),
            }}
          >
            <Text className="text-white text-4xl ">{item.doctor?.name[0]}</Text>
          </View>
          <View>
            <Text className="text-lg tracking-tighter text-gray-700 font-PoppinsSemiBold">
              {item.doctor?.name}
            </Text>
            <Text className="text-gray-500">{item.doctor?.specialization}</Text>
          </View>
        </View>
        <View
          className={`p-2 ${
            item.status === "pending"
              ? "bg-yellow-100"
              : item.status === "approved"
              ? "bg-green-100"
              : "bg-gray-100"
          } rounded-full h-10 flex items-center justify-center`}
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
          <Image source={icons.calenderGray} className="w-4 h-4" />
          <Text className="text-gray-500  font-Poppins">{item.date}</Text>
        </View>
        <View className="flex flex-row gap-1 items-center justify-center">
          <Image source={icons.clockGray} className="w-4 h-4" />
          <Text className="text-gray-500 font-Poppins">{item.time}</Text>
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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0096FF" />
        <Text className="mt-4 text-gray-600 font-Poppins">
          Loading appointments...
        </Text>
      </View>
    );
  }

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
            <Text className="text-xl font-PoppinsSemiBold my-5">
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
                <Icon name="plus" size={20} color="#000" />
                <Text className="font-PoppinsSemiBold text-gray-700 ">
                  Book a new appointment
                </Text>
              </TouchableOpacity>
            )}

            <Text className="text-lg pt-5 tracking-tight text-gray-900 font-PoppinsSemiBold">
              {databaseUser?.role === "doctor"
                ? "Pending Appointments"
                : "Your Appointments"}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-xl font-Poppins">
              No appointments found.
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
