import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../../constant/ip";

const CreateCategory = ({ navigation }) => {
  const [name, setname] = useState("");

  const createCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}category-admin-store`,
      {
        name: name,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigation.navigate("CategoryAdmin", {
      createCategoryCallback: name,
    });
  };

  return (
    <View className="p-4 flex flex-col justify-center h-full w-full">
      <View className="bg-white p-4">
        <Text className="text-lg">Create Category For Product</Text>
        <TextInput
          className="h-12 rounded-md px-6 my-4 text-lg bg-gray-200"
          value={name}
          placeholder="Category"
          onChangeText={(e) => setname(e)}
        />
        <Button title="create" onPress={createCategory} />
      </View>
    </View>
  );
};

export default CreateCategory;
