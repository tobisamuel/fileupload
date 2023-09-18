import { Stack } from "expo-router";
import { useAuth } from "../../components/Provider/AuthProvider";
import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// Simple stack layout within the authenticated area
const StackLayout = () => {
  const { signOut, session } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f0f0f",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="files"
        redirect={!session}
        options={{
          headerTitle: "My Files",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 16,
          },
          headerRight: () => (
            <Pressable onPress={signOut}>
              <Ionicons name="log-out-outline" size={24} color={"#fff"} />
            </Pressable>
          ),
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default StackLayout;
