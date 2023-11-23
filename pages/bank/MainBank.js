import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeBank from "./HomeBank";
import ReportPage from "../ReportPage";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const MainBank = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeBank"
        component={HomeBank}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({}) => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="ReportPage"
        component={ReportPage}
        options={{
          headerShown: false,
          tabBarLabel: "Report",
          tabBarIcon: ({}) => (
            <FontAwesome name="newspaper-o" size={22} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainBank;
