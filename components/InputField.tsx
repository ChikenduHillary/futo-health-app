import { InputFieldProps } from "@/types/type";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Image,
} from "react-native";

const InputField = ({
  label,
  labelStyle,
  containerStyle,
  icon,
  inputStyle,
  secureTextEntry,
  iconStyle,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg mb-3 ${labelStyle}`}>{label}</Text>

          <View
            className={`flex flex-row justify-start items-center border relative rounded-full border-neutral-100 focus:border-primary ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}

            <TextInput
              className={`rounded-full p-4 text-[15px] flex-1 text-left ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
