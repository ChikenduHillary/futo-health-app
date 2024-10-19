import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View } from "react-native";
import { useMemo, useState } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import RadioGroup from "react-native-radio-buttons-group";
import { Link, router } from "expo-router";

const Chat = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showSuccessModel, setShowSuccessModel] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [verification, setVerification] = useState({
    state: "",
    error: "",
    code: "",
  });

  const radioButtons = useMemo(
    () => [
      {
        id: "1", // acts as primary key, should be unique and non-empty string
        label: "Doctor",
        value: "doctor",
      },
      {
        id: "2",
        label: "Patient",
        value: "patient",
      },
    ],
    []
  );

  const onSignUpPress = async () => {
    router.push("/(auth)/onboarding");
  };

  const onPressVerify = async () => {};

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex items-center justify-center mt-40 w-full">
          <Text className="text-3xl">LOGO</Text>
          <Text className="text-lg text-gray-800 mt-5">Futo Medicals</Text>
          <Text className="text-3xl mt-10 self-start ml-5">SIGN UP</Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <View className="w-full flex items-start">
            <Text className="text-lg">Account type</Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
            />
          </View>

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
