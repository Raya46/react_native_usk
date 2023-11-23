import {
  View,
  Text,
  Button,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../constant/ip";

const CartUser = ({ navigation, route }) => {
  const [dataHistory, setdataHistory] = useState([]);
  const [loading, setloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const currentTime = new Date();
  const seconds = currentTime.getSeconds();
  const { successCart } = route.params || {};

  const getDataHistory = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    setdataHistory(response.data);
    setloading(false);
  };

  const cancelCart = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}keranjang/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getDataHistory();
  };

  const payProduct = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.put(
        `${API_BASE_URL}pay-product`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getDataHistory();
      navigation.navigate("HomeUser", { getDataSiswaCallBack: seconds });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataHistory();
    if (successCart == successCart || successCart !== successCart) {
      getDataHistory();
    }
  }, [successCart]);

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const onRefresh = () => {
    getDataHistory();
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex flex-col h-full w-full p-4">
        {loading ? (
          <>
            <Text>...loading</Text>
          </>
        ) : (
          <View className="bg-white rounded-lg">
            <View className="p-4">
              <View
                className={
                  dataHistory.totalPrice > dataHistory.difference
                    ? `bg-red-400  rounded-xl p-4 justify-center items-center`
                    : `bg-green-400  rounded-xl p-4 justify-center items-center`
                }
              >
                <View className="flex flex-row items-center justify-center">
                  <Text className="text-white text-xl">
                    {formatToRp(dataHistory.totalPrice ?? "")}
                  </Text>
                </View>
                <Text className="text-white text-xs">Total Price</Text>
              </View>
            </View>
            <View className="flex flex-col p-4">
              <View className="flex flex-row justify-between">
                <Text className="text-lg">Your Cart</Text>
                <Text>{dataHistory.keranjanglength} Result</Text>
              </View>

              {dataHistory.transactionsKeranjang.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3"
                >
                  <Text>
                    {item.products.name} | {formatToRp(item.price)} |{" "}
                    {item.quantity}x
                  </Text>
                  <Button title=" X " onPress={() => cancelCart(item.id)} />
                </View>
              ))}

              {dataHistory.totalPrice > dataHistory.difference ? (
                <Text className="text-center bg-red-400 p-2 rounded-md text-white">
                  Saldo mu kurang, saldo kamu:{" "}
                  {formatToRp(dataHistory.difference)}
                </Text>
              ) : (
                <Button title="buy" onPress={payProduct} />
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CartUser;
