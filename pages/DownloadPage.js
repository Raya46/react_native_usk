import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../constant/ip";
import { Ionicons } from "@expo/vector-icons";

const DownloadPage = ({ navigation, route }) => {
  const { order_code } = route.params;
  const [dataDownload, setdataDownload] = useState([]);
  const [loading, setloading] = useState(true);

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const formattedDate = `${year} ${month} ${day}`;

    return formattedDate;
  };

  const printReport = async () => {
    const file = await printToFileAsync({
      html: htmlToPrint,
      base64: false,
    });
    await shareAsync(file.uri);
  };

  const getDataDownload = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}history/${order_code}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    setdataDownload(response.data);
    setloading(false);
  };

  useEffect(() => {
    getDataDownload();
  }, []);

  let htmlToPrint = `
  <html>
    <body>
    <span>${JSON.stringify(order_code)}</span>
    ${
      dataDownload.report
        ? dataDownload.report
            .map(
              (value, index) => `
        <div key="${index}">
        ${value.user_transactions.map((val) => `<span>${val.name}</span>`)}
        <span>${value.products.name}</span>
        <span>RP${value.products.price}</span>
        <span>${value.quantity}x</span>
        </div>
        <span>${value.status}</span>
        `
            )
            .join("")
        : ""
    }
    <div>
    <span>Total harga: ${dataDownload.totalPrice}</span>
    </div>
      
      </body>
  </html>
`;

  return (
    <View>
      {loading ? (
        <View className="bg-green-400 rounded-xl p-4 justify-center items-center">
          <View className="flex flex-row items-center justify-center">
            <Ionicons name="qr-code" size={24} color="white" />
            <Text className="text-white text-xl ml-3">{order_code}</Text>
          </View>
        </View>
      ) : (
        <View className="p-4">
          <View className="bg-green-400 rounded-xl p-4 justify-center items-center">
            <View className="flex flex-row items-center justify-center">
              <Ionicons name="qr-code" size={24} color="white" />
              <Text className="text-white text-xl ml-3">{order_code}</Text>
            </View>
          </View>
          <View className="bg-white p-4 rounded-lg mb-4 w-full mt-4">
            {dataDownload.report.map((value, index) => (
              <View
                key={index}
                className={`flex flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3`}
              >
                <View className="flex flex-col">
                  {value.user_transactions.map((val, ind) => (
                    <Text key={ind}>{val.name}</Text>
                  ))}
                  <Text>{value.products.name}</Text>
                  <Text>
                    {formatToRp(value.price)} | {value.quantity}x
                  </Text>
                  <Text>{formatDate(value.updated_at)}</Text>
                </View>
              </View>
            ))}
          </View>
          <View
            className={`flex flex-row justify-between items-center rounded-lg p-3 mb-3 bg-white`}
          >
            <View className="flex flex-col">
              <Text>Total harga {formatToRp(dataDownload.totalPrice)}</Text>
            </View>
          </View>
          <Button title="Save as PDF" onPress={printReport} />
        </View>
      )}
    </View>
  );
};

export default DownloadPage;
