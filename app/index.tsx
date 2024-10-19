import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  return <Redirect href={"/(auth)/sign-up"} />;
}
