import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { generateSnackEmbed } from "@/lib/snack-templates";

// Conditional import for WebView (not available on web)
let WebView: any = null;
if (Platform.OS !== "web") {
  WebView = require("react-native-webview").default;
}

interface SnackPreviewProps {
  code: string;
  name?: string;
  dependencies?: string[];
  onClose?: () => void;
  onRefresh?: () => void;
}

export function SnackPreview({
  code,
  name = "Preview",
  dependencies = [],
  onClose,
  onRefresh,
}: SnackPreviewProps) {
  const webViewRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState<"web" | "ios" | "android">("web");

  const html = generateSnackEmbed({
    code,
    name,
    dependencies,
    platform,
    theme: "dark",
  });

  const handlePlatformChange = (newPlatform: "web" | "ios" | "android") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlatform(newPlatform);
    setIsLoading(true);
  };

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    webViewRef.current?.reload();
    onRefresh?.();
  };

  // Web fallback - show iframe directly
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.actions}>
            <PlatformPicker platform={platform} onChange={handlePlatformChange} />
            <Pressable onPress={handleRefresh} style={styles.iconButton}>
              <Ionicons name="refresh" size={20} color="#fff" />
            </Pressable>
            {onClose && (
              <Pressable onPress={onClose} style={styles.iconButton}>
                <Ionicons name="close" size={20} color="#fff" />
              </Pressable>
            )}
          </View>
        </View>
        <View style={styles.webContainer}>
          <iframe
            srcDoc={html}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: 12,
            }}
            title="Snack Preview"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.actions}>
          <PlatformPicker platform={platform} onChange={handlePlatformChange} />
          <Pressable onPress={handleRefresh} style={styles.iconButton}>
            <Ionicons name="refresh" size={20} color="#fff" />
          </Pressable>
          {onClose && (
            <Pressable onPress={onClose} style={styles.iconButton}>
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.webViewContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading preview...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ html }}
          style={styles.webView}
          onLoadEnd={() => setIsLoading(false)}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={["*"]}
          mixedContentMode="compatibility"
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
    </View>
  );
}

function PlatformPicker({
  platform,
  onChange,
}: {
  platform: "web" | "ios" | "android";
  onChange: (p: "web" | "ios" | "android") => void;
}) {
  const platforms: Array<{ id: "web" | "ios" | "android"; icon: string; label: string }> = [
    { id: "web", icon: "globe-outline", label: "Web" },
    { id: "ios", icon: "logo-apple", label: "iOS" },
    { id: "android", icon: "logo-android", label: "Android" },
  ];

  return (
    <View style={styles.platformPicker}>
      {platforms.map((p) => (
        <Pressable
          key={p.id}
          onPress={() => onChange(p.id)}
          style={[
            styles.platformButton,
            platform === p.id && styles.platformButtonActive,
          ]}
        >
          <Ionicons
            name={p.icon as any}
            size={16}
            color={platform === p.id ? "#fff" : "#8E8E93"}
          />
        </Pressable>
      ))}
    </View>
  );
}

// Empty preview placeholder
export function EmptyPreview() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="code-slash-outline" size={48} color="#3A3A3C" />
      <Text style={styles.emptyTitle}>No Preview Yet</Text>
      <Text style={styles.emptySubtitle}>
        Describe your app idea and watch it come to life
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2C2C2E",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  platformPicker: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    padding: 2,
  },
  platformButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  platformButtonActive: {
    backgroundColor: "#3A3A3C",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  webContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    overflow: "hidden",
    margin: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  loadingText: {
    color: "#8E8E93",
    fontSize: 14,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
  },
});
