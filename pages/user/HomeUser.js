import { View, Text, Button, FlatList, Modal, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Card from "../../component/Card";
import API_BASE_URL from "../../constant/ip";
import { FontAwesome } from "@expo/vector-icons";

const HomeUser = ({ route, navigation }) => {
  const [dataSiswa, setdataSiswa] = useState([]);
  const [loading, setloading] = useState(true);
  const { getDataSiswaCallBack } = route.params || {};
  const { username } = route.params || {};
  const [roleAuth, setroleAuth] = useState("");
  const [name, setname] = useState("");
  const [credit, setcredit] = useState("");
  const [openModal, setopenModal] = useState(false);
  const currentTime = new Date();
  const seconds = currentTime.getSeconds();

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const topUp = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}topup`,
      {
        credit: parseInt(credit),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setcredit("");
    setopenModal(false);
    navigation.navigate("HistoryUser", { successTopUp: seconds });
  };

  const getDataSiswa = async () => {
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    const name = await AsyncStorage.getItem("name");
    const response = await axios.get(`${API_BASE_URL}get-product-siswa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response.data", response.data);
    setdataSiswa(response.data);
    setloading(false);
    setroleAuth(role);
    setname(name);
  };

  useEffect(() => {
    getDataSiswa();
    console.log(getDataSiswaCallBack);
    if (getDataSiswaCallBack) {
      getDataSiswa();
    }
  }, [getDataSiswaCallBack]);

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

  return (
    <View className="container mx-auto h-full w-full">
      {loading ? (
        <>
          <Text>...loading</Text>
          <Button title="logout" onPress={logout} />
        </>
      ) : (
        <View className="flex flex-col h-full w-full">
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-2 bg-white">
            <View className="flex flex-row items-center">
              <FontAwesome name="user-circle-o" size={24} color="black" />
              <Text className="ml-2">{username ?? name} | Siswa </Text>
              <Text className="bg-green-400 p-2 rounded-md">
                {formatToRp(dataSiswa.difference)}
              </Text>
            </View>
            <Modal
              visible={openModal}
              onRequestClose={() => setopenModal(false)}
            >
              <View className="flex flex-col justify-center items-center h-full w-full">
                <Text className="mb-3">Masukkan Nominal</Text>
                <TextInput
                  keyboardType="numeric"
                  value={credit}
                  className="h-12 rounded-md px-6 mb-4 text-lg bg-gray-200 w-1/2"
                  onChangeText={(e) => setcredit(e)}
                  placeholder="nominal"
                />
                <Button title="top up" onPress={topUp} />
                <Text></Text>
                <Button title="close" onPress={() => setopenModal(false)} />
              </View>
            </Modal>
            <View className="flex flex-row">
              <Button title="Top up" onPress={() => setopenModal(true)} />
              <Button title="logout" onPress={logout} />
            </View>
          </View>
          <FlatList
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            data={dataSiswa.products}
            renderItem={({ item, index }) => (
              <Card
                key={index}
                name={item.name}
                desc={item.desc}
                photo={`http://192.168.5.56:8000${item.photo}`}
                price={item.price}
                role={roleAuth}
                stand={item.stand}
                stock={item.stock}
                id={item.id}
                navigation={navigation}
                saldo={dataSiswa.difference}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default HomeUser;
