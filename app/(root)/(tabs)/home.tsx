import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { Redirect, router } from "expo-router";
import dayjs from "dayjs";

interface DoctorResponse {
  role: "Doctor" | "Patient";
  user: {
    _id: string;
    name: string;
    specialization: string;
    availability: Array<{
      date: string;
      slots: Array<{
        time: string;
        available: boolean;
      }>;
    }>;
    email: string;
    __v: number;
  };
}

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
  id: string;
  doctorsName: string;
  specialty: string;
  date: string;
  time: string;
}

const Page = () => {
  const { user } = useUser();
  const [isUserInDatabase, setIsUserInDatabase] = useState(false);
  const [dataBaseUser, setDataBaseUser] = useState<DoctorResponse | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `https://futo-health-app-backend.onrender.com/api/users/${user?.emailAddresses[0]?.emailAddress}`
        );
        if (response?.data) {
          setDataBaseUser(response.data);
          setIsUserInDatabase(true);
          fetchAppointments(response.data.user._id);
        }
      } catch (error) {
        console.log("Error checking user:", error);
        setIsUserInDatabase(false);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAppointments = async (userId: string) => {
      try {
        const response = await axios.get<AppointmentResponse>(
          `https://futo-health-app-backend.onrender.com/api/appointments/all?${
            dataBaseUser?.role !== "Patient" ? "doctorId" : "patientId"
          }=${userId}`
        );

        // Transform the appointments data
        const transformedAppointments = response.data.future.map((apt) => ({
          id: apt._id,
          doctorsName: apt.doctorId.name,
          specialty: "Doctor",
          date: apt.date,
          time: apt.time,
        }));

        setAppointments(transformedAppointments);
      } catch (error) {
        console.log("Error fetching appointments:", error);
      }
    };

    checkUserInDatabase();
  }, [user]);

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

  if (!isUserInDatabase) return <Redirect href={"/(auth)/account-type"} />;

  // Find the latest appointment
  const latestAppointment = appointments.length > 0 ? appointments[0] : null;
  const isLatestAppointmentPassed = latestAppointment
    ? dayjs(`${latestAppointment.date} ${latestAppointment.time}`).isBefore(
        dayjs()
      )
    : false;

  return (
    <SafeAreaView className="bg-white min-h-full pt-10">
      <FlatList
        data={appointments}
        keyboardShouldPersistTaps="handled"
        className="mb-20"
        renderItem={({ item }) => {
          return (
            <View
              style={styles.shadow}
              className="bg-white mt-4 mx-5 rounded-xl p-7"
            >
              <View className="flex flex-row items-center gap-5">
                <Image
                  source={icons.image}
                  className="rounded-full w-16 h-16"
                />
                <View>
                  <Text className="text-lg tracking-tighter text-gray-700 font-PoppinsSemiBold">
                    {item.doctorsName}
                  </Text>
                  <Text className="text-gray-500">{item.specialty}</Text>
                </View>
              </View>

              <View className="flex flex-row justify-between border-t-[0.8px] pt-5 mt-5 border-gray-200">
                <View className="flex flex-row gap-1 items-center justify-center ">
                  <Image source={icons.calenderGray} className="w-4 h-4" />
                  <Text className="text-gray-500 font-Poppins">
                    {item.date}
                  </Text>
                </View>
                <View className="flex flex-row gap-1 items-center justify-center">
                  <Image source={icons.clockGray} className="w-4 h-4" />
                  <Text className="text-gray-500 font-Poppins">
                    {item.time}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <View className="px-5 space-y-5">
            <View className="flex flex-row justify-between items-end pb-5">
              <View>
                <Text className="text-gray-400 text-xl font-Poppins">
                  Hello, {dataBaseUser?.role == "Doctor" ? "Doctor" : ""}
                </Text>
                <Text className="text-xl font-semibold font-PoppinsSemiBold">
                  {dataBaseUser?.user.name}
                </Text>
              </View>
              <Image
                source={{ uri: user?.imageUrl }}
                className="rounded-full w-16 h-16"
              />
            </View>

            <View className="bg-green-500 rounded-xl p-7">
              {latestAppointment ? (
                <>
                  {isLatestAppointmentPassed && (
                    <Text className="text-white bg-red-500 px-2 py-1 rounded-full self-start">
                      Passed
                    </Text>
                  )}
                  <View className="flex flex-row items-center gap-5 mt-2">
                    <Image
                      source={icons.image}
                      className="rounded-full w-16 h-16"
                    />
                    <View>
                      <Text className="text-white text- font-PoppinsBold">
                        {latestAppointment.doctorsName}
                      </Text>
                      <Text className="text-white font-Poppins">
                        {latestAppointment.specialty}
                      </Text>
                    </View>
                  </View>

                  <View className="flex flex-row justify-between border-t-[0.8px] pt-5 mt-5 border-gray-200">
                    <View className="flex flex-row gap-1 items-center justify-center">
                      <Image source={icons.calender} className="w-4 h-4" />
                      <Text className="text-white font-Poppins">
                        {latestAppointment.date}
                      </Text>
                    </View>
                    <View className="flex flex-row gap-1 items-center justify-center">
                      <Image source={icons.clock} className="w-4 h-4" />
                      <Text className="text-white font-Poppins pt-1">
                        {latestAppointment.time}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <View className="items-center py-8">
                  <Image source={icons.calender} className="w-12 h-12 mb-4" />
                  <Text className="text-white text-xl font-PoppinsBold text-center">
                    No Recent Appointment
                  </Text>
                  <Text className="text-white font-Poppins text-center mt-2">
                    Book an appointment to get started
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(root)/(tabs)/schedule")}
                    className="mt-6 bg-white px-6 py-3 rounded-lg"
                  >
                    <Text className="text-green-500 text-lg font-PoppinsSemiBold">
                      Book Now
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text className="text-xl pt-5 tracking-tight text-gray-900 font-PoppinsSemiBold">
              Your Appointments
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-xl font-Poppins">
              You don't have any appointments today.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/schedule")}
              className="mt-5 bg-green-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white text-lg font-Poppins">
                Book an Appointment
              </Text>
            </TouchableOpacity>
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
