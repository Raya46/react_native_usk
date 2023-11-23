import { View, Text, ScrollView, Button, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../constant/ip";

const TransactionKantin = () => {
  const [transactionKantin, settransactionKantin] = useState([]);
  const [loading, setloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const getTransactionKantin = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}transaction-kantin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    settransactionKantin(response.data);
    setloading(false);
  };

  const verifPengambilan = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}transaction-kantin/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    getTransactionKantin();
  };

  useEffect(() => {
    getTransactionKantin();
  }, []);

  const onRefresh = () => {
    getTransactionKantin();
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
          <View className="flex flex-col h-full w-full p-3">
            <View className="flex flex-col bg-white rounded-lg p-3">
              <Text className="text-lg">List Pembelian Barang</Text>
              {transactionKantin.transactions.map((item, index) => (
                <View
                  className="flex flex-row justify-between items-center bg-white p-3 mt-2 rounded-lg border border-gray-300"
                  key={index}
                >
                  <View className="flex flex-col">
                    <Text>{item.order_code}</Text>
                    {item.user_transactions.map((val, ind) => (
                      <Text key={ind}>{val.name}</Text>
                    ))}
                    <Text>{item.products.name}</Text>
                    <Text>
                      {formatToRp(item.price)} | {item.quantity}x
                    </Text>
                  </View>
                  <View className="flex flex-row">
                    <Text
                      className={
                        item.status === "dibayar"
                          ? `bg-green-300 p-2 rounded`
                          : `bg-yellow-300 p-2 rounded`
                      }
                    >
                      {item.status}
                    </Text>
                    {item.status === "dibayar" ? (
                      <Button
                        title="Verif"
                        onPress={() => verifPengambilan(item.id)}
                      />
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TransactionKantin;
