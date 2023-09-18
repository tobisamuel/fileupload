import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "../../components/Provider/AuthProvider";
import React, { useEffect, useState } from "react";
import { FileObject } from "@supabase/storage-js";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../config/initSupabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import ImageItem from "../../components/ImageItem";

export default function Files() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileObject[]>([]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from("fileupload").list(user!.id);

    // console.log(data);1

    if (data) {
      setFiles(data);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Load user images
    loadImages();
  }, [user]);

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const res = await ImagePicker.launchImageLibraryAsync(options);

    if (res.canceled) return;

    const img = res.assets[0];
    const base64 = await FileSystem.readAsStringAsync(img.uri, {
      encoding: "base64",
    });

    const path = `${user!.id}/${new Date().getTime()}.${
      img.type === "image" ? "png" : "mp4"
    }`;

    const contentType = img.type === "image" ? "image/png" : "video/mp4";

    const { data, error } = await supabase.storage
      .from("fileupload")
      .upload(path, decode(base64), {
        contentType,
      });

    console.log(data, error);

    await loadImages();
  };

  const onRemoveImage = async (item: FileObject, index: number) => {
    supabase.storage.from("fileupload").remove([`${user!.id}/${item.name}`]);
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {files.map((item, index) => (
          <ImageItem
            key={item.id}
            item={item}
            userId={user!.id}
            onRemoveImage={() => onRemoveImage(item, index)}
          />
        ))}
      </ScrollView>

      {/* FAB to add images */}
      <TouchableOpacity onPress={onSelectImage} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#151515",
  },
  fab: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: "#2b825b",
    borderRadius: 100,
  },
});
