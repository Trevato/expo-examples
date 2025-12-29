import Constants from "expo-constants";
import { Platform } from "react-native";

// Cache the base URL to avoid repeated computation
let cachedBaseUrl: string | null = null;

export function getApiUrl(path: string): string {
  // Return cached URL if available
  if (cachedBaseUrl !== null) {
    return cachedBaseUrl + path;
  }

  // In production, use configured API URL (required for native builds)
  // Set EXPO_PUBLIC_API_URL in your environment or eas.json
  if (process.env.EXPO_PUBLIC_API_URL) {
    cachedBaseUrl = process.env.EXPO_PUBLIC_API_URL;
    return cachedBaseUrl + path;
  }

  // In development, use the Expo dev server
  if (__DEV__) {
    // Try multiple sources for the debugger host
    const debuggerHost =
      Constants.expoConfig?.hostUri ||
      Constants.manifest2?.extra?.expoGo?.debuggerHost ||
      (Constants as unknown as { debuggerHost?: string }).debuggerHost;

    if (debuggerHost) {
      const host = debuggerHost.split(":")[0];
      cachedBaseUrl = `http://${host}:8081`;
      return cachedBaseUrl + path;
    }

    // Fallback for iOS simulator - use localhost
    if (Platform.OS === "ios") {
      cachedBaseUrl = "http://localhost:8081";
      return cachedBaseUrl + path;
    }

    // Fallback for Android emulator - use 10.0.2.2
    if (Platform.OS === "android") {
      cachedBaseUrl = "http://10.0.2.2:8081";
      return cachedBaseUrl + path;
    }
  }

  // For web in production, relative path works
  cachedBaseUrl = "";
  return path;
}
