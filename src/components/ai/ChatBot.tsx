"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

import { useUiStore } from "@/store/useUiStore";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrencyVND } from "@/lib/utils";

type ChatRecord = {
  role: "user" | "assistant";
  content: string;
};

type Suggestion = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
};

const demoMessages: ChatRecord[] = [
  {
    role: "assistant",
    content:
      "Xin chào, tôi có thể tư vấn size, màu sắc và gợi ý sản phẩm phù hợp theo dữ liệu thật của dự án.",
  },
];

export function ChatBot() {
  const isOpen = useUiStore((state) => state.isChatOpen);
  const setChatOpen = useUiStore((state) => state.setChatOpen);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatRecord[]>(demoMessages);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const quickReplies = useMemo(
    () => [
      "Mua điện thoại dưới 10 triệu",
      "Tư vấn size áo nam",
      "Gợi ý mỹ phẩm cho da dầu",
    ],
    [],
  );

  async function handleSubmit(nextValue?: string) {
    const content = (nextValue ?? value).trim();
    if (!content || loading) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data?.reply ??
            "Tôi đã ghi nhận yêu cầu nhưng hiện chưa thể phản hồi chi tiết.",
        },
      ]);
      setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Kết nối AI đang gặp sự cố. Vui lòng thử lại sau ít phút.",
        },
      ]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full shopee-gradient text-white shadow-2xl"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="flex items-center justify-between shopee-gradient px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">Shopee AI Assistant</p>
          <p className="text-xs text-white/80">Tư vấn bán hàng tiếng Việt</p>
        </div>
        <button
          type="button"
          onClick={() => setChatOpen(false)}
          className="rounded-full p-2 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-96 space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={`${message.role}-${index}`}
            role={message.role}
            content={message.content}
          />
        ))}
        {loading && (
          <ChatMessage
            role="assistant"
            content="AI đang phân tích dữ liệu sản phẩm..."
          />
        )}
        {suggestions.length > 0 && (
          <div className="space-y-2 rounded-2xl bg-bg p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Gợi ý sản phẩm
            </p>
            <div className="space-y-2">
              {suggestions.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex gap-3 rounded-2xl bg-white p-2 shadow-sm"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium text-text-primary">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-primary">
                      {formatCurrencyVND(product.price)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-black/5 p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => {
                setValue(reply);
                void handleSubmit(reply);
              }}
              className="rounded-full bg-bg px-3 py-1.5 text-xs font-medium text-text-primary"
            >
              {reply}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
          className="flex gap-2"
        >
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Nhập câu hỏi..."
            className="h-11 rounded-2xl"
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-11 rounded-2xl px-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
