import { View, TextInput, Button, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../../constant/ip";

const EditUser = ({ route, navigation }) => {
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [roles, setroles] = useState([]);
  const [selectedRole, setselectedRole] = useState(0);
  const { id } = route.params;
  const currentTime = new Date();
  const seconds = currentTime.getSeconds();

  const getUserAndRoles = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}user-admin-edit/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setroles(response.data.roles);
    setname(response.data.user.name);
    setselectedRole(response.data.user.roles_id);
  };

  const editUser = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}user-admin-update/${id}`,
      {
        name: name,
        password: password,
        roles_id: selectedRole,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigation.navigate("HomeAdmin", {
      userEdit: seconds,
    });
  };

  useEffect(() => {
    getUserAndRoles();
  }, []);

  return (
    <View className="flex flex-col w-full h-full p-4 justify-center">
      <View className="bg-white p-4 flex flex-col justify-center w-full rounded-lg">
        <Text>Name</Text>
        <TextInput
          className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
          value={name}
          onChangeText={(e) => setname(e)}
          placeholder="name"
        />
        <Text>Password</Text>
        <TextInput
          className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
          value={password}
          onChangeText={(e) => setpassword(e)}
          placeholder="password"
        />
        <Text>Role</Text>
        <Picker
          selectedValue={selectedRole}
          onValueChange={(e) => setselectedRole(e)}
        >
          {roles.map((value, index) => (
            <Picker.Item value={value.id} key={index} label={value.name} />
          ))}
        </Picker>
        <Button title="Edit" onPress={editUser} />
      </View>
    </View>
  );
};

export default EditUser;
