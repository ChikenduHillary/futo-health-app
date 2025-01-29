import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { homeIcons, icons, schedules } from "@/constants";
import CustomButton from "@/components/CustomButton";
import Person from "@/assets/icons/image.svg";
import Icon from "react-native-vector-icons/Feather";
import { router } from "expo-router";

const Page = () => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <SafeAreaView className="bg-white min-h-full pt-10">
      <FlatList
        data={schedules}
        className=""
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View
            style={styles.shadow}
            className="bg-white mt-4 mx-5 rounded-xl p-7"
          >
            <View className="flex flex-row items-center gap-5">
              <Image source={icons.image} className="rounded-full w-16 h-16" />
              <View>
                <Text className="text-2xl tracking-tighter text-gray-700 font-PoppinsSemiBold">
                  {item.doctorsName}
                </Text>
                <Text className="text-gray-500">{item.specialty}</Text>
              </View>
              <View
                className={`p-2 ${
                  item.status == "pending"
                    ? "bg-yellow-100"
                    : item.status == "approved"
                    ? "bg-green-100"
                    : "bg-gray-100"
                } relative bottom-6 left-3 rounded-full`}
              >
                <Text
                  className={`font-Poppins ${
                    item.status == "pending"
                      ? "text-yellow-700"
                      : item.status == "approved"
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
                  {moment().tz("Africa/Lagos").format("dddd, D MMMM")}
                </Text>
              </View>
              <View className="flex flex-row gap-1 items-center justify-center">
                <Image source={icons.clockGray} className="w-5 h-5" />
                <Text className="text-gray-500 text-lg font-Poppins">
                  11:00 - 12:00 AM
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
        )}
        ListHeaderComponent={() => (
          <View className="px-5 pt-5 space-y-5">
            <Text className="text-3xl font-PoppinsSemiBold my-5">
              Appointments
            </Text>
            <TouchableOpacity
              style={styles.shadow}
              className=" flex p-4 rounded-xl bg-white flex-row justify-center items-center"
              onPress={() => router.push("/(root)/book")}
            >
              <Icon name="plus" size={30} color="#000" />
              <Text className="font-PoppinsSemiBold text-gray-700 text-xl">
                Book a new appointment
              </Text>
            </TouchableOpacity>

            <Text className="text-2xl pt-5 tracking-tight text-gray-900 font-PoppinsSemiBold">
              Your Appointments
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
    shadowRadius: 20, // Increase radius for a softer look
    elevation: 4, // Lower elevation for a less pronounced shadow
  },
});

export default Page;
