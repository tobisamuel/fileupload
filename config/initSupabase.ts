import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    return await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    return await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(url, key, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    detectSessionInUrl: false,
  },
});
