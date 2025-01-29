import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { ImageSourcePropType, View, Image, Text } from "react-native";

const TabIcon = ({
  source,
  focused,
  activeSource,
  title,
}: {
  activeSource: ImageSourcePropType;
  title: string;
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${
      focused ? "bg-general-300" : ""
    }`}
  >
    <View
      className={`rounded-xl flex p-2 h-12 items-center justify-center ${
        focused ? " " : ""
      }`}
    >
      <Image
        source={focused ? activeSource : source}
        resizeMode="contain"
        className="w-7 h-7"
      />
      {focused && (
        <Text className="text-[#22C55E] h-7 pt-1 truncate w-full font-PoppinsSemiBold tracking-tight">
          {title}
        </Text>
      )}
    </View>
  </View>
);

const Layout = () => (
  <Tabs
    screenOptions={{
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "white",
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: "#fff",
        paddingBottom: 15,

        height: 78,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
      },
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: "Home",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={icons.home}
            title="Home"
            activeSource={icons.homeActive}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="schedule"
      options={{
        title: "Schedule",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={icons.schedule}
            title="Schedule"
            activeSource={icons.scheduleActive}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="notifications"
      options={{
        title: "Notifications",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={icons.notification}
            title="Notifications"
            activeSource={icons.notificationActive}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={icons.profile}
            title="Profile"
            activeSource={icons.profileActive}
          />
        ),
      }}
    />
  </Tabs>
);

export default Layout;
