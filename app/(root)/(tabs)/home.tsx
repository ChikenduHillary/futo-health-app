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
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";

import Frame from "@/assets/icons/frame.svg";

const SearchInput = ({ onSearch }: any) => {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => {
    setSearchText("");
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  return (
    <View className="flex-row items-center bg-[#FAFAFA] rounded-lg p-4 mt-3">
      <Image source={icons.search} alt="search" className="w-8 h-8" />
      <TextInput
        className="flex-1 text-base text-gray-800"
        placeholder="Search doctor or health issue"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
        style={{
          fontSize: 19,
          fontWeight: "bold",
          marginLeft: 5,
          letterSpacing: 1,
          fontFamily: "Poppins",
        }}
      />
      {searchText ? (
        <TouchableOpacity onPress={handleClear}>
          <Text className="text-gray-500 ml-2">X</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const Page = () => {
  const { user } = useUser();
  console.log(user?.firstName, user?.imageUrl);
  const handleSearch = (query: any) => {
    console.log("Search query:", query);
  };

  return (
    <SafeAreaView className="bg-white min-h-full pt-10">
      <FlatList
        data={schedules}
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
            </View>

            <View className="flex flex-row justify-between border-t-[0.8px] pt-5 mt-5 border-gray-200">
              <View className="flex flex-row gap-1 items-center">
                <Image source={icons.calenderGray} className="w-5 h-5" />
                <Text className="text-gray-500 text-xl font-Poppins">
                  Sunday, 11 June
                </Text>
              </View>
              <View className="flex flex-row gap-1 items-center justify-center">
                <Image source={icons.clockGray} className="w-5 h-5" />
                <Text className="text-gray-500 text-lg font-Poppins">
                  11:00 - 12:00 AM
                </Text>
              </View>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="px-5 space-y-5">
            <View className="flex flex-row justify-between items-end pb-5">
              <View>
                <Text className="text-gray-400 text-xl font-Poppins">
                  Hello
                </Text>
                <Text className="text-3xl font-semibold font-PoppinsSemiBold">
                  {user?.fullName}
                </Text>
              </View>
              <Image
                source={{ uri: user?.imageUrl }}
                className="rounded-full w-16 h-16"
              />
            </View>

            <View className="bg-green-500 rounded-xl p-7">
              <View className="flex flex-row items-center gap-5">
                <Image
                  source={icons.image}
                  className="rounded-full w-16 h-16"
                />
                <View>
                  <Text className="text-white text-2xl font-PoppinsBold">
                    Dr. Imran Syahir
                  </Text>
                  <Text className="text-white font-Poppins">
                    General Doctor
                  </Text>
                </View>
              </View>

              <View className="flex flex-row justify-between border-t-[0.8px] pt-5 mt-5 border-gray-200">
                <View className="flex flex-row gap-1 items-center">
                  <Image source={icons.calender} className="w-5 h-5" />
                  <Text className="text-white text-xl font-Poppins">
                    Sunday, 12 June
                  </Text>
                </View>
                <View className="flex flex-row gap-1 items-center justify-center">
                  <Image source={icons.clock} className="w-5 h-5" />
                  <Text className="text-white text-lg font-Poppins pt-1">
                    11:00 - 12:00 AM
                  </Text>
                </View>
              </View>
            </View>

            {/* <View className="w-full">
              <SearchInput onSearch={handleSearch} />
            </View>

            <View className="flex flex-row justify-between">
              {homeIcons.map(({ icon, text }) => (
                <View key={text} className="items-center">
                  <View className="p-5 rounded-full bg-[#FAFAFA]">
                    <Image source={icon} className="w-8 h-8" />
                  </View>
                  <Text className="text-gray-400 font-semibold font-Poppins text-center text-lg">
                    {text}
                  </Text>
                </View>
              ))}
            </View> */}
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
