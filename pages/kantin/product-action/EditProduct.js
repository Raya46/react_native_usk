import { View, Text, TextInput, Image, Button, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import API_BASE_URL from "../../../constant/ip";

const EditProduct = ({ navigation, route }) => {
  const [nameProduct, setnameProduct] = useState("");
  const [descProduct, setdescProduct] = useState("");
  const [photoProduct, setphotoProduct] = useState("");
  const [standProduct, setstandProduct] = useState("");
  const [stockProduct, setstockProduct] = useState("");
  const [priceProduct, setpriceProduct] = useState("");
  const [categoryProduct, setcategoryProduct] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(0);
  const [loading, setloading] = useState(true);
  const { id } = route.params;

  const updateProduct = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(
      nameProduct,
      priceProduct,
      stockProduct,
      standProduct,
      photoProduct,
      selectedCategory
    );
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", nameProduct);
    formData.append("price", priceProduct);
    formData.append("stock", stockProduct);
    formData.append("stand", standProduct);
    formData.append("photo", {
      uri: photoProduct,
      type: "image/png",
      name: "productphoto.png",
    });
    formData.append("desc", descProduct);
    formData.append("categories_id", selectedCategory);

    const response = await axios.post(
      `${API_BASE_URL}product-update/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Update success:", response.data);

    navigation.navigate("HomeKantin", {
      successEdit: [
        nameProduct,
        descProduct,
        photoProduct,
        priceProduct,
        standProduct,
        stockProduct,
        selectedCategory,
      ],
    });
  };

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
      Alert.alert("u dont select any photo");
    }
  };

  const savePhoto = async (photo) => {
    setphotoProduct(photo);
    console.log(photo);
  };

  const getDataProduct = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}product-edit/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setnameProduct(response.data.products.name);
    setdescProduct(response.data.products.desc);
    setstandProduct(response.data.products.stand.toString());
    setstockProduct(response.data.products.stock.toString());
    setpriceProduct(response.data.products.price.toString());
    setcategoryProduct(response.data.categories);
    setphotoProduct(`http://192.168.5.56:8000${response.data.products.photo}`);
    setselectedCategory(response.data.products.categories_id);
    setloading(false);
  };

  useEffect(() => {
    getDataProduct();
  }, []);

  return (
    <ScrollView>
      <View className="container mx-auto">
        {loading ? (
          <Text>loading</Text>
        ) : (
          <View className="flex flex-col h-full w-full p-6">
            <Image
              source={{ uri: photoProduct }}
              className="w-40 h-40 object-cover rounded-lg self-center"
            />

            <View className="flex flex-row justify-center mt-2">
              <Button title="pick photo" onPress={uploadPhoto} />
            </View>
            <Text>Name</Text>
            <TextInput
              className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
              value={nameProduct}
              onChangeText={(e) => setnameProduct(e)}
            />
            <View className="flex flex-row justify-between">
              <View className="flex flex-col w-1/2 mr-2">
                <Text>Stock</Text>
                <TextInput
                  className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
                  value={stockProduct}
                  onChangeText={(e) => setstockProduct(e)}
                />
                <Text>Price</Text>
                <TextInput
                  className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
                  value={priceProduct}
                  onChangeText={(e) => setpriceProduct(e)}
                />
              </View>
              <View className="flex flex-col w-1/2 mr-2">
                <Text>Stand</Text>
                <TextInput
                  className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200 w-full"
                  value={standProduct}
                  onChangeText={(e) => setstandProduct(e)}
                />
                <Text>Category</Text>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(e) => setselectedCategory(e)}
                >
                  {categoryProduct.map((value, index) => (
                    <Picker.Item
                      label={value.name}
                      key={index}
                      value={value.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <Text>Description</Text>
            <TextInput
              className="h-12 rounded-md px-2 mb-5 text-lg bg-gray-200"
              value={descProduct}
              onChangeText={(e) => setdescProduct(e)}
            />
            <Button title="Edit" onPress={updateProduct} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default EditProduct;
