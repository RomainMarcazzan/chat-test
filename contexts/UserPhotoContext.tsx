import React, { createContext, useContext, useState, ReactNode } from "react";
import * as ImagePicker from "expo-image-picker";

// Context type
export type UserContextType = {
  userPhoto: string | null;
  userName: string;
  setUserName: (name: string) => void;
  takePhoto: () => Promise<void>;
  pickImage: () => Promise<void>;
  clearPhoto: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  const takePhoto = async () => {
    console.log("takePhoto called");

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission caméra refusée !");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUserPhoto(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission galerie refusée !");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUserPhoto(result.assets[0].uri);
    }
  };

  const clearPhoto = () => setUserPhoto(null);

  return (
    <UserContext.Provider
      value={{
        userPhoto,
        userName,
        setUserName,
        takePhoto,
        pickImage,
        clearPhoto,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
