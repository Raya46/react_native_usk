import { View, Text, Button, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../constant/ip";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const HomeAdmin = ({ navigation, route }) => {
  const [loading, setloading] = useState(true);
  const [dataAdmin, setdataAdmin] = useState([]);
  const { userEdit, createUserCallback } = route.params || {};

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const getDataAdmin = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}getsiswa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setdataAdmin(response.data);
    setloading(false);
  };

  const deleteUser = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}user-admin-delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getDataAdmin();
  };

  const logout = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `${API_BASE_URL}logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await AsyncStorage.multiRemove(["token", "role"]);
      navigation.navigate("LoginPage");
    } catch (error) {
      await AsyncStorage.multiRemove(["token", "role"]);
      navigation.navigate("LoginPage");
    }
  };

  useEffect(() => {
    getDataAdmin();
    if (userEdit || createUserCallback) {
      getDataAdmin();
    }
  }, [userEdit, createUserCallback]);

  return (
    <View className="container mx-auto">
      {loading ? (
        <>
          <Text>...loading</Text>
          <Button title="logout" onPress={logout} />
        </>
      ) : (
        <View className="flex flex-col">
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-2 bg-white">
            <View className="flex flex-row items-center">
              <FontAwesome name="user-circle-o" size={24} color="black" />
              <Text className="ml-2">{dataAdmin.user.name} | Admin</Text>
            </View>
            <View className="flex flex-row">
              <Button
                title="create user"
                onPress={() => navigation.navigate("CreateUser")}
              />
              <Button title="logout" onPress={logout} />
            </View>
          </View>
          <View className="px-3">
            <View className="flex flex-row bg-white rounded-lg my-4 p-4 justify-around">
              <View className="flex flex-col items-center">
                <FontAwesome name="shopping-cart" size={24} color="black" />
                <Text>{dataAdmin.products.length}</Text>
                <Text>Products</Text>
              </View>
              <View className="border border-gray-300"></View>
              <View className="flex flex-col items-center">
                <Entypo name="wallet" size={24} color="black" />
                <Text>{dataAdmin.wallet_count}</Text>
                <Text> TopUp </Text>
              </View>
              <View className="border border-gray-300"></View>
              <View className="flex flex-col items-center justify-center">
                <FontAwesome name="user-circle-o" size={24} color="black" />
                <Text>{dataAdmin.users.length}</Text>
                <Text> User</Text>
              </View>
            </View>
          </View>
          <FlatList
            className="h-full"
            data={dataAdmin.users}
            renderItem={({ item, index }) => (
              <View
                key={index}
                className="flex flex-row justify-between items-center mx-4 bg-white rounded p-4 mt-2"
              >
                <View className="flex flex-row items-center">
                  <FontAwesome name="user-circle-o" size={24} color="black" />
                  <Text className="ml-2 text-center">{item.name}</Text>
                </View>

                <Text className="text-center">{item.roles.name}</Text>
                <View className="flex flex-row justify-between">
                  <Button title="Delete" onPress={() => deleteUser(item.id)} />
                  <Button
                    title="Edit"
                    onPress={() =>
                      navigation.navigate("EditUser", {
                        id: item.id,
                      })
                    }
                  />
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default HomeAdmin;
