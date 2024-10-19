import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View } from "react-native";
import { useState } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";

const Chat = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [verification, setVerification] = useState({
    state: "",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {};

  const onPressVerify = async () => {};

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex items-center justify-center mt-40 w-full">
          <Text className="text-3xl">LOGO</Text>
          <Text className="text-lg text-gray-800 mt-5">Futo Medicals</Text>
          <Text className="text-3xl mt-10 self-start ml-5">SIGN IN</Text>
        </View>

        <View className="p-5">
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

          <CustomButton
            title="Sign In"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <Link
            href={"/(auth)/sign-up"}
            className="text-lg text-general-200 mt-10 text-center"
          >
            <Text>Dont have an account?</Text>
            <Text className="text-blue-500">Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
