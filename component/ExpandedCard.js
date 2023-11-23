import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

const ExpandableCard = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
  };

  return (
    <TouchableOpacity
      onPress={handleToggleExpand}
      className="border border-gray-300 p-4 my-2 rounded-md"
    >
      <Text>{data.order_code}</Text>
      <View className="flex flex-row justify-between items-center">
        {data.user_transactions.map((val, ind) => (
          <Text key={ind}>{val.name}</Text>
        ))}
        <Text>{formatDate(data.updated_at)}</Text>
      </View>

      {expanded && (
        <View className="mt-8">
          <Text>{data.products.name}</Text>

          <View className="flex flex-row justify-between">
            <View className="flex flex-row">
              <Text className="font-bold">
                Rp{data.price} | {data.quantity}x
              </Text>
            </View>
            <Text className="font-bold">Status: {data.status}</Text>
          </View>
          <Text className="font-light self-end text-xs">
            {formatTime(data.updated_at)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ExpandableCard;
