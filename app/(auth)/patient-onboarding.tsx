import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useMemo, useRef, useState } from "react";
import InputField from "@/components/InputField";
import PhoneInput from "react-native-phone-number-input";
import CustomButton from "@/components/CustomButton";
import RadioGroup from "react-native-radio-buttons-group";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router } from "expo-router";

const Chat = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    healthInfo: "",
    conditions: "",
    history: "",
    gender: "",
  });
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const phoneInput = useRef(null);
  const { user } = useUser();

  const radioButtons = useMemo(
    () => [
      { id: "1", label: "Male", value: "male" },
      { id: "2", label: "Female", value: "female" },
    ],
    []
  );

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (date: Date) => {
    setForm({ ...form, dateOfBirth: date.toISOString() });
    hideDatePicker();
  };

  const onboard = async () => {
    try {
      setLoading(true);

      const data = {
        ...form,
        email: user?.emailAddresses[0]?.emailAddress || form.email,
      };

      console.log("Submitting data:", data);

      const response = await axios.post(
        "https://futo-health-app-backend.onrender.com/api/patients",
        data
      );

      router.push("/(root)/(tabs)/home");
      console.log("Profile created:", response.data);
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="p-5">
        <View className="flex items-center justify-center mt-20 w-full">
          <Text className="text-xl text-zinc-600 self-start">Patient</Text>
          <Text className="text-4xl mb-10 self-start">Onboarding</Text>
        </View>

        {/* Full Name */}
        <InputField
          label="Full Name"
          placeholder="Enter your full name"
          value={form.name}
          onChangeText={(value) => setForm({ ...form, name: value })}
        />

        {/* Email */}
        <InputField
          label="Email"
          placeholder="Enter your email"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />

        {/* Phone Number */}
        <View className="mb-5">
          <Text className="text-lg mb-2">Phone Number</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={form.phoneNumber}
            defaultCode="NG"
            layout="first"
            onChangeText={(value) => setForm({ ...form, phoneNumber: value })}
            autoFocus
          />
        </View>

        {/* Date of Birth */}
        <TouchableOpacity onPress={showDatePicker}>
          <View pointerEvents="none">
            <InputField
              label="Date of Birth"
              placeholder="Select your date of birth"
              value={
                form.dateOfBirth
                  ? new Date(form.dateOfBirth).toLocaleDateString()
                  : ""
              }
              editable={false}
            />
          </View>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />

        {/* Gender */}
        <View className="w-full flex items-start mt-4">
          <Text className="text-lg mb-2">Gender</Text>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={(id) => {
              setSelectedId(id);
              const selectedButton = radioButtons.find((btn) => btn.id === id);
              if (selectedButton) {
                setForm({ ...form, gender: selectedButton.value });
              }
            }}
            selectedId={selectedId}
          />
        </View>

        {/* Health Information */}
        <InputField
          label="Health Information"
          placeholder="(optional)"
          value={form.healthInfo}
          onChangeText={(value) => setForm({ ...form, healthInfo: value })}
        />

        {/* Pre-existing Conditions */}
        <InputField
          label="Pre-existing Conditions"
          placeholder="(optional) but useful for doctors"
          value={form.conditions}
          onChangeText={(value) => setForm({ ...form, conditions: value })}
        />

        {/* Medical History */}
        <InputField
          label="Medical History"
          placeholder="(optional)"
          value={form.history}
          onChangeText={(value) => setForm({ ...form, history: value })}
        />

        {/* Submit Button */}
        <CustomButton
          title={loading ? "Creating Profile..." : "Create Profile"}
          onPress={onboard}
          disabled={loading}
          className="mt-6 mb-20"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
