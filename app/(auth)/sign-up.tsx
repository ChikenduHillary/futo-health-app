import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { useMemo, useState } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import Modal from "react-native-modal";

const Chat = () => {
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });
  const [showSuccessModel, setShowSuccessModel] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        setVerification({
          ...verification,
          state: "pending",
          error: "Verification failed",
        });
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setVerification({
        ...verification,
        state: "pending",
        error: err.errors[0].longMessage,
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex items-center justify-center mt-20 w-full">
          <Image
            source={icons.futoIcon}
            height={100}
            width={100}
            alt="futo icon"
          />
          <Text className="text-2xl text-gray-800 mt-5 font-Poppins">
            Futo Medicals
          </Text>
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

          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <Link
            href={"/(auth)/sign-in"}
            className="text-lg text-general-200 mt-10 text-center"
          >
            <Text className="font-Poppins">Already have an account?</Text>
            <Text className="text-blue-500 font-Poppins ml-1">Log In</Text>
          </Link>
        </View>

        <Modal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModel(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-PoppinsBold mb-2">Verification</Text>
            <Text className="font-Poppins mb-5">
              We've sent a verification code to {form.email}
            </Text>

            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />

            {verification.error && (
              <Text className="text-red-500 font-Poppins text-sm mt-1">
                {verification.error}
              </Text>
            )}

            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5"
            />
          </View>
        </Modal>

        <Modal isVisible={showSuccessModel}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={icons.check2}
              className="w-[110px] h-[110px] mx-auto my-5"
            />

            <Text className="text-3xl font-PoppinsBold text-center">
              Verified
            </Text>

            <Text className="text-base text-gray-400 font-Poppins text-center">
              You have successfully verified your account
            </Text>

            <CustomButton
              title="Browse Home"
              onPress={() => {
                setShowSuccessModel(false);
                router.push("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
