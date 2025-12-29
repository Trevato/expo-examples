import { useState, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder = "Describe your app idea...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<TextInput>(null);
  const buttonScale = useSharedValue(1);

  const canSend = value.trim().length > 0 && !isLoading;

  const handleSend = useCallback(() => {
    if (!canSend) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSend(value.trim());
    setValue("");

    // Keep keyboard open on mobile
    if (Platform.OS !== "web") {
      inputRef.current?.focus();
    }
  }, [value, canSend, onSend]);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor="#636366"
          multiline
          maxLength={2000}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={handleSend}
          editable={!isLoading}
        />

        <AnimatedPressable
          onPress={handleSend}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!canSend}
          style={[
            styles.sendButton,
            canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
            buttonAnimatedStyle,
          ]}
        >
          <Ionicons
            name={isLoading ? "stop" : "arrow-up"}
            size={20}
            color={canSend ? "#fff" : "#636366"}
          />
        </AnimatedPressable>
      </View>

      <View style={styles.hints}>
        <Hint icon="bulb-outline" text="Try: A meditation timer app" />
        <Hint icon="color-palette-outline" text="Try: A color palette generator" />
      </View>
    </View>
  );
}

function Hint({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.hint}>
      <Ionicons name={icon as any} size={12} color="#636366" />
      <Pressable>
        <Animated.Text style={styles.hintText}>{text}</Animated.Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    paddingTop: 8,
    backgroundColor: "#000",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#2C2C2E",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    maxHeight: 120,
    paddingVertical: 8,
    paddingRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: "#007AFF",
  },
  sendButtonDisabled: {
    backgroundColor: "#2C2C2E",
  },
  hints: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
  },
  hintText: {
    fontSize: 12,
    color: "#636366",
  },
});
