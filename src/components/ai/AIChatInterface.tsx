// src/components/ai/AIChatInterface.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  User,
  Bot,
  Trash2,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Interface definitions
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  type: "text" | "action" | "error" | "success";
  metadata?: any;
}

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onClearMessages: () => void;
  isProcessing?: boolean;
  placeholder?: string;
  disabled?: boolean;
  showQuickActions?: boolean;
  quickActions?: QuickAction[];
  maxHeight?: string;
  className?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  command: string;
  disabled?: boolean;
}

// Message component
const MessageBubble: React.FC<{
  message: ChatMessage;
  onCopy?: (content: string) => void;
}> = ({ message, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getMessageStyles = () => {
    const baseStyles = "max-w-[80%] rounded-lg p-3 relative group";
    
    switch (message.type) {
      case "error":
        return `${baseStyles} bg-red-50 text-red-800 border border-red-200`;
      case "success":
        return `${baseStyles} bg-green-50 text-green-800 border border-green-200`;
      case "action":
        return `${baseStyles} bg-blue-50 text-blue-800 border border-blue-200`;
      default:
        return message.sender === "user"
          ? `${baseStyles} bg-blue-600 text-white`
          : `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case "error":
        return <AlertCircle size={14} className="text-red-500" />;
      case "success":
        return <CheckCircle size={14} className="text-green-500" />;
      default:
        return message.sender === "user" ? (
          <User size={14} className="opacity-70" />
        ) : (
          <Bot size={14} className="opacity-70" />
        );
    }
  };

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={getMessageStyles()}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {message.type === "action" && (
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                Action
              </span>
            )}
          </div>
          
          {/* Copy button */}
          {message.content.length > 10 && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10"
              title="Copy message"
            >
              {copied ? (
                <CheckCircle size={12} className="text-green-500" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Metadata */}
        {message.metadata && (
          <div className="mt-2 text-xs opacity-60">
            {JSON.stringify(message.metadata, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
};

// Loading indicator component
const LoadingIndicator: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
      <div className="flex items-center gap-2 mb-1">
        <Bot size={14} className="opacity-70" />
        <span className="text-xs opacity-70">Thinking...</span>
      </div>
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Quick actions component
const QuickActions: React.FC<{
  actions: QuickAction[];
  onActionClick: (command: string) => void;
  disabled?: boolean;
}> = ({ actions, onActionClick, disabled }) => {
  if (!actions.length) return null;

  return (
    <div className="flex gap-2 mb-3 overflow-x-auto">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.command)}
          disabled={disabled || action.disabled}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

// Input component
const MessageInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
  disabled: boolean;
  isProcessing: boolean;
}> = ({ value, onChange, onSend, onKeyDown, placeholder, disabled, isProcessing }) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="w-full pr-10 pl-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
    />
    <button
      onClick={onSend}
      disabled={!value.trim() || isProcessing || disabled}
      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors ${
        value.trim() && !isProcessing && !disabled
          ? "text-blue-500 hover:bg-blue-50"
          : "text-gray-400 cursor-not-allowed"
      }`}
    >
      {isProcessing ? (
        <RefreshCw size={18} className="animate-spin" />
      ) : (
        <Send size={18} />
      )}
    </button>
  </div>
);

// Main chat interface component
const AIChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onClearMessages,
  isProcessing = false,
  placeholder = "Type your message...",
  disabled = false,
  showQuickActions = true,
  quickActions = [],
  maxHeight = "500px",
  className = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear error when messages change
  useEffect(() => {
    setError(null);
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isProcessing || disabled) return;

    const message = inputValue.trim();
    setInputValue("");
    setError(null);

    try {
      await onSendMessage(message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      setInputValue(message); // Restore input value on error
    }
  }, [inputValue, isProcessing, disabled, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleQuickAction = useCallback((command: string) => {
    setInputValue(command);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, [handleSendMessage]);

  const handleCopyMessage = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  }, []);

  return (
    <div className={`flex flex-col bg-white ${className}`}>
      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages container */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-center">
            <div>
              <Bot size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet. Start a conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={handleCopyMessage}
            />
          ))
        )}

        {isProcessing && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-gray-50">
        {/* Quick actions */}
        {showQuickActions && quickActions.length > 0 && (
          <QuickActions
            actions={quickActions}
            onActionClick={handleQuickAction}
            disabled={disabled || isProcessing}
          />
        )}

        {/* Message input */}
        <MessageInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          isProcessing={isProcessing}
        />

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearMessages}
              disabled={disabled || isProcessing || messages.length === 0}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear all messages"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;