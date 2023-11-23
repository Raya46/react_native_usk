import { View, Text, Button, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../constant/ip";
import ExpandableCard from "../component/ExpandedCard";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const ReportPage = ({ navigation }) => {
  const [dataReport, setdataReport] = useState([]);
  const [historyAdmin, sethistoryAdmin] = useState([]);
  const [loading, setloading] = useState(true);
  const [roleAuth, setroleAuth] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [profileUser, setprofileUser] = useState([]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
  };

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const getDataReport = async () => {
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    setroleAuth(role);
    const response = await axios.get(
      role === "siswa"
        ? `${API_BASE_URL}history`
        : role === "admin"
        ? `${API_BASE_URL}report-admin`
        : `${API_BASE_URL}report-bank`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resuser = await axios.get(`${API_BASE_URL}profilesiswa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("resadsa", resuser.data);
    setprofileUser(resuser.data);
    console.log(role);
    const laporanPembayaran = response.data.laporanPembayaran;
    const order_code = Object.keys(laporanPembayaran);
    setdataReport(order_code);
    sethistoryAdmin(response.data.transactions);
    setloading(false);
  };

  useEffect(() => {
    getDataReport();
  }, []);

  const onRefresh = () => {
    getDataReport();
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="container mx-auto">
        {loading ? (
          <Text>loading</Text>
        ) : (
          <View className="flex flex-col h-full w-full p-4">
            {roleAuth === "siswa" ? (
              <View>
                <View className="flex flex-row bg-white p-4 rounded-lg items-center">
                  <View>
                    <FontAwesome name="user-circle-o" size={35} color="black" />
                  </View>
                  <View className="ml-3">
                    <Text>{profileUser.data.name}</Text>
                    <Text>
                      Joined at {formatDate(profileUser.data.created_at)}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row bg-white rounded-lg my-4 p-4 justify-between">
                  <View className="flex flex-col items-center">
                    <Entypo name="wallet" size={24} color="black" />
                    <Text>{formatToRp(profileUser.saldo)}</Text>
                    <Text>Saldo</Text>
                  </View>
                  <View className="border border-gray-300"></View>
                  <View className="flex flex-col items-center">
                    <FontAwesome name="shopping-cart" size={24} color="black" />
                    <Text>{profileUser.banyak_pembelian}</Text>
                    <Text>Barang Dibeli</Text>
                  </View>
                  <View className="border border-gray-300"></View>
                  <View className="flex flex-col items-center">
                    <FontAwesome name="exchange" size={24} color="black" />
                    <Text>{formatToRp(profileUser.jumlah_pengeluaran)}</Text>
                    <Text>Pengeluaran</Text>
                  </View>
                </View>
              </View>
            ) : (
              <></>
            )}
            <View className="bg-white p-4 rounded-lg mb-4">
              <Text className="mb-2 text-lg">Riwayat Pembelian</Text>
              {dataReport.map((value, index) => (
                <View
                  key={index}
                  className={`flex flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3`}
                >
                  <Text>{value}</Text>
                  <Button
                    title="Download"
                    onPress={() =>
                      navigation.navigate("DownloadPage", {
                        order_code: value,
                      })
                    }
                  />
                </View>
              ))}
            </View>
            {roleAuth === "siswa" ? (
              <></>
            ) : (
              <View className="bg-white p-4 rounded-lg">
                <Text className="text-lg">Riwayat Transaksi Harian</Text>
                {historyAdmin.map((value, index) => (
                  <ExpandableCard data={value} key={index} />
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ReportPage;
