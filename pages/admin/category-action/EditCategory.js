import { View, Text, TextInput, Button } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../../constant/ip";

const EditCategory = ({ navigation, route }) => {
  const [name, setname] = useState("");
  const [id, setid] = useState(0);
  const { pid } = route.params;
  const { pname } = route.params;

  const editCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}category-admin-update/${id}`,
      {
        name: name,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigation.navigate("CategoryAdmin", {
      editCategoryCallback: name,
    });
  };

  useEffect(() => {
    setname(pname);
    setid(pid);
  }, []);

  return (
    <View className="p-4 flex flex-col justify-center h-full w-full">
      <View className="bg-white p-4">
        <Text className="text-lg">Edit Category</Text>
        <TextInput
          className="h-12 rounded-md px-6 my-4 text-lg bg-gray-200"
          value={name}
          placeholder="Category"
          onChangeText={(e) => setname(e)}
        />
        <Button title="Edit" onPress={editCategory} />
      </View>
    </View>
  );
};

export default EditCategory;
