import * as SecureStore from "expo-secure-store";

import storageConstants from "@/constants/storage";

export default {
  async saveToken(token: string) {
    await SecureStore.setItemAsync(storageConstants.TOKEN_KEY, token);
  },

  async getToken() {
    return await SecureStore.getItemAsync(storageConstants.TOKEN_KEY);
  },

  async removeToken() {
    await SecureStore.deleteItemAsync(storageConstants.TOKEN_KEY);
  },

  async saveRefreshToken(refreshToken: string) {
    await SecureStore.setItemAsync(
      storageConstants.REFRESH_TOKEN_KEY,
      refreshToken,
    );
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync(storageConstants.REFRESH_TOKEN_KEY);
  },

  async removeRefreshToken() {
    await SecureStore.deleteItemAsync(storageConstants.REFRESH_TOKEN_KEY);
  },
};
