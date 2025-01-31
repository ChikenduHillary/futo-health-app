import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants"; // Adjusted import path
import { router } from "expo-router";

// Define the type for a notification
type Notification = {
  _id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const Page = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]); // State to store notifications
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading status
  const [error, setError] = useState<any>(); // State to handle errors

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userEmail = "johndoe@example.com"; // Replace with the logged-in user's email
        const response = await fetch(
          `https://futo-health-app-backend.onrender.com/api/notifications/cikenduhill@gmail.com`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data: Notification[] = await response.json();
        setNotifications(data); // Set the fetched notifications
      } catch (err: any) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchNotifications();
  }, []);

  // Render a loading indicator while fetching data
  if (loading) {
    return (
      <SafeAreaView className="bg-white min-h-full pt-10 flex justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="font-Poppins text-gray-600 mt-2">Loading...</Text>
      </SafeAreaView>
    );
  }

  // Render an error message if there's an error
  if (error) {
    return (
      <SafeAreaView className="bg-white min-h-full pt-10 flex justify-center items-center">
        <Text className="font-Poppins text-red-500">Error: {error}</Text>
      </SafeAreaView>
    );
  }

  // Render the list of notifications
  return (
    <SafeAreaView className="bg-white min-h-full pt-10">
      <FlatList
        data={notifications}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white items-end mt-4 mx-5 rounded-xl flex flex-row border-gray-200 border-[1px] p-5">
            <View className="h-full flex flex-row items-center w-1/6">
              <Image
                source={icons.image}
                width={100}
                height={100}
                className="w-10 h-10"
              />
            </View>
            <View className="w-5/6">
              <Text className="font-PoppinsSemiBold text-gray-800">
                {item.message}
              </Text>
              <Text className="font-Poppins text-md text-gray-600">
                {new Date(item.createdAt).toLocaleString()} {/* Format date */}
              </Text>
            </View>
            {/* <View className="w-1/6">
              <Text className="font-Poppins text-center text-gray-600">
                {item.read ? "Read" : "Unread"}
              </Text>
            </View> */}
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View className="px-5 pt-5 space-y-5">
            <Text className="text-2xl font-PoppinsSemiBold my-5">
              Notifications
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex justify-center items-center mt-10">
            <Text className="font-Poppins text-gray-600">
              No notifications found.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Page;
