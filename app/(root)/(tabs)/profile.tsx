import { icons } from "@/constants";
import React, { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignedIn, useAuth, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import CustomButton from "@/components/CustomButton";
import axios from "axios";

interface DoctorResponse {
  role: "Doctor";
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
    phoneNumber: string;
    dateOfBirth: string;
    __v: number;
  };
}

const Page = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [dataBaseUser, setDataBaseUser] = useState<DoctorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `https://futo-health-app-backend.onrender.com/api/users/${user?.emailAddresses[0]?.emailAddress}`
        );
        if (response?.data) setDataBaseUser(response.data);
      } catch (error) {
        console.log("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserInDatabase();
  }, [user]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0096FF" />
        <Text className="mt-4 text-gray-600 font-Poppins">
          Loading profile...
        </Text>
      </View>
    );
  }

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
            {dataBaseUser?.user.name}
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
            <Text className="text-gray-600 font-PoppinsSemiBold text-sm">
              +234 {dataBaseUser?.user.phoneNumber}
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
            <Text className="text-gray-600 font-PoppinsSemiBold text-sm">
              {dataBaseUser?.user.dateOfBirth
                ? new Date(dataBaseUser.user.dateOfBirth).toLocaleDateString()
                : "Date of birth not available"}
            </Text>
          </View>
        </View>

        <CustomButton
          title={isSigningOut ? "Signing Out..." : "Log Out"}
          className="mt-10"
          bgVariant="outline"
          textVariant="outline"
          disabled={isSigningOut}
          onPress={handleSignOut}
        />
      </View>
    </SafeAreaView>
  );
};

export default Page;
