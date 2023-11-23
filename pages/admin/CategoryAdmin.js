import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../constant/ip";

const CategoryAdmin = ({ navigation, route }) => {
  const [dataCategory, setdataCategory] = useState([]);
  const [loading, setloading] = useState(true);
  const { createCategoryCallback, editCategoryCallback } = route.params || {};

  const deleteCategory = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}category-admin-delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getDataCategory();
  };

  const getDataCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}category-admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setdataCategory(response.data.categories);
    setloading(false);
  };

  useEffect(() => {
    getDataCategory();
    if (createCategoryCallback || editCategoryCallback) {
      getDataCategory();
    }
  }, [createCategoryCallback, editCategoryCallback]);

  return (
    <View className="container mx-auto">
      {loading ? (
        <Text>loading</Text>
      ) : (
        <View className="flex flex-col h-full w-full">
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-2 bg-white">
            <Text>List of Category</Text>
            <Button
              title="Create Category"
              onPress={() => navigation.navigate("CreateCategory")}
            />
          </View>
          <View className="p-4">
            {dataCategory.map((value, index) => (
              <View
                className="flex flex-row justify-between items-center bg-white border border-gray-300 rounded-lg p-3 mt-2"
                key={index}
              >
                <Text>Category: {value.name}</Text>
                <View className="flex flex-row">
                  <Button
                    title="Edit"
                    onPress={() =>
                      navigation.navigate("EditCategory", {
                        pid: value.id,
                        pname: value.name,
                      })
                    }
                  />
                  <Button
                    title="Delete"
                    onPress={() => deleteCategory(value.id)}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default CategoryAdmin;
