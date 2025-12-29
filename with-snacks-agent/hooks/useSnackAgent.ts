import { useState, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { getApiUrl } from "@/lib/api-url";
import { DEFAULT_SNACK_CODE } from "@/lib/snack-templates";
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

  const {
    messages,
    isLoading,
    error,
    append,
    setMessages,
  } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: getApiUrl("/api/chat"),
    body: {
      currentCode: currentSnack?.code,
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // Process messages to extract snack data from tool invocations
  const processedMessages = useMemo((): ProcessedMessage[] => {
    return messages.map((message) => {
      let textContent = "";
      let snackData: SnackData | null = null;

      // Handle different message structures
      if (typeof message.content === "string") {
        textContent = message.content;
      } else if (message.parts) {
        // Process parts for AI SDK v6 format
        for (const part of message.parts) {
          if (part.type === "text") {
            textContent += part.text;
          } else if (part.type === "tool-invocation") {
            const { toolInvocation } = part;
            if (
              toolInvocation.toolName === "generateSnack" &&
              toolInvocation.state === "result"
            ) {
              snackData = toolInvocation.result as SnackData;
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

  // Send a message
  const sendMessage = useCallback(
    (content: string) => {
      append({ role: "user", content });
    },
    [append]
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

  // Update current snack when a new one is generated
  // Auto-show preview when snack is generated
  const handleSnackGenerated = useCallback((snack: SnackData) => {
    setCurrentSnack(snack);
    setShowPreview(true);
  }, []);

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
