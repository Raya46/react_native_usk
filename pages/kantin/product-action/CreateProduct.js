import { View, Text, Alert, TextInput, Button, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import API_BASE_URL from "../../../constant/ip";

const CreateProduct = ({ navigation }) => {
  const [nameProduct, setnameProduct] = useState("");
  const [priceProduct, setpriceProduct] = useState("");
  const [stockProduct, setstockProduct] = useState("");
  const [standProduct, setstandProduct] = useState("");
  const [displayPhoto, setdisplayPhoto] = useState();
  const [descProduct, setdescProduct] = useState("");
  const [categoryProduct, setcategoryProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const uploadPhoto = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      await savePhoto(result.assets[0].uri);
    } else {
      Alert.alert("you dont pick photo");
    }
  };

  const savePhoto = async (photo) => {
    setdisplayPhoto(photo);
  };

  const getCategories = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}kantin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setcategoryProduct(response.data.categories);
  };

  const createProduct = async () => {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", nameProduct);
    formData.append("price", priceProduct);
    formData.append("stock", stockProduct);
    formData.append("stand", standProduct);
    formData.append("photo", {
      uri: displayPhoto,
      type: "image/png",
      name: "productphoto.png",
    });
    formData.append("desc", descProduct);
    formData.append("categories_id", selectedCategory);
    await axios.post(`${API_BASE_URL}create-product`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    Alert.alert("success create product");
    navigation.navigate("HomeKantin", { successCreate: displayPhoto });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <ScrollView>
 <View className="container mx-auto">
      <View className="flex flex-col h-full w-full p-6">
        {displayPhoto ? (
          <Image
            className="w-40 h-40 object-cover rounded-lg self-center"
            source={{ uri: displayPhoto }}
          />
        ) : (
          <View className="w-40 h-40 rounded-lg bg-white border justify-center items-center self-center">
            <Text>Photo</Text>
            <Button title="pick photo" onPress={uploadPhoto} />
          </View>
        )}
        <Text>Name</Text>
        <TextInput
          className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
          value={nameProduct}
          onChangeText={(e) => setnameProduct(e)}
          placeholder="name"
        />
        <View className="flex flex-row justify-between">
          <View className="flex flex-col w-1/2 mr-2">
            <Text>Price</Text>
            <TextInput
              className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
              value={priceProduct}
              onChangeText={(e) => setpriceProduct(e)}
              placeholder="price"
            />
            <Text>Stock</Text>
            <TextInput
              className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
              value={stockProduct}
              onChangeText={(e) => setstockProduct(e)}
              placeholder="stock"
            />
          </View>
          <View className="flex flex-col w-1/2 mr-2">
            <Text>Stand</Text>
            <TextInput
              className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
              value={standProduct}
              onChangeText={(e) => setstandProduct(e)}
              placeholder="stand"
            />
            <Text>Category</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(item) => setSelectedCategory(item)}
            >
              {categoryProduct.map((value, index) => (
                <Picker.Item value={value.id} label={value.name} key={index} />
              ))}
            </Picker>
          </View>
        </View>

        <TextInput
          className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
          value={descProduct}
          onChangeText={(e) => setdescProduct(e)}
          placeholder="description"
        />

        <Button title="Create" onPress={createProduct} />
      </View>
      <Button title="Pick Photo" onPress={uploadPhoto} />
    </View>
    </ScrollView>
   
  );
};

export default CreateProduct;
