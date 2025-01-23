import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Role = "patient" | "doctor";

type RoleSelectionScreenProps = {
  onRoleSelected: (role: Role) => void;
};

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onRoleSelected,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelection = () => {
    if (selectedRole == "patient") {
      router.push("/(auth)/patient-onboarding");
    } else {
      router.push("/(auth)/doctor-onboarding");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-8">Select Your Role</Text>

      <TouchableOpacity
        className={`w-4/5 p-4 mb-4 border-2 border-blue-500 rounded-lg items-center ${
          selectedRole === "patient" ? "bg-blue-500" : ""
        }`}
        onPress={() => setSelectedRole("patient")}
      >
        <Text
          className={`text-lg ${
            selectedRole === "patient" ? "text-white" : "text-blue-500"
          }`}
        >
          Patient
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-4/5 p-4 mb-4 border-2 border-blue-500 rounded-lg items-center ${
          selectedRole === "doctor" ? "bg-blue-500" : ""
        }`}
        onPress={() => setSelectedRole("doctor")}
      >
        <Text
          className={`text-lg ${
            selectedRole === "doctor" ? "text-white" : "text-blue-500"
          }`}
        >
          Doctor
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-4/5 p-4 rounded-lg items-center ${
          selectedRole ? "bg-green-500" : "bg-gray-400"
        }`}
        onPress={handleRoleSelection}
        disabled={!selectedRole}
      >
        <Text className="text-white text-lg font-bold">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelectionScreen;
