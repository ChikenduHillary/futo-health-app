import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Button } from "react-native";
import { useMemo, useRef, useState } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import PhoneInput from "react-native-phone-number-input";
import CustomButton from "@/components/CustomButton";
import RadioGroup from "react-native-radio-buttons-group";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Link } from "expo-router";

const Chat = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showSuccessModel, setShowSuccessModel] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneInput = useRef(null);
  const [verification, setVerification] = useState({
    state: "",
    error: "",
    code: "",
  });

  const radioButtons = useMemo(
    () => [
      {
        id: "1", // acts as primary key, should be unique and non-empty string
        label: "Male",
        value: "male",
      },
      {
        id: "2",
        label: "Female",
        value: "female",
      },
    ],
    []
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const onSignUpPress = async () => {};

  const onPressVerify = async () => {};

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex items-center justify-center mt-20 w-full">
          <Text className="text-4xl my-10 self-start ml-5">Onboarding</Text>
        </View>

        <View className="p-5">
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          <InputField
            label="Date of Birth"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="NG"
            layout="first"
            onChangeText={(text: string) => setPhoneNumber(text)}
            onChangeFormattedText={(formattedText) => {
              console.log(formattedText);
            }}
            autoFocus
          />

          {/* <View>
            <Button title="Show Date Picker" onPress={showDatePicker} />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View> */}

          {/* <View className="w-full flex items-start">
            <Text className="text-lg">Gender</Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
            />
          </View> */}

          <InputField
            label="Health Information"
            placeholder="(optional)"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          <InputField
            label="Pre-existing Conditions"
            placeholder="(optional) but usefull for doctors"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          <InputField
            label="Medical history"
            placeholder="(optional)"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <Link
            href={"/(auth)/sign-in"}
            className="text-lg text-general-200 mt-10 text-center"
          >
            <Text>Already have an account?</Text>
            <Text className="text-blue-500">Log In</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
