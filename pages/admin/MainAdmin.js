import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeAdmin from "./HomeAdmin";
import ReportPage from "../ReportPage";
import CategoryAdmin from "./CategoryAdmin";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const MainAdmin = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeAdmin"
        component={HomeAdmin}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({}) => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="ReportAdmin"
        component={ReportPage}
        options={{
          headerShown: false,
          tabBarLabel: "Report",
          tabBarIcon: ({}) => (
            <FontAwesome name="newspaper-o" size={22} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="CategoryAdmin"
        component={CategoryAdmin}
        options={{
          headerShown: false,
          tabBarLabel: "Category",
          tabBarIcon: ({}) => (
            <MaterialIcons name="category" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainAdmin;
