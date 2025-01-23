import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useMemo, useState, useRef } from "react";
import InputField from "@/components/InputField"; // Replace with your InputField component
import PhoneInput from "react-native-phone-number-input";
import CustomButton from "@/components/CustomButton"; // Replace with your CustomButton component
import RadioGroup from "react-native-radio-buttons-group";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router } from "expo-router";

const Onboarding = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    specialization: "",
    gender: "",
  });
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const phoneInput = useRef(null);

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
        phoneNumber: form.phoneNumber,
        email: user?.emailAddresses[0]?.emailAddress,
      };

      console.log({ data });

      const response = await axios.post(
        "https://futo-health-app-backend.onrender.com/api/doctors",
        data
      );

      router.push("/(root)/(tabs)/home");
      console.log(response);
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex items-center justify-center mt-20 w-full">
          <Text className="text-xl text-zinc-600 self-start ml-5">Doctors</Text>
          <Text className="text-4xl self-start ml-5 mb-5">Onboarding</Text>
        </View>

        <View className="p-5">
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

          {/* Specialization */}
          <InputField
            label="Specialization"
            placeholder="Enter your specialization"
            value={form.specialization}
            onChangeText={(value) =>
              setForm({ ...form, specialization: value })
            }
          />

          {/* Gender */}
          <View className="w-full flex items-start mt-4">
            <Text className="text-lg mb-2">Gender</Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={(id) => {
                setSelectedId(id); // Update the selectedId
                const selectedButton = radioButtons.find(
                  (btn) => btn.id === id
                ); // Find the selected button
                if (selectedButton) {
                  setForm({ ...form, gender: selectedButton.value }); // Update the gender in the form state
                }
              }}
              selectedId={selectedId}
            />
          </View>

          {/* Submit Button */}
          <CustomButton
            title={loading ? "Creating Profile..." : "Create Profile"}
            onPress={onboard}
            disabled={loading}
            className="mt-6"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;
