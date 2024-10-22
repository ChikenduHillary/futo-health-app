import React from "react";
import { FlatList, ScrollView, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { homeIcons, icons } from "@/constants";
import Frame from "@/assets/icons/frame.svg";

const SearchInput = ({ onSearch }: { onSearch: (query: string) => void }) => {
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
      <Image
        source={icons.search}
        alt="search"
        height={100}
        width={100}
        className="w-8 h-8"
      />

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
        }}
      />

      {/* Clear Button */}
      {searchText ? (
        <TouchableOpacity onPress={handleClear}>
          {/* <Icon name="close-circle" size={20} color="#666" className="ml-2" /> */}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const Page = () => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Perform search logic here
  };
  return (
    <SafeAreaView className="bg-white min-h-full px-5 pt-10">
      <ScrollView className="space-y-5">
        <View className="flex flex-row justify-between items-end pb-5">
          <View>
            <Text className="text-gray-400 text-xl">Hello</Text>
            <Text className="text-3xl font-semibold">Hi Jerry</Text>
          </View>
          <Frame width={70} height={70} />
        </View>

        <View className="bg-green-500 rounded-xl p-7">
          <View className="flex">
            <View className="flex flex-row items-center gap-5">
              <Image
                source={icons.image}
                width={100}
                height={100}
                className="rounded-full w-16 h-16"
              />
              <View>
                <Text className="text-white font-bold text-2xl">
                  Dr.Imran Syahir
                </Text>
                <Text className="text-white">General Doctor</Text>
              </View>
            </View>
          </View>

          <View className="flex flex-row justify-between border-t-[0.8px] pt-5 mt-5 border-gray-200">
            <View className="flex flex-row gap-1 items-center">
              <Image
                source={icons.calender}
                width={100}
                height={100}
                className="w-5 h-5"
              />
              <Text className="text-white text-xl">Sunday, 12 June</Text>
            </View>
            <View className="flex flex-row gap-1 items-center">
              <Image
                source={icons.clock}
                width={100}
                height={100}
                className="w-5 h-5"
              />
              <Text className="text-white text-lg">11:00 - 12:00 AM</Text>
            </View>
          </View>
        </View>

        <View className="w-full">
          <SearchInput onSearch={handleSearch} />
        </View>

        <View className="flex flex-row justify-between">
          {homeIcons.map(({ icon, text }) => (
            <View key={text}>
              <View className="p-5 rounded-full bg-[#FAFAFA]">
                <Image
                  source={icon}
                  width={200}
                  height={200}
                  className="w-8 h-8"
                />
              </View>
              <Text className="text-gray-400 font-semibold text-center text-lg">
                {text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;
