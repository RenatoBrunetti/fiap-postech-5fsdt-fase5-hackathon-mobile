import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Router } from "expo-router";

export default function AdminPanel({ router }: { router: Router }) {
  return (
    <View style={styles.adminPanel}>
      <Text style={styles.adminTitle}>Painel de Controle</Text>
      <TouchableOpacity
        style={styles.adminCard}
        onPress={() => router.push("/admin/schools")}
      >
        <Ionicons name="business" size={32} color="#007AFF" />
        <View style={styles.adminCardMainContent}>
          <Text style={styles.adminCardTitle}>Gerenciar Escolas</Text>
          <Text style={styles.adminCardSub}>
            Crie, edite e organize suas instituições
          </Text>
        </View>
        <View style={styles.adminRightIcon}>
          <Ionicons name="chevron-forward" size={20} color="#667085" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  adminPanel: {
    flex: 1,
    marginTop: 10,
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#344054",
    marginBottom: 16,
  },
  adminCard: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E1E7EF",
    gap: 16,
    // Light shadow for depth (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Light shadow (Android)
    elevation: 2,
  },
  adminCardMainContent: {
    flex: 1,
  },
  adminCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1C1E",
  },
  adminCardSub: {
    fontSize: 14,
    color: "#667085",
    marginTop: 2,
    maxWidth: "85%", // Prevents text from touching the right icon
  },
  adminRightIcon: {
    right: 8,
    position: "absolute",
  },
});
