import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import Reminder from "../components/Reminder"; // Import the Reminder component

export default function Index() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <>
        <Redirect href="/(root)/(tabs)/home" />
        {/* Render the Reminder component conditionally based on the route or state */}
        {/* <Reminder /> Uncomment this line if you want to show reminders on the home page */}
      </>
    );
  }

  return <Redirect href="/(auth)/sign-in" />; // Updated redirect path
}
