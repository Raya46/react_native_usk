import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

const ExpandableCardUser = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const formattedDate = `${year} ${month} ${day}`;

    return formattedDate;
  };

  const formatTime = (timestamp) => {
    const time = new Date(timestamp);
    const hour = time.getHours();
    const minute = time.getMinutes();
    let formattedTime = `${hour} : ${minute}`;
    minute < 10
      ? (formattedTime = `${hour} : 0${minute}`)
      : (formattedTime = `${hour} : ${minute}`);

    return formattedTime;
  };

  return (
    <TouchableOpacity
      onPress={handleToggleExpand}
      className="border border-gray-300 p-4 my-2 rounded-md"
    >
      <Text>{data.products.name}</Text>
      <View className="flex flex-row justify-between items-center">
        <Text>{formatDate(data.updated_at)}</Text>
      </View>

      {expanded && (
        <View className="mt-8">
          <Text>{data.order_code}</Text>

          <View className="flex flex-row justify-between">
            <View className="flex flex-row">
              <Text className="font-bold">
                Rp{data.price} | {data.quantity}x
              </Text>
            </View>
            <Text className="font-bold">Status: {data.status}</Text>
          </View>
          <Text className="font-light text-xs self-end">
            {formatTime(data.updated_at)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ExpandableCardUser;
