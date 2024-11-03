import React from "react";
import { View, Text, Image } from "react-native";
import Person from "@/assets/icons/image.svg";
import CustomButton from "./CustomButton";

const Card = (hasDetails?: boolean) => {
  return (
    <View className="bg-green-500 rounded-xl p-7">
      <View className="flex">
        <View className="flex flex-row items-center gap-5">
          <Person width={120} height={40} />
          <View>
            <Text className="text-white font-bold text-2xl">
              Dr.Imran Syahir
            </Text>
            <Text className="text-white">General Doctor</Text>
          </View>
        </View>
      </View>

      <View className="flex flex-row justify-between border-t-[0.8px] pt-5 mt-5 border-gray-200">
        <View>
          <Text className="text-white text-xl">Sunday, 12 June</Text>
        </View>
        <Text className="text-white text-lg">11:00 - 12:00 AM</Text>
      </View>

      {hasDetails && <CustomButton title="Details" />}
    </View>
  );
};

export default Card;
