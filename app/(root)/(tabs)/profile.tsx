import { icons } from "@/constants";
import React from "react";
import { Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import CustomButton from "@/components/CustomButton";

const Page = () => {
  const { user } = useUser();

  return (
    <SafeAreaView className="p-5 bg-white min-h-full">
      <View>
        <Text className="font-PoppinsSemiBold text-3xl mt-5">User Profile</Text>
      </View>

      <View className="mt-20 w-full flex items-center">
        <View>
          <Image
            source={{ uri: user?.imageUrl }}
            width={100}
            height={100}
            className="rounded-full w-40 h-40 self-center"
          />
          <Text className="font-PoppinsBold text-center text-3xl text-gray-800 mt-5">
            Chikendu Hillary
          </Text>
          <Text className="font-Poppins text-gray-600 text-lg text-center">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        <View className="w-full mt-16 space-y-3">
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-5">
              <View className="bg-gray-100 flex items-center justify-center rounded-r-full h-14 w-14">
                <Image
                  source={icons.mobile}
                  width={100}
                  height={100}
                  className="h-8 w-8"
                />
              </View>
              <Text className="font-Poppins text-gray-500 text-lg">
                Mobile Number
              </Text>
            </View>
            <Text className="text-gray-600 font-PoppinsSemiBold text-lg">
              +234 903635900
            </Text>
          </View>

          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-5">
              <View className="bg-gray-100 flex items-center justify-center rounded-r-full h-14 w-14">
                <Image
                  source={icons.date}
                  width={50}
                  height={50}
                  className="h-6 w-6"
                />
              </View>
              <Text className="font-Poppins text-gray-500 text-lg">
                Date of Birth
              </Text>
            </View>
            <Text className="text-gray-600 font-PoppinsSemiBold text-lg">
              6th April 2024
            </Text>
          </View>
        </View>

        <CustomButton
          title="Edit Profile"
          className="mt-10"
          bgVariant="outline"
          textVariant="outline"
        />
      </View>
    </SafeAreaView>
  );
};

export default Page;
