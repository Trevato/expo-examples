import { useState, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { getApiUrl } from "@/lib/api-url";
import type { SnackData } from "@/components/ChatMessage";

export interface ProcessedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  snackData: SnackData | null;
  isStreaming: boolean;
}

export function useSnackAgent() {
  const [currentSnack, setCurrentSnack] = useState<SnackData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const apiUrl = getApiUrl("/api/chat");

  const {
    messages,
    status,
    error,
    sendMessage: chatSendMessage,
    setMessages,
  } = useChat({
    // AI SDK 6: Use DefaultChatTransport with expo/fetch for streaming support
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: apiUrl,
      body: {
        currentCode: currentSnack?.code,
      },
    }),
    // Enable multi-step tool calling
    maxSteps: 5,
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Process messages to extract snack data from tool invocations
  // AI SDK 6 uses message.parts array structure with type: "tool-{toolName}"
  const processedMessages = useMemo((): ProcessedMessage[] => {
    return messages.map((message) => {
      let textContent = "";
      let snackData: SnackData | null = null;

      // AI SDK 6: Messages have a parts array
      if (message.parts) {
        for (const part of message.parts) {
          if (part.type === "text") {
            textContent += (part as { type: "text"; text: string }).text;
          } else if (part.type === "tool-generateSnack") {
            // New AI SDK 6 format: type is "tool-{toolName}"
            const toolPart = part as {
              type: "tool-generateSnack";
              toolCallId: string;
              state: "input-streaming" | "input-available" | "output-available";
              input?: unknown;
              output?: SnackData;
            };
            if (toolPart.state === "output-available" && toolPart.output) {
              snackData = toolPart.output;
            }
          }
        }
      }

      return {
        id: message.id,
        role: message.role as "user" | "assistant",
        content: textContent,
        snackData,
        isStreaming: false,
      };
    });
  }, [messages]);

  // Check if the last message is still streaming
  const isStreaming = isLoading && messages.length > 0;

  // Get the latest snack from messages
  const latestSnack = useMemo(() => {
    for (let i = processedMessages.length - 1; i >= 0; i--) {
      if (processedMessages[i].snackData) {
        return processedMessages[i].snackData;
      }
    }
    return null;
  }, [processedMessages]);

  // Send a message using AI SDK's sendMessage
  const sendMessage = useCallback(
    (content: string) => {
      chatSendMessage({ text: content });
    },
    [chatSendMessage]
  );

  // View a specific snack
  const viewSnack = useCallback((snack: SnackData) => {
    setCurrentSnack(snack);
    setShowPreview(true);
  }, []);

  // Close preview
  const closePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    setCurrentSnack(null);
    setShowPreview(false);
  }, [setMessages]);

  return {
    messages: processedMessages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    currentSnack: currentSnack || latestSnack,
    showPreview,
    viewSnack,
    closePreview,
    clearConversation,
    hasMessages: processedMessages.length > 0,
  };
}
