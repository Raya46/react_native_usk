import { View, Text, Image, Button, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../constant/ip";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
const Card = ({
  id,
  name,
  photo,
  stand,
  stock,
  price,
  role,
  navigation,
  deleteProduct,
  saldo,
}) => {
  const [quantity, setquantity] = useState("1");

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const addToCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (saldo === 0) {
        Alert.alert("Isi saldo kamu terlebih dahulu");
      } else {
        setquantity("1");
        Alert.alert(
          "Success",
          "Cek Cart sekarang!!",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("CartUser", {
                  successCart: [quantity, price, id],
                });
              },
            },
          ],
          { cancelable: false }
        );

        await axios.post(
          `${API_BASE_URL}addcart`,
          {
            products_id: id,
            price: price,
            quantity: parseInt(quantity),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {}
  };

  return (
    <View className="bg-white rounded-lg shadow-md my-2 mx-2">
      <Image
        source={{ uri: photo }}
        className="w-full h-40 rounded-lg mb-2 object-cover"
      />
      <View className="flex flex-col p-3 w-full">
        <Text className="text-gray-500">{name}</Text>
        <Text className="my-1 font-bold text-xl">{formatToRp(price)}</Text>
        <View className="flex flex-row justify-between items-center mt-2">
          <View className="flex flex-row items-center">
            <Entypo name="shop" size={18} color="gray" />
            <Text className="ml-2 text-gray-500">{stand}</Text>
          </View>
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="shopping" size={18} color="gray" />
            <Text className="ml-2 text-gray-500">{stock}</Text>
          </View>
        </View>
        <Text></Text>
        {role === "siswa" ? (
          <View className="flex flex-row items-center justify-center mt-2">
            <TextInput
              className="h-9 w-10 rounded-md text-lg bg-gray-200 mr-2 text-center"
              value={quantity}
              onChangeText={(e) => setquantity(e)}
            />
            <Button title="Add to cart" onPress={() => addToCart(quantity)} />
          </View>
        ) : (
          <View className="flex flex-row items-center justify-center">
            <Button
              title="Edit"
              onPress={() => navigation.navigate("EditProduct", { id: id })}
            />
            <View className="bg-white p-6"></View>
            <Button title="Delete" onPress={() => deleteProduct(id)} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Card;
