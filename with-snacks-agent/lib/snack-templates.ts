// Default starter template for new snacks
export const DEFAULT_SNACK_CODE = `import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World!</Text>
      <Text style={styles.subtitle}>Start building your app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
});`;

// Common dependencies that work well with Snacks
export const COMMON_DEPENDENCIES = [
  "react-native-reanimated",
  "react-native-gesture-handler",
  "@expo/vector-icons",
  "expo-linear-gradient",
  "expo-blur",
  "expo-haptics",
];

// Generate snack URL with embedded code
export function generateSnackUrl(options: {
  code: string;
  name?: string;
  dependencies?: string[];
  platform?: "web" | "ios" | "android";
}): string {
  const { code, name = "AI Generated Snack", dependencies = [], platform = "web" } = options;

  const params = new URLSearchParams({
    name,
    platform,
    code: encodeURIComponent(code),
  });

  if (dependencies.length > 0) {
    params.set("dependencies", dependencies.join(","));
  }

  return `https://snack.expo.dev/embedded?${params.toString()}&preview=true&theme=dark`;
}

// Generate HTML for snack iframe
export function generateSnackEmbed(options: {
  code: string;
  name?: string;
  dependencies?: string[];
  platform?: "web" | "ios" | "android";
  theme?: "light" | "dark";
}): string {
  const {
    code,
    name = "AI Generated Snack",
    dependencies = [],
    platform = "web",
    theme = "dark",
  } = options;

  const encodedCode = encodeURIComponent(code);
  const encodedName = encodeURIComponent(name);
  const encodedDeps = dependencies.map(d => encodeURIComponent(d)).join(",");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: ${theme === "dark" ? "#1a1a2e" : "#f5f5f5"}; }
  </style>
</head>
<body>
  <div
    data-snack-code="${encodedCode}"
    data-snack-name="${encodedName}"
    data-snack-dependencies="${encodedDeps}"
    data-snack-platform="${platform}"
    data-snack-theme="${theme}"
    data-snack-preview="true"
    data-snack-device-frame="false"
    style="width: 100%; height: 100%; overflow: hidden;"
  ></div>
  <script async src="https://snack.expo.dev/embed.js"></script>
</body>
</html>`;
}
