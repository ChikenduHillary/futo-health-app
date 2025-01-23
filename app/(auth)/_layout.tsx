import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="doctor-onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="account-type" options={{ headerShown: false }} />
      <Stack.Screen
        name="patient-onboarding"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
