import React, { useEffect, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";
import LoginPage from "./pages/LoginPage";
import HomeUser from "./pages/user/HomeUser";
import HistoryUser from "./pages/user/HistoryUser";
import MainKantin from "./pages/kantin/MainKantin";
import MainAdmin from "./pages/admin/MainAdmin";
import MainBank from "./pages/bank/MainBank";
import MainUser from "./pages/user/MainUser";
import DownloadPage from "./pages/DownloadPage";
import EditProduct from "./pages/kantin/product-action/EditProduct";
import EditCategory from "./pages/admin/category-action/EditCategory";
import EditUser from "./pages/admin/user-action/EditUser";
import CartUser from "./pages/user/CartUser";
import CreateProduct from "./pages/kantin/product-action/CreateProduct";
import CreateUser from "./pages/admin/user-action/CreateUser";
import CreateCategory from "./pages/admin/category-action/CreateCategory";
import ReportPage from "./pages/ReportPage";

const App = () => {
  const Stack = createNativeStackNavigator();
  const navigationRef = useRef();
  const checkAuth = async () => {
    const role = await AsyncStorage.getItem("role");
    const token = await AsyncStorage.getItem("token");
    console.log(role, token);
    if (token && role !== null) {
      switch (role) {
        case "admin":
          navigationRef.current?.navigate("MainAdmin");
          break;
        case "kantin":
          navigationRef.current?.navigate("MainKantin");
          break;
        case "bank":
          navigationRef.current?.navigate("MainBank");
          break;
        default:
          navigationRef.current?.navigate("MainUser");
          break;
      }
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="LoginPage"
        screenOptions={{ animation: "fade" }}
      >
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeUser"
          component={HomeUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="HistoryUser" component={HistoryUser} />
        <Stack.Screen
          name="MainKantin"
          component={MainKantin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainAdmin"
          component={MainAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainBank"
          component={MainBank}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MainUser"
          component={MainUser}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="DownloadPage" component={DownloadPage} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name="EditCategory" component={EditCategory} />
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="CartUser" component={CartUser} />
        <Stack.Screen name="CreateProduct" component={CreateProduct} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="CreateCategory" component={CreateCategory} />
        <Stack.Screen name="ReportPage" component={ReportPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
