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
import { router } from "expo-router";

const Page = () => {
  return (
    <SafeAreaView className="bg-white min-h-full pt-10">
      <FlatList
        data={schedules}
        className=""
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
            <View className="w-4/6">
              <Text className="font-PoppinsSemiBold text-lg text-gray-800">
                Title
              </Text>
              <Text className="font-Poppins text-md text-gray-600">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio
                accusantium provident facere architecto vero quidem sequi,
              </Text>
            </View>
            <View className="w-1/6">
              <Text className="font-Poppins text-center text-gray-600">
                8:30pm
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View className="px-5 pt-5 space-y-5">
            <Text className="text-3xl font-PoppinsSemiBold my-5">
              Notification
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Page;
