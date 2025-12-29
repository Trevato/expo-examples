import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

interface EmptyStateProps {
  onSuggestionPress?: (suggestion: string) => void;
}

const SUGGESTIONS = [
  {
    icon: "fitness-outline",
    title: "Workout Timer",
    prompt: "Create a workout interval timer with start, pause, and reset buttons. Use a clean dark theme.",
  },
  {
    icon: "wallet-outline",
    title: "Expense Tracker",
    prompt: "Build a simple expense tracker where I can add expenses with amount and category, and see a total.",
  },
  {
    icon: "musical-notes-outline",
    title: "Music Player UI",
    prompt: "Design a music player interface with album art, play/pause, next/previous buttons, and a progress bar.",
  },
  {
    icon: "checkmark-circle-outline",
    title: "Todo List",
    prompt: "Make a todo list app with the ability to add, complete, and delete tasks. Include a completion counter.",
  },
];

export function EmptyState({ onSuggestionPress }: EmptyStateProps) {
  const handlePress = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSuggestionPress?.(prompt);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.delay(100).duration(400)}
        style={styles.header}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={32} color="#007AFF" />
        </View>
        <Text style={styles.title}>Snack Agent</Text>
        <Text style={styles.subtitle}>
          Describe your app idea and watch it come to life in real-time
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={styles.suggestionsContainer}
      >
        <Text style={styles.suggestionsTitle}>Try these ideas</Text>
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((suggestion, index) => (
            <Animated.View
              key={suggestion.title}
              entering={FadeInDown.delay(400 + index * 100).duration(400)}
            >
              <Pressable
                style={styles.suggestionCard}
                onPress={() => handlePress(suggestion.prompt)}
              >
                <View style={styles.suggestionIcon}>
                  <Ionicons
                    name={suggestion.icon as any}
                    size={20}
                    color="#007AFF"
                  />
                </View>
                <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                <Ionicons name="arrow-forward" size={16} color="#636366" />
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  suggestionsContainer: {
    flex: 1,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636366",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  suggestions: {
    gap: 10,
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});
