import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../constant/ip";
import ExpandableCardUser from "../../component/ExpandedCardUser";

const HistoryUser = ({ route }) => {
  const [walletSelesai, setwalletSelesai] = useState([]);
  const [walletProcess, setwalletProcess] = useState([]);
  const [historyPembelian, sethistoryPembelian] = useState([]);
  const [loading, setloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { successTopUp } = route.params || {};

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const getDataHistory = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setwalletSelesai(response.data.walletSelesai);
    setwalletProcess(response.data.walletProcess);
    sethistoryPembelian(response.data.transactionsBayar);
    setloading(false);
  };

  const clearHistory = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}history-clear`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getDataHistory();
  };

  useEffect(() => {
    getDataHistory();
    if (successTopUp) {
      getDataHistory();
    }
  }, [successTopUp]);

  const onRefresh = () => {
    getDataHistory();
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
            <View className="bg-white p-4 rounded-lg mb-4">
              <Text className="mb-2">Top up Process</Text>
              {walletProcess.map((value, index) => (
                <View
                  key={index}
                  className={
                    value.credit === 0 || value.credit === null
                      ? `hidden`
                      : `flex flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3`
                  }
                >
                  <Text>{formatToRp(value.credit)}</Text>
                  <Text className="bg-yellow-400 p-2 rounded">
                    {value.status}
                  </Text>
                </View>
              ))}
            </View>

            <View className="bg-white p-4 rounded-lg">
              <Text className="mb-2">Top up Selesai</Text>
              {walletSelesai.map((value, index) => (
                <View
                  key={index}
                  className={
                    value.credit === 0 || value.credit === null
                      ? `hidden`
                      : `flex flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3`
                  }
                >
                  <Text>{formatToRp(value.credit)}</Text>
                  <Text className="bg-green-400 p-2 rounded">
                    {value.status}
                  </Text>
                </View>
              ))}
            </View>

            <View className="bg-white p-4 rounded-lg mb-4 w-full h-full mt-4">
              <Text className="mb-2">Riwayat Pembelian Harian</Text>
              {historyPembelian.map((value, index) => (
                <ExpandableCardUser data={value} key={index} />
              ))}
              <Button title="Hapus Riwayat" onPress={clearHistory} />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HistoryUser;
