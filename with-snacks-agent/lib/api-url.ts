import Constants from "expo-constants";

export function getApiUrl(path: string): string {
  // In development, use the Expo dev server
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;
    if (debuggerHost) {
      const host = debuggerHost.split(":")[0];
      return `http://${host}:8081${path}`;
    }
  }

  // In production, use relative path (or configure EXPO_PUBLIC_API_URL)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return `${process.env.EXPO_PUBLIC_API_URL}${path}`;
  }

  return path;
}
