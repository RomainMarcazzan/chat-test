import { useUser } from "@/contexts/UserPhotoContext";
import { useState } from "react";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { CustomButton } from "@/components/ui/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { CustomDialog } from "@/components/ui/CustomDialog";

export default function HomeScreen() {
  const { userPhoto, userName, setUserName, takePhoto, pickImage } = useUser();
  const [input, setInput] = useState(userName);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [photoDialogVisible, setPhotoDialogVisible] = useState(false);
  const router = useRouter();

  const handleValidate = () => {
    setUserName(input);
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
    router.push("/chat-ai");
  };

  const handleDialogCancel = () => {
    setDialogVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Profil utilisateur</ThemedText>
        <View style={styles.avatarContainer}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
          <CustomButton
            title={userPhoto ? "Changer la photo" : "Ajouter une photo"}
            onPress={() => setPhotoDialogVisible(true)}
            style={{ marginTop: 12 }}
            variant="outline"
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText type="subtitle">Nom d'utilisateur</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre nom"
            value={input}
            onChangeText={setInput}
            returnKeyType="done"
          />
          <CustomButton
            title="Valider"
            onPress={handleValidate}
            style={{ marginTop: 12 }}
            disabled={!input.trim()}
          />
        </View>
        <CustomDialog
          visible={dialogVisible}
          title="Profil enregistré"
          message="Voulez-vous accéder à l’Assistant Personnel ?"
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
          onClose={handleDialogCancel}
          confirmText="Oui"
          cancelText="Non"
        />
        <CustomDialog
          visible={photoDialogVisible}
          title="Photo de profil"
          message="Choisissez une option pour votre photo de profil :"
          onConfirm={async () => {
            setPhotoDialogVisible(false);
            await takePhoto();
          }}
          onCancel={async () => {
            setPhotoDialogVisible(false);
            await pickImage();
          }}
          onClose={() => setPhotoDialogVisible(false)}
          confirmText="Photo"
          cancelText="Galerie"
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 32,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e6f0ff",
  },
  avatarPlaceholder: {
    borderWidth: 2,
    borderColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
