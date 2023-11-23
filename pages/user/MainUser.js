import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeUser from "./HomeUser";
import HistoryUser from "./HistoryUser";
import CartUser from "./CartUser";
import ReportPage from "../ReportPage";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const MainUser = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeUser"
        component={HomeUser}
        options={{
          headerShown: false,
          tabBarIcon: ({}) => <AntDesign name="home" size={24} color="black" />,
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="HistoryUser"
        component={HistoryUser}
        options={{
          headerShown: false,
          tabBarIcon: ({}) => (
            <Octicons name="history" size={21} color="black" />
          ),
          tabBarLabel: "History",
        }}
      />
      <Tab.Screen
        name="CartUser"
        component={CartUser}
        options={{
          headerShown: false,
          tabBarIcon: ({}) => (
            <Feather name="shopping-cart" size={22} color="black" />
          ),
          tabBarLabel: "Cart",
        }}
      />
      <Tab.Screen
        name="ReportPage"
        component={ReportPage}
        options={{
          headerShown: false,
          tabBarIcon: ({}) => (
            <FontAwesome name="user-circle-o" size={24} color="black" />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainUser;
