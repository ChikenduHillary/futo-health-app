import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { useState, useCallback } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

const Chat = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex items-center justify-center mt-20 w-full">
          <Image
            source={icons.futoIcon}
            height={100}
            width={100}
            alt="futo logo"
            className=""
          />
          <Text className="text-2xl text-gray-800 font-Poppins mt-7">
            Futo Medicals
          </Text>
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
            onPress={onSignInPress}
            className="mt-6"
          />

          <Link
            href={"/(auth)/sign-up"}
            className="text-lg text-general-200 mt-10 text-center"
          >
            <Text className="font-Poppins">Dont have an account?</Text>
            <Text className="text-blue-500 font-Poppins">Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
