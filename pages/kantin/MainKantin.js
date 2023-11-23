import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeKantin from "./HomeKantin";
import TransactionKantin from "./TransactionKantin";
import ReportPage from "../ReportPage";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const MainKantin = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeKantin"
        component={HomeKantin}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({}) => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="TransactionKantin"
        component={TransactionKantin}
        options={{
          headerShown: false,
          tabBarLabel: "Transaction",
          tabBarIcon: ({}) => (
            <FontAwesome name="exchange" size={24} color="black" />
          ),
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

export default MainKantin;
