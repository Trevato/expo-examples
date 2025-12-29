import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

export interface SnackData {
  name: string;
  description: string;
  code: string;
  dependencies: string[];
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  snackData?: SnackData | null;
  onViewSnack?: (snack: SnackData) => void;
}

export function ChatMessage({
  role,
  content,
  isStreaming,
  snackData,
  onViewSnack,
}: ChatMessageProps) {
  const isUser = role === "user";

  const handleViewSnack = () => {
    if (snackData && onViewSnack) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onViewSnack(snackData);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify()}
      style={[styles.container, isUser && styles.userContainer]}
    >
      {!isUser && (
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={16} color="#007AFF" />
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {content ? (
          <Text style={[styles.text, isUser && styles.userText]}>
            {content}
            {isStreaming && <Text style={styles.cursor}>|</Text>}
          </Text>
        ) : isStreaming ? (
          <View style={styles.thinkingContainer}>
            <Text style={styles.thinkingText}>Thinking</Text>
            <ThinkingDots />
          </View>
        ) : null}

        {snackData && (
          <Pressable style={styles.snackCard} onPress={handleViewSnack}>
            <View style={styles.snackCardHeader}>
              <View style={styles.snackCardIcon}>
                <Ionicons name="code-slash" size={14} color="#30D158" />
              </View>
              <Text style={styles.snackCardTitle}>{snackData.name}</Text>
            </View>
            <Text style={styles.snackCardDescription} numberOfLines={2}>
              {snackData.description}
            </Text>
            <View style={styles.snackCardFooter}>
              <Text style={styles.snackCardAction}>Tap to preview</Text>
              <Ionicons name="arrow-forward" size={14} color="#007AFF" />
            </View>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

function ThinkingDots() {
  return (
    <View style={styles.dotsContainer}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          entering={FadeIn.delay(i * 200).duration(400)}
          style={styles.dot}
        />
      ))}
    </View>
  );
}

// Loading message component
export function LoadingMessage() {
  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify()}
      style={styles.container}
    >
      <View style={styles.avatar}>
        <Ionicons name="sparkles" size={16} color="#007AFF" />
      </View>
      <View style={[styles.bubble, styles.assistantBubble]}>
        <View style={styles.thinkingContainer}>
          <Text style={styles.thinkingText}>Generating your app</Text>
          <ThinkingDots />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  bubble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#1C1C1E",
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#fff",
  },
  userText: {
    color: "#fff",
  },
  cursor: {
    color: "#007AFF",
    fontWeight: "300",
  },
  thinkingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  thinkingText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 4,
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#8E8E93",
  },
  snackCard: {
    marginTop: 12,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  snackCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  snackCardIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(48, 209, 88, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  snackCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  snackCardDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
    marginBottom: 10,
  },
  snackCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  snackCardAction: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
});
