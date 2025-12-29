import { useCallback, useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { ChatMessage, LoadingMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { EmptyState } from "@/components/EmptyState";
import { SnackPreview, EmptyPreview } from "@/components/SnackPreview";
import { useSnackAgent } from "@/hooks/useSnackAgent";

const PREVIEW_BREAKPOINT = 768;

export default function SnackAgentScreen() {
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    currentSnack,
    showPreview,
    viewSnack,
    closePreview,
    clearConversation,
    hasMessages,
  } = useSnackAgent();

  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= PREVIEW_BREAKPOINT;

  // Animation for preview panel
  const previewProgress = useSharedValue(0);

  useEffect(() => {
    previewProgress.value = withSpring(showPreview ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
  }, [showPreview]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Auto-show preview when snack is generated
  useEffect(() => {
    if (currentSnack && !showPreview) {
      viewSnack(currentSnack);
    }
  }, [currentSnack]);

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage]
  );

  const handleNewChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearConversation();
  }, [clearConversation]);

  const togglePreview = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (showPreview) {
      closePreview();
    } else if (currentSnack) {
      viewSnack(currentSnack);
    }
  }, [showPreview, currentSnack, closePreview, viewSnack]);

  // Render for wide screens (side-by-side layout)
  if (isWideScreen) {
    return (
      <View style={styles.wideContainer}>
        <View style={styles.chatPanel}>
          <Header
            onNewChat={handleNewChat}
            onTogglePreview={togglePreview}
            hasSnack={!!currentSnack}
            showPreview={showPreview}
          />
          <ChatContent
            messages={messages}
            isLoading={isLoading}
            isStreaming={isStreaming}
            error={error}
            hasMessages={hasMessages}
            flatListRef={flatListRef}
            onSuggestionPress={handleSend}
            onViewSnack={viewSnack}
          />
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </View>

        <View style={styles.previewPanel}>
          {currentSnack ? (
            <SnackPreview
              code={currentSnack.code}
              name={currentSnack.name}
              dependencies={currentSnack.dependencies}
            />
          ) : (
            <EmptyPreview />
          )}
        </View>
      </View>
    );
  }

  // Mobile layout with slide-up preview
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <Header
          onNewChat={handleNewChat}
          onTogglePreview={togglePreview}
          hasSnack={!!currentSnack}
          showPreview={showPreview}
        />

        {showPreview && currentSnack ? (
          <SnackPreview
            code={currentSnack.code}
            name={currentSnack.name}
            dependencies={currentSnack.dependencies}
            onClose={closePreview}
          />
        ) : (
          <>
            <ChatContent
              messages={messages}
              isLoading={isLoading}
              isStreaming={isStreaming}
              error={error}
              hasMessages={hasMessages}
              flatListRef={flatListRef}
              onSuggestionPress={handleSend}
              onViewSnack={viewSnack}
            />
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface HeaderProps {
  onNewChat: () => void;
  onTogglePreview: () => void;
  hasSnack: boolean;
  showPreview: boolean;
}

function Header({ onNewChat, onTogglePreview, hasSnack, showPreview }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
          <Ionicons name="sparkles" size={18} color="#007AFF" />
        </View>
        <Text style={styles.headerTitle}>Snack Agent</Text>
      </View>

      <View style={styles.headerRight}>
        {hasSnack && (
          <Pressable style={styles.headerButton} onPress={onTogglePreview}>
            <Ionicons
              name={showPreview ? "chatbubbles-outline" : "phone-portrait-outline"}
              size={20}
              color="#fff"
            />
          </Pressable>
        )}
        <Pressable style={styles.headerButton} onPress={onNewChat}>
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

interface ChatContentProps {
  messages: any[];
  isLoading: boolean;
  isStreaming: boolean;
  error: any;
  hasMessages: boolean;
  flatListRef: React.RefObject<FlatList>;
  onSuggestionPress: (suggestion: string) => void;
  onViewSnack: (snack: any) => void;
}

function ChatContent({
  messages,
  isLoading,
  isStreaming,
  error,
  hasMessages,
  flatListRef,
  onSuggestionPress,
  onViewSnack,
}: ChatContentProps) {
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF453A" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  if (!hasMessages) {
    return <EmptyState onSuggestionPress={onSuggestionPress} />;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      style={styles.messageList}
      contentContainerStyle={styles.messageListContent}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="interactive"
      renderItem={({ item, index }) => (
        <ChatMessage
          role={item.role}
          content={item.content}
          snackData={item.snackData}
          isStreaming={isStreaming && index === messages.length - 1}
          onViewSnack={onViewSnack}
        />
      )}
      ListFooterComponent={
        isLoading && !isStreaming ? <LoadingMessage /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  wideContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#000",
  },
  chatPanel: {
    flex: 1,
    maxWidth: 500,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#2C2C2E",
  },
  previewPanel: {
    flex: 1,
    backgroundColor: "#0a0a0f",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
});
