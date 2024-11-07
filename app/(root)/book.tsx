import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Platform,
  Button,
} from "react-native";
import { useState } from "react";
import InputField from "@/components/InputField";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import CustomButton from "@/components/CustomButton";

const Book = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [date, setDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<"date" | "time">("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // iOS keeps the picker open, so control it this way
    setDate(currentDate);
  };

  const showMode = (currentMode: "date" | "time") => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const onSignUpPress = async () => {};

  const onPressVerify = async () => {};

  return (
    <SafeAreaView>
      <ScrollView className="p-5">
        <View className="flex mt-3 flex-row">
          {/* <Icon name="arrow-back" size={24} color="#000" /> */}
          <Text className="font-PoppinsSemiBold text-3xl">New appointment</Text>
        </View>

        <View className="w-full mt-10">
          <InputField label="Title" placeholder="Whats the problem" />

          <View className="mt-3">
            <Text className="font-Poppins text-lg">Description</Text>
            <TextInput
              className="h-40 p-3 border border-gray-300 rounded-lg text-base"
              value={text}
              onChangeText={setText}
              placeholder="Type your message here..."
              multiline={true}
              textAlignVertical="top" // Aligns text at the top
            />
          </View>

          <View>
            <View className="space-y-5 mt-5">
              <CustomButton
                onPress={showDatepicker}
                title="Pick Date"
                bgVariant="outline"
                textVariant="outline"
              />
              <CustomButton
                onPress={showTimepicker}
                title="Pick Time"
                bgVariant="outline"
                textVariant="outline"
              />
            </View>

            <Text className="text-xl text-gray-800 text-center my-4 font-PoppinsSemiBold mt-10">
              <Text className="text-gray-700 font-Poppins">Selected:</Text>{" "}
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </Text>
            {show && (
              <DateTimePicker
                value={date}
                mode={mode}
                display="default" // Options: 'default', 'spinner', 'calendar', 'clock'
                onChange={onChange}
              />
            )}
          </View>

          <CustomButton title="Book Now" className="mt-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Book;
